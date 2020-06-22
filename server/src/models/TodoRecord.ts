import mongoose from 'mongoose';

export type TodoRecordDocument = mongoose.Document & {
  id: Date;
  content: string;
  done: boolean;
};

export type TodoRecordModel = mongoose.Model<TodoRecordDocument> & {};

export const todoRecordSchema = new mongoose.Schema(
  {
    id: Date,
    content: String,
    done: { type: Boolean, default: false }
  },
  { timestamps: true, _id: false }
);

export const TodoRecord = mongoose.model<TodoRecordDocument, TodoRecordModel>(
  'TodoRecord',
  todoRecordSchema
);
