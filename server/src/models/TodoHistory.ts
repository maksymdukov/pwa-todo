import mongoose from 'mongoose';
import { TodoHistoryReason } from './TodoHistoryReason';
import { TodoDocument } from './Todo';

export interface TodoHistoryDocument extends mongoose.Document {
  userId: string;
  todo: mongoose.Types.ObjectId | TodoDocument;
  reason: TodoHistoryReason;
}

export interface TodoHistoryAttrs {
  userId: string;
  todoId: string;
  reason: TodoHistoryReason;
}

export interface TodoHistoryModel extends mongoose.Model<TodoHistoryDocument> {
  build(attrs: TodoHistoryAttrs): TodoHistoryDocument;
}

export const todoHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    todo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Todo',
      required: true,
    },
    reason: {
      type: String,
      enum: Object.values(TodoHistoryReason),
      required: true,
    },
  },
  { timestamps: true }
);

const build: TodoHistoryModel['build'] = function (attrs) {
  return new TodoHistory({
    userId: attrs.userId,
    todo: attrs.todoId,
    reason: attrs.reason,
  });
};

todoHistorySchema.statics.build = build;

export const TodoHistory = mongoose.model<
  TodoHistoryDocument,
  TodoHistoryModel
>('TodoHistory', todoHistorySchema);
