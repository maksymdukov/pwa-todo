import mongoose, { Schema, Types } from 'mongoose';
import { TodoRecordDocument, todoRecordSchema } from './TodoRecord';
import { UserDocument } from './User';
import { getPaginationQuery, PaginatedOutput } from '../util/pagination';

export type TodoDocument = mongoose.Document & {
  creator: Types.ObjectId | UserDocument;
  title: string;
  created: Date;
  records: TodoRecordDocument[];
  shared: (Types.ObjectId | UserDocument)[];
};

interface TodoBuildAttrs {
  creator: string;
  title: string;
  records: TodoRecordDocument[];
}

export type TodoModel = mongoose.Model<TodoDocument> & {
  build: (attrs: TodoBuildAttrs) => Promise<TodoDocument>;
  findTodosByCreatorId: (
    this: TodoModel,
    creatorId: string
  ) => Promise<TodoDocument[]>;
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
    userId: string,
    page?: string,
    size?: string
  ) => Promise<PaginatedOutput<TodoDocument>>;
};

const todoSchema = new mongoose.Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    created: { type: Date, default: Date.now },
    records: [todoRecordSchema],
    shared: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: false }
);

todoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    ret.createdAt = new Date(ret.createdAt).getTime();
    ret.updatedAt = new Date(ret.updatedAt).getTime();
  },
});

const findTodosByCreatorId: TodoModel['findTodosByCreatorId'] = async function (
  userId
) {
  return this.find({ creator: userId }, { createdAt: 0, updatedAt: 0 })
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile')
    .exec();
};

const findTodoById: TodoModel['findTodoById'] = async function (todoId) {
  return this.findById(todoId)
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile');
};

const findTodosBySharedId: TodoModel['findTodosBySharedId'] = async function (
  userId
) {
  // @ts-ignore
  return this.find({ shared: userId }, { shared: 0 }).populate(
    'creator',
    'email id profile'
  );
};

const findAllUserRelatedTodos: TodoModel['findAllUserRelatedTodos'] = async function (
  userId,
  page,
  size
) {
  const timestamp = Date.now();
  const { pg, sz, pgQuery } = getPaginationQuery({ page, size });

  const query: mongoose.FilterQuery<TodoDocument> = {
    $or: [
      { creator: mongoose.Types.ObjectId(userId) },
      { shared: mongoose.Types.ObjectId(userId) },
    ],
  };
  const todos = await this.find(query)
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile')
    .limit(pgQuery.limit)
    .skip(pgQuery.skip)
    .sort({ updatedAt: -1 });
  const total = await this.countDocuments(query);
  const sanitizedTotos = todos.map((doc) => {
    const todo = doc.toJSON();
    if ((todo.creator as UserDocument).id !== userId) {
      todo.shared = todo.shared.filter(
        (shared: UserDocument) => shared.id === userId
      );
    }
    return todo;
  });
  return {
    items: sanitizedTotos,
    page: pg,
    size: sz,
    total,
    timestamp,
  };
};

const build: TodoModel['build'] = async ({ creator, records, title }) => {
  const newTodo = new Todo({
    creator: creator,
    title: title,
    records: records,
  });
  await newTodo.save();
  await newTodo
    .populate('creator', 'email id profile')
    .populate('shared', 'email id profile')
    .execPopulate();
  return newTodo;
};

todoSchema.statics.build = build;
todoSchema.statics.findTodosByCreatorId = findTodosByCreatorId;
todoSchema.statics.findTodoById = findTodoById;
todoSchema.statics.findTodosBySharedId = findTodosBySharedId;
todoSchema.statics.findAllUserRelatedTodos = findAllUserRelatedTodos;

export const Todo = mongoose.model<TodoDocument, TodoModel>('Todo', todoSchema);
