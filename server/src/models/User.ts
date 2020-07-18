import bcrypt from 'bcrypt';
import mongoose, { MongooseFilterQuery } from 'mongoose';
import { ProfileDocument, profileSchema } from './Profile';
import { WebSubscription } from '../interfaces/IWebSubscription';
import { escapeRegExp } from '../util/regexp';
import { SendResult, WebPushError } from 'web-push';
import { sendWebPushNotification } from '../services/webpush';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../config/authentication/token';
import { randomBytes } from 'crypto';

export enum AuthProviders {
  email = 'email',
  facebook = 'facebookId',
  google = 'googleId',
}

const EMAIL_ACTIVATION_EXPIRATION = 1000 * 3600 * 30; // 30 hours

export type UserDocument = mongoose.Document & {
  email: string;
  activated: boolean;
  emailActivationToken?: string;
  emailActivationExpires?: Date;
  linkToken?: string;
  linkTokenExpires?: Date;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  facebookId?: string;
  googleId?: string;
  linked: {
    googleId?: string;
    googleEmail?: string;
    facebookId?: string;
    facebookEmail?: string;
  };
  tokens: AuthToken[];
  webSubscriptions: WebSubscription[];
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  profile: ProfileDocument;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateAuthTokens(
    this: UserDocument
  ): Promise<{ accessToken: string; refreshToken: string }>;
  generateEmailActivationToken(this: UserDocument): Promise<string>;
  getProfile(this: UserDocument): IProfile;
};

export type UserModel = mongoose.Model<UserDocument> & {
  findByExternalId: (
    provider: AuthProviders,
    id: string
  ) => Promise<UserDocument | null>;
  createUser: (
    provider: AuthProviders,
    newUser: {
      id?: string;
      password?: string;
      email: string;
      firstName: string;
      lastName: string;
      picture?: string;
    }
  ) => Promise<UserDocument | null>;
  getUsers: (
    this: UserModel,
    attrs: { email?: string }
  ) => Promise<Pick<UserDocument, 'email' | 'profile' | 'id'>[]>;
  sendNotification(
    this: UserModel,
    userId: string,
    data: unknown
  ): Promise<PromiseSettledResult<SendResult>[]>;
  removeSubscription(
    this: UserModel,
    userId: string,
    endpoint: string
  ): Promise<void>;
  findByEmail(this: UserModel, email: string): Promise<UserDocument | null>;
  findByPrimaryEmail(
    this: UserModel,
    email: string
  ): Promise<UserDocument | null>;
};

interface IProfile {
  linked?: UserDocument['linked'];
  facebookId?: string;
  googleId?: string;
  profile: ProfileDocument;
}

export interface AuthToken {
  accessToken: string;
  kind: string;
}

export const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    activated: { type: Boolean, required: true, default: false },
    emailActivationToken: String,
    emailActivationExpires: Date,
    linkToken: String,
    linkTokenExpires: Date,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebookId: String,
    googleId: String,
    linked: {
      type: {
        googleId: String,
        googleEmail: String,
        facebookId: String,
        facebookEmail: String,
      },
      default: {},
    },
    tokens: Array,
    webSubscriptions: [
      { endpoint: String, keys: { p256dh: String, auth: String } },
    ],
    refreshToken: String,
    refreshTokenExpiresAt: Date,
    profile: profileSchema,
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  try {
    const hash = await bcrypt.hash(user.password, 8);
    user.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const comparePassword: UserDocument['comparePassword'] = async function (
  candidatePassword
) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const findByExternalId: UserModel['findByExternalId'] = async function (
  provider,
  id
) {
  return this.findOne({
    $or: [{ [provider]: id }, { [`linked.${provider}`]: id }],
  });
};

const findByEmail: UserModel['findByEmail'] = async function (email) {
  return this.findOne({
    $or: [
      { email },
      { 'linked.googleEmail': email },
      { 'linked.facebookEmail': email },
    ],
  });
};

const findByPrimaryEmail: UserModel['findByPrimaryEmail'] = async function (
  email
) {
  return this.findOne({
    email,
  });
};

const createUser: UserModel['createUser'] = async function (
  provider,
  { id, email, firstName, lastName, picture, password }
) {
  if (provider === AuthProviders.email) {
    const user = new User({
      email,
      activated: false,
      emailActivationToken: randomBytes(12).toString('hex'),
      emailActivationExpires: new Date(
        Date.now() + EMAIL_ACTIVATION_EXPIRATION
      ),
      password,
      profile: {
        firstName,
        lastName,
        picture,
      },
    });
    return user.save();
  } else {
    return this.create({
      email: email,
      activated: true,
      [provider]: id,
      profile: {
        firstName,
        lastName,
        picture,
      },
    });
  }
};

const getUsers: UserModel['getUsers'] = async function ({ email }) {
  const query: MongooseFilterQuery<UserDocument> = {};
  if (typeof email === 'string' && email !== '') {
    query.email = new RegExp(`^${escapeRegExp(email)}`);
  }
  return this.find(
    query,
    {
      id: 1,
      email: 1,
      'profile.firtName': 1,
      'profile.lastName': 1,
      'profile.picture': 1,
    },
    { limit: 10 }
  );
};

const sendNotification: UserModel['sendNotification'] = async function (
  userId,
  data
) {
  const user = await this.findById(userId);
  const subPromises = (user.webSubscriptions || []).map((sub) =>
    sendWebPushNotification(sub, data)
  );
  const results = await Promise.allSettled(subPromises);

  // cleanup invalid subscriptions
  results.forEach((res) => {
    if (res.status === 'rejected') {
      const error: WebPushError = res.reason;
      if (error.statusCode === 404 || error.statusCode === 410) {
        // remove subscription. it's no longer valid
        this.removeSubscription(userId, error.endpoint);
      }
    }
  });

  return results;
};

const removeSubscription: UserModel['removeSubscription'] = async function (
  userId,
  endpoint
) {
  return User.updateOne(
    { _id: userId },
    { $pull: { webSubscriptions: { endpoint } } }
  );
};

const generateAuthTokens: UserDocument['generateAuthTokens'] = async function () {
  const accessToken = generateAccessToken(this);
  // generate refresh token, put it into DB along with expiration timestamp
  const { refreshToken, expiresAt } = generateRefreshToken();
  this.refreshToken = refreshToken;
  this.refreshTokenExpiresAt = expiresAt;
  await this.save();
  return { accessToken, refreshToken };
};

const getProfile: UserDocument['getProfile'] = function () {
  return {
    linked: this.linked,
    googleId: this.googleId,
    facebookId: this.facebookId,
    profile: this.profile,
  };
};

const generateEmailActivationToken: UserDocument['generateEmailActivationToken'] = async function () {
  this.emailActivationToken = randomBytes(12).toString('hex');
  this.emailActivationExpires = new Date(
    Date.now() + EMAIL_ACTIVATION_EXPIRATION
  );
  await this.save();
  return this.emailActivationToken;
};

userSchema.methods.comparePassword = comparePassword;
userSchema.methods.generateAuthTokens = generateAuthTokens;
userSchema.methods.generateEmailActivationToken = generateEmailActivationToken;
userSchema.methods.getProfile = getProfile;
userSchema.statics.findByExternalId = findByExternalId;
userSchema.statics.createUser = createUser;
userSchema.statics.getUsers = getUsers;
userSchema.statics.sendNotification = sendNotification;
userSchema.statics.removeSubscription = removeSubscription;
userSchema.statics.findByEmail = findByEmail;
userSchema.statics.findByPrimaryEmail = findByPrimaryEmail;

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
