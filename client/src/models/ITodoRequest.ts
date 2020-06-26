import { ITodo } from "./ITodo";

export enum TodoRequestTypes {
  edit = "edit",
  create = "create",
  delete = "delete",
}

export interface TodoRequest {
  id: string;
  type: TodoRequestTypes;
  createdAt: number;
  data: any;
  syncing: boolean;
}
