import mongoose, { Schema, Types } from 'mongoose';
import { TodoHistoryReason } from './TodoHistoryReason';
import { UserDocument } from './User';
import { TodoDocument } from './Todo';
import { getPaginationQuery, PaginatedOutput } from '../util/pagination';

export interface NotificationDocument extends mongoose.Document {
  sender: Types.ObjectId | UserDocument;
  recipient: Types.ObjectId | UserDocument;
  reason: TodoHistoryReason;
  data: TodoDocument;
  read: boolean;
}
export interface NotificationModel
  extends mongoose.Model<NotificationDocument> {
  build(
    this: NotificationModel,
    attrs: NotificationBuildAttrs
  ): Promise<NotificationDocument>;
  findReadOrUnread(
    this: NotificationModel,
    attrs: FindUnreadAttrs
  ): Promise<PaginatedOutput<NotificationDocument>>;
  countReadOrUnread(
    this: NotificationModel,
    attrs: { recipientId: string; read: boolean }
  ): Promise<number>;
  markRead(
    this: NotificationModel,
    attrs: { ids: string[]; userId: string }
  ): Promise<{ n: number }>;
}
export interface NotificationBuildAttrs {
  sender: string;
  recipient: string;
  reason: TodoHistoryReason;
  data: NotificationDocument['data'];
}

export interface FindUnreadAttrs {
  page?: string;
  size?: string;
  recipientId: string;
  read: boolean;
}

export const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      enum: Object.values(TodoHistoryReason),
      required: true,
    },
    data: { type: Object, required: true },
    read: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
      },
    },
  }
);

const build: NotificationModel['build'] = async function (attrs) {
  const notification = new Notification({
    sender: attrs.sender,
    recipient: attrs.recipient,
    reason: attrs.reason,
    data: attrs.data,
  });
  return notification.save();
};

const findReadOrUnread: NotificationModel['findReadOrUnread'] = async function ({
  page,
  size,
  recipientId,
  read,
}) {
  const pagination = getPaginationQuery({ page, size });
  const totalUnread = await this.countReadOrUnread({ recipientId, read });
  const items = await this.find({ recipient: recipientId, read })
    .skip(pagination.pgQuery.skip)
    .limit(pagination.pgQuery.limit)
    .sort({ createdAt: -1 })
    .populate('sender', 'email id profile')
    .populate('recipient', 'email id profile');
  return {
    total: totalUnread,
    page: pagination.pg,
    size: pagination.sz,
    items,
  };
};

const countReadOrUnread: NotificationModel['countReadOrUnread'] = async function ({
  recipientId,
  read,
}) {
  return this.find({ recipient: recipientId, read }).countDocuments();
};

const markRead: NotificationModel['markRead'] = async function ({
  ids,
  userId,
}) {
  return this.updateMany(
    { _id: { $in: ids }, recipient: userId },
    { read: true }
  );
};

notificationSchema.statics.build = build;
notificationSchema.statics.findReadOrUnread = findReadOrUnread;
notificationSchema.statics.countReadOrUnread = countReadOrUnread;
notificationSchema.statics.markRead = markRead;

export const Notification = mongoose.model<
  NotificationDocument,
  NotificationModel
>('Notification', notificationSchema);
