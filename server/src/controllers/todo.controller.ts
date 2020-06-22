import { Response, Request } from 'express';
import { User, UserDocument } from '../models/User';
import { Todo } from '../models/Todo';
import { RequestWithUser } from '../interfaces/IResponse';
import webpush from 'web-push';

declare global {
  interface PromiseConstructor {
    allSettled: <T>(arr: Promise<T>[]) => Promise<T>[];
  }
}

export const getMyTodos = async (req: Request, res: Response) => {
  const user = req.user as UserDocument;
  const todos = await Todo.findTodosByCreatorId(user.id);
  res.json(todos);
};

export const getMyAndSharedTodos = async (
  req: RequestWithUser,
  res: Response
) => {
  const allTodos = await Todo.findAllUserRelatedTodos(req.user.id);
  res.json(allTodos);
};

export const getSharedTodos = async (req: RequestWithUser, res: Response) => {
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
    !(todo.shared as UserDocument[]).find(usr => usr.id === user.id)
  ) {
    return res.status(403).json({ error: { message: 'Unauthorised' } });
  }
  res.json(todo);
};

export const postTodo = async (req: Request, res: Response) => {
  const { title, records } = req.body;
  const user = req.user as UserDocument;
  const newTodo = await Todo.create({
    creator: user.id,
    title: title,
    records: records
  });
  res.json(newTodo);
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

  // Webpush
  const userSub = await User.findById(userId);
  const subPromises = (userSub.webSubscriptions || []).map(sub =>
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
  if (!todo.shared.some(sharedWith => sharedWith.equals(userId))) {
    return res
      .status(422)
      .json({ error: { message: 'Is not previously shared' } });
  }
  todo.shared = todo.shared.filter(usrId => !usrId.equals(userId));
  await todo.save();
  res.end();
};
