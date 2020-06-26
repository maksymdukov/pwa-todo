import mongoose from 'mongoose';
import { TodoHistoryReason } from './TodoHistoryReason';
import { TodoDocument, todoSchema } from './Todo';

export interface TodoHistoryDocument extends mongoose.Document {
  userId: string;
  todo: mongoose.Types.ObjectId | TodoDocument;
  reason: TodoHistoryReason;
}

export interface TodoHistoryAttrs {
  userId: string;
  todo: TodoDocument;
  reason: TodoHistoryReason;
}

export interface TodoHistoryModel extends mongoose.Model<TodoHistoryDocument> {
  build(attrs: TodoHistoryAttrs): Promise<TodoHistoryDocument>;
}

export const todoHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
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
  const history = new TodoHistory({
    userId: attrs.userId,
    todo: attrs.todo.toJSON(),
    reason: attrs.reason,
  });
  return history.save();
};

todoHistorySchema.statics.build = build;

export const TodoHistory = mongoose.model<
  TodoHistoryDocument,
  TodoHistoryModel
>('TodoHistory', todoHistorySchema);
