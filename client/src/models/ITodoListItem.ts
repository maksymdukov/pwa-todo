import { ITodo } from "models/ITodo";

export type ITodoListItem = Pick<
  ITodo,
  | "id"
  | "title"
  | "ownerId"
  | "ownerFirstName"
  | "ownerLastName"
  | "ownerPicture"
  | "created"
>;
