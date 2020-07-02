import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export const getUnreadNotifcations = async (req: Request, res: Response) => {
  const { page, size } = req.query as {
    page: string | undefined;
    size: string | undefined;
  };
  const notifications = await Notification.findReadOrUnread({
    page,
    size,
    recipientId: req.user.id,
    read: false,
  });
  res.json(notifications);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const total = await Notification.countReadOrUnread({
    recipientId: req.user.id,
    read: false,
  });
  res.json({ total });
};

export const getReadNotifcations = async (req: Request, res: Response) => {
  const { page, size } = req.query as {
    page: string | undefined;
    size: string | undefined;
  };
  const notifications = await Notification.findReadOrUnread({
    page,
    size,
    recipientId: req.user.id,
    read: true,
  });
  res.json(notifications);
};

export const markNotificationsRead = async (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };
  const resp = await Notification.markRead({ userId: req.user.id, ids });
  res.json({ n: resp.n });
};
