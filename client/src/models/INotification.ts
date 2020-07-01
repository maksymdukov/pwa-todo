import { UserProfile } from "store/user/reducer";
import { ISharedUser, ITodo } from "./ITodo";
import { TodoHistoryReason } from "./TodoHistoryReason";

export interface INotification {
  id: string;
  sender: ISharedUser;
  recipient: ISharedUser;
  reason: TodoHistoryReason;
  data: ITodo;
}
