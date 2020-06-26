export enum TodoRequestTypes {
  edit = "edit",
  create = "create",
  delete = "delete",
}

export interface TodoRequest {
  id: string;
  type: TodoRequestTypes;
  createdAt: number;
  data?: any;
  meta?: any;
  syncing: boolean;
}
