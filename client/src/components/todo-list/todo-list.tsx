import React from "react";
import { Theme } from "@material-ui/core/styles";
import TodoListItem from "./components/todo-list-item/todo-list-item";
import { ITodoListItem } from "models/ITodoListItem";
import { List, useMediaQuery, Typography } from "@material-ui/core";

interface TodoListProps {
  todos: ITodoListItem[];
}

const TodoList = ({ todos }: TodoListProps) => {
  const matches = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  return matches ? (
    <List>
      {todos.map((todo) => (
        <TodoListItem key={todo.id} todo={todo} />
      ))}
      {!todos.length && (
        <Typography variant="body1" align="center">
          No todos yet
        </Typography>
      )}
    </List>
  ) : (
    <div>Cards for desktop</div>
  );
};

export default TodoList;
