import { Response, Request } from 'express';
import { User, UserDocument } from '../models/User';
import { Todo } from '../models/Todo';
import webpush from 'web-push';
import { TodoHistory } from '../models/TodoHistory';
import { TodoHistoryReason } from '../models/TodoHistoryReason';
import { TodoRecordDocument } from '../models/TodoRecord';
import { Notification, NotificationDocument } from '../models/Notification';

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
  const newTodo = await Todo.build({
    creator: user.id,
    title: title,
    records: records,
  });

  // Save history record;
  const historyRecord = await TodoHistory.build({
    userIds: [user.id],
    todo: newTodo,
    reason: TodoHistoryReason.created,
  });
  res.json(newTodo);
};

export const editTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const { title, records } = req.body as {
    title: string;
    records: TodoRecordDocument[];
  };

  const todo = await Todo.findTodoById(todoId);
  if (!todo) {
    return res.status(400).json({ errors: [{ message: 'not found' }] });
  }

  if (!todo.creator.equals(req.user.id)) {
    return res.status(403).json({ errors: [{ message: 'Unathorized' }] });
  }

  title && (todo.title = title);
  records && (todo.records = records);
  const savedTodo = await todo.save();

  console.log('todo', todo);

  // Savee history record
  const historyRecord = await TodoHistory.build({
    userIds: [req.user.id],
    todo: savedTodo,
    reason: TodoHistoryReason.updated,
  });
  res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const todo = await Todo.findTodoById(todoId);
  if (!todo) {
    return res.status(400).json({ errors: [{ message: 'not found' }] });
  }
  if (!todo.creator.equals(req.user.id)) {
    return res.status(403).json({ errors: [{ message: 'Unathorized' }] });
  }
  await todo.remove();

  // Save history record
  const historyRecord = await TodoHistory.build({
    userIds: [req.user.id],
    todo: todo,
    reason: TodoHistoryReason.deleted,
  });

  // Create notification documents for all shared users
  await Promise.all(
    historyRecord.userId.reduce(
      (promises: Promise<NotificationDocument>[], usr) => {
        if (usr !== req.user.id) {
          promises.push(
            Notification.build({
              sender: req.user.id,
              recipient: usr,
              reason: TodoHistoryReason.deleted,
              data: todo.toJSON(),
            })
          );
        }
        return promises;
      },
      []
    )
  );
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

  const populatedTodo = await Todo.findTodoById(todoId);

  // Save history record
  await TodoHistory.build({
    userIds: [user.id],
    todo: populatedTodo,
    reason: TodoHistoryReason.shared,
  });

  // Create notification document
  await Notification.build({
    sender: req.user.id,
    recipient: userId,
    reason: TodoHistoryReason.shared,
    data: populatedTodo.toJSON(),
  });

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

  const populatedTodo = await Todo.findTodoById(todoId);

  // Savee history record
  const historyRecord = await TodoHistory.build({
    userIds: [user.id, userId],
    todo: populatedTodo,
    reason: TodoHistoryReason.unshared,
  });

  // Create notification document
  await Notification.build({
    sender: req.user.id,
    recipient: userId,
    reason: TodoHistoryReason.unshared,
    data: populatedTodo.toJSON(),
  });

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
  );
  console.log('changes', changes);

  res.json({ items: changes, lastTimeUpdated: timeUpdated });
};
