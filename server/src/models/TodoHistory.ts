import mongoose from 'mongoose';
import { TodoHistoryReason } from './TodoHistoryReason';
import { TodoDocument, todoSchema } from './Todo';
import { UserDocument } from './User';
import { io } from '../server';
import { SocketEvents } from '../config/socketio';

export interface TodoHistoryDocument extends mongoose.Document {
  userId: string[];
  todo: mongoose.Types.ObjectId | TodoDocument;
  reason: TodoHistoryReason;
}

export interface TodoHistoryAttrs {
  userIds: string[];
  todo: TodoDocument;
  reason: TodoHistoryReason;
}

export interface TodoHistoryModel extends mongoose.Model<TodoHistoryDocument> {
  build(attrs: TodoHistoryAttrs): Promise<TodoHistoryDocument>;
}

export const todoHistorySchema = new mongoose.Schema(
  {
    userId: [
      {
        type: String,
        required: true,
      },
    ],
    todo: {
      type: Object,
      required: true,
    },
    reason: {
      type: String,
      enum: Object.values(TodoHistoryReason),
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret._id;
      },
    },
  }
);

const build: TodoHistoryModel['build'] = async function (attrs) {
  const relatedUsers = (attrs.todo.shared as UserDocument[])
    .map((usr) => usr.id)
    .concat(attrs.userIds);

  const history = new TodoHistory({
    userId: relatedUsers,
    todo: attrs.todo.toJSON(),
    reason: attrs.reason,
  });
  const savedHistory = await history.save();

  // Send messages via SocketIO
  relatedUsers.forEach((usrId) => {
    io.to(usrId).emit(
      SocketEvents.newTodoChanges,
      JSON.stringify(savedHistory)
    );
  });
  return savedHistory;
};

todoHistorySchema.statics.build = build;

export const TodoHistory = mongoose.model<
  TodoHistoryDocument,
  TodoHistoryModel
>('TodoHistory', todoHistorySchema);
