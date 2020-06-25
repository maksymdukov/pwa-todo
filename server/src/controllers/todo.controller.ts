import { Response, Request } from 'express';
import { User, UserDocument } from '../models/User';
import { Todo } from '../models/Todo';
import webpush from 'web-push';
import { TodoHistory } from '../models/TodoHistory';
import { TodoHistoryReason } from '../models/TodoHistoryReason';
import { TodoRecordDocument } from '../models/TodoRecord';

export const getMyTodos = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const todos = await Todo.findTodosByCreatorId(user.id);
  res.json(todos);
};

export const getMyAndSharedTodos = async (req: Request, res: Response) => {
  const { page, size } = req.query as { page: string; size: string };
  const allTodos = await Todo.findAllUserRelatedTodos(req.user.id, page, size);
  res.json(allTodos);
};

export const getSharedTodos = async (req: Request, res: Response) => {
  const sharedWithMeTodos = await Todo.findTodosBySharedId(req.user.id);
  res.json(sharedWithMeTodos);
};

export const getTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const user = req.user as UserDocument;
  const todo = await Todo.findTodoById(todoId);
  if (!todo) {
    return res.status(400).json({ error: { message: 'not found' } });
  }
  if (
    (todo.creator as UserDocument).id !== user.id &&
    !(todo.shared as UserDocument[]).find((usr) => usr.id === user.id)
  ) {
    return res.status(403).json({ error: { message: 'Unauthorised' } });
  }
  res.json(todo);
};

export const postTodo = async (req: Request, res: Response) => {
  const { title, records } = req.body as {
    title: string;
    records: TodoRecordDocument[];
  };
  const user = req.user as UserDocument;
  const newTodo = new Todo({
    creator: user.id,
    title: title,
    records: records,
  });
  await newTodo.save();

  // Save history record;
  const historyRecord = TodoHistory.build({
    userId: user.id,
    todoId: newTodo.id,
    reason: TodoHistoryReason.created,
  });
  await historyRecord.save();
  res.json(newTodo);
};

export const editTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { title, records } = req.body as {
    title: string;
    records: TodoRecordDocument[];
  };

  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(400).json({ errors: [{ message: 'not found' }] });
  }

  if (!todo.creator.equals(req.user.id)) {
    return res.status(403).json({ errors: [{ message: 'Unathorized' }] });
  }

  title && (todo.title = title);
  records && (todo.records = records);
  await todo.save();

  // Savee history record
  const historyRecord = TodoHistory.build({
    userId: req.user.id,
    todoId: todo.id,
    reason: TodoHistoryReason.updated,
  });
  await historyRecord.save();
  res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(400).json({ errors: [{ message: 'not found' }] });
  }
  if (todo.creator !== req.user.id) {
    return res.status(403).json({ errors: [{ message: 'Unathorized' }] });
  }
  await todo.remove();

  // Save history record
  const historyRecord = TodoHistory.build({
    userId: req.user.id,
    todoId: todo.id,
    reason: TodoHistoryReason.deleted,
  });
  await historyRecord.save();

  res.json({});
};

export const shareTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { userId } = req.body;
  const user = req.user as UserDocument;
  const todo = await Todo.findById(todoId);
  if (userId === user.id) {
    return res
      .status(422)
      .json({ error: { message: 'Cannot share with yourself' } });
  }
  if (!todo) {
    return res.status(422).json({ error: { message: 'Todo not found' } });
  }
  if (todo.creator.toString() !== user.id) {
    return res.status(401).json({ error: { message: 'Unauthorised' } });
  }
  if (todo.shared.includes(userId)) {
    return res.status(422).json({ error: { message: 'Already shared' } });
  }
  todo.shared.push(userId);
  await todo.save();

  // Savee history record
  const historyRecord = TodoHistory.build({
    userId: userId,
    todoId: todo.id,
    reason: TodoHistoryReason.shared,
  });
  await historyRecord.save();

  // Webpush
  const userSub = await User.findById(userId);
  const subPromises = (userSub.webSubscriptions || []).map((sub) =>
    webpush.sendNotification(sub, JSON.stringify({ test: 'test' }))
  );
  await Promise.allSettled(subPromises);
  res.end();
};

export const revokeTodoShare = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { userId } = req.body;
  const user = req.user as UserDocument;
  const todo = await Todo.findById(todoId);
  if (!todo) {
    return res.status(422).json({ error: { message: 'Todo not found' } });
  }
  if (todo.creator.toString() !== user.id) {
    return res.status(401).json({ error: { message: 'Unauthorised' } });
  }
  if (!todo.shared.some((sharedWith) => sharedWith.equals(userId))) {
    return res
      .status(422)
      .json({ error: { message: 'Is not previously shared' } });
  }
  todo.shared = todo.shared.filter((usrId) => !usrId.equals(userId));
  await todo.save();

  // Savee history record
  const historyRecord = TodoHistory.build({
    userId: userId,
    todoId: todo.id,
    reason: TodoHistoryReason.unshared,
  });
  await historyRecord.save();

  res.end();
};

export const getChanges = async (req: Request, res: Response) => {
  const { lastTimeUpdated } = req.body;
  const timeUpdated = Date.now();

  const changes = await TodoHistory.find(
    {
      userId: req.user.id,
      createdAt: { $gt: lastTimeUpdated },
    },
    null,
    { sort: { createdAt: 1 } }
  )
    .populate({
      path: 'todo',
      populate: { path: 'shared', select: 'email profile' },
    })
    .populate({
      path: 'todo',
      populate: { path: 'creator', select: 'email profile id' },
    });

  console.log('changes', changes);

  res.json({ items: changes, lastTimeUpdated: timeUpdated });
};
