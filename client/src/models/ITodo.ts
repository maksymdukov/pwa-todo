export interface ITodo {
  id: string;
  title: string;
  ownerId: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPicture?: string;
  created: string;
  records: ITodoRecord[];
}

export interface ITodoRecord {
  id: string;
  content: string;
  done: boolean;
}

export type INewTodo = Pick<ITodo, "title" | "records">;
