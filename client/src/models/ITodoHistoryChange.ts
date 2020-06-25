import { ITodo } from "./ITodo";
import { TodoHistoryReason } from "./TodoHistoryReason";

export interface TodoHistoryChange {
  id: string;
  userId: string;
  todo: ITodo;
  reason: TodoHistoryReason;
  createdAt: string;
  updatedAt: string;
}
