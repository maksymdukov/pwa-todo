export interface ISharedUser {
  id: string;
  email: string;
  profile: { firstName: string; lastName: string; picture: string };
}

export interface ITodo {
  id: string;
  title: string;
  shared: ISharedUser[];
  creator: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      picture: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  created?: string;
  records: ITodoRecord[];
  createdAt: number;
  updatedAt: number;
  pending?: boolean;
}

export interface ITodoRecord {
  id: string;
  content: string;
  done: boolean;
}

export type INewTodo = Pick<ITodo, "title" | "records">;
