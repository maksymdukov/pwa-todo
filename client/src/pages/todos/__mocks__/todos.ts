import { ITodoListItem } from "models/ITodoListItem";

export const mockedTodos: ITodoListItem[] = [
  {
    id: "id1",
    created: new Date().toISOString(),
    ownerFirstName: "Maksym",
    ownerLastName: "Dukov",
    ownerId: "123123123",
    title: "Trip to America"
  },
  {
    id: "id2",
    created: new Date().toISOString(),
    ownerFirstName: "Ivan",
    ownerLastName: "Ivanov",
    ownerId: "1231231235",
    title: "Exams"
  }
];
