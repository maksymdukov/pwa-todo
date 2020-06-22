import mongoose, { Schema, Types } from 'mongoose';
import { TodoRecordDocument, todoRecordSchema } from './TodoRecord';
import { UserDocument } from './User';

export type TodoDocument = mongoose.Document & {
  creator: Types.ObjectId | UserDocument;
  title: string;
  created: Date;
  records: TodoRecordDocument[];
  shared: (Types.ObjectId | UserDocument)[];
};

export type TodoModel = mongoose.Model<TodoDocument> & {
  findTodosByCreatorId: findTodosByCreatorIdFunction;
  findTodoById: (
    this: TodoModel,
    todoId: string
  ) => Promise<TodoDocument | null>;
  findTodosBySharedId: (
    this: TodoModel,
    userId: string
  ) => Promise<TodoDocument[] | null>;
  findAllUserRelatedTodos: (
    this: TodoModel,
    userId: string
  ) => Promise<TodoDocument[]>;
};

export type findTodosByCreatorIdFunction = (
  this: TodoModel,
  creatorId: string
) => Promise<TodoDocument[]>;

const todoSchema = new mongoose.Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    created: { type: Date, default: Date.now },
    records: [todoRecordSchema],
    shared: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: false }
);

todoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  }
});

const findTodosByCreatorId: findTodosByCreatorIdFunction = async function(
  userId
) {
  return this.find({ creator: userId }, { createdAt: 0, updatedAt: 0 })
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile')
    .exec();
};

const findTodoById: TodoModel['findTodoById'] = async function(todoId) {
  return this.findById(todoId)
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile');
};

const findTodosBySharedId: TodoModel['findTodosBySharedId'] = async function(
  userId
) {
  return this.find({ shared: userId }, { shared: 0 }).populate(
    'creator',
    'email id profile'
  );
};

const findAllUserRelatedTodos: TodoModel['findAllUserRelatedTodos'] = async function(
  userId
) {
  const todos = await this.find({
    $or: [{ creator: userId }, { shared: userId }]
  })
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile')
    .sort({ created: 1 });
  return todos.map(doc => {
    const todo = doc.toJSON();
    if ((todo.creator as UserDocument).id !== userId) {
      delete todo.shared;
    }
    return todo;
  });
};

todoSchema.statics.findTodosByCreatorId = findTodosByCreatorId;
todoSchema.statics.findTodoById = findTodoById;
todoSchema.statics.findTodosBySharedId = findTodosBySharedId;
todoSchema.statics.findAllUserRelatedTodos = findAllUserRelatedTodos;

export const Todo = mongoose.model<TodoDocument, TodoModel>('Todo', todoSchema);
