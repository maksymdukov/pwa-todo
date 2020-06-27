import bcrypt from 'bcrypt-nodejs';
import mongoose, { Document, MongooseFilterQuery } from 'mongoose';
import { ProfileDocument, profileSchema } from './Profile';
import { WebSubscription } from '../interfaces/IWebSubscription';
import { escapeRegExp } from '../util/regexp';

export enum AuthProviders {
  facebook = 'facebookId',
  google = 'googleId',
}

export type UserDocument = mongoose.Document & {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  facebookId: string;
  googleId: string;
  tokens: AuthToken[];
  webSubscriptions: WebSubscription[];
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  profile: ProfileDocument;
  comparePassword: comparePasswordFunction;
};

export type UserModel = mongoose.Model<UserDocument> & {
  findByExternalId: findByExternalId;
  createUser: createUser;
  getUsers: getUsersType;
};

type getUsersType = (
  this: UserModel,
  attrs: { email?: string }
) => Promise<Pick<UserDocument, 'email' | 'profile' | 'id'>[]>;

type findByExternalId = (
  provider: AuthProviders,
  id: string
) => Promise<UserDocument | null>;

type createUser = (
  provider: AuthProviders,
  newUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }
) => Promise<UserDocument | null>;

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) => void;

export interface AuthToken {
  accessToken: string;
  kind: string;
}

export const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, text: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    facebookId: String,
    twitterId: String,
    googleId: String,
    tokens: Array,
    webSubscriptions: [],
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
userSchema.pre('save', function save(next) {
  const user = this as UserDocument;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, undefined, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

const comparePassword: comparePasswordFunction = function (
  candidatePassword,
  cb
) {
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch);
    }
  );
};

const findByExternalId: findByExternalId = async function (provider, id) {
  return this.findOne({ [provider]: id });
};

const createUser: createUser = async function (
  provider,
  { id, email, firstName, lastName, picture }
) {
  const existingUser = await this.findOne({ email });
  if (existingUser) {
    // TODO
    // handle creating user with existing email through linking
    return null;
  }
  return this.create({
    email: email,
    [provider]: id,
    profile: {
      firstName,
      lastName,
      picture,
    },
  });
};

const getUsers: getUsersType = async function ({ email }) {
  const query: MongooseFilterQuery<UserDocument> = {};
  if (typeof email === 'string' && email !== '') {
    query.email = new RegExp(`^${escapeRegExp(email)}`);
  }
  return this.find(query, { id: 1, email: 1 }, { limit: 10 });
};

userSchema.methods.comparePassword = comparePassword;
userSchema.statics.findByExternalId = findByExternalId;
userSchema.statics.createUser = createUser;
userSchema.statics.getUsers = getUsers;

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
