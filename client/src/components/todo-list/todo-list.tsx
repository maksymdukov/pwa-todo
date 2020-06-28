import React from "react";
import { Theme } from "@material-ui/core/styles";
import TodoListItem from "./components/todo-list-item/todo-list-item";
import { ITodoListItem } from "models/ITodoListItem";
import { List, useMediaQuery, Typography } from "@material-ui/core";
import { getUserState } from "store/user/selectors";
import { useSelector } from "react-redux";
import { getConnetionStatus } from "store/tech/tech.selectors";

interface TodoListProps {
  todos: ITodoListItem[];
}

const TodoList = ({ todos }: TodoListProps) => {
  const matches = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const userState = useSelector(getUserState);
  const connetionStatus = useSelector(getConnetionStatus);
  return matches ? (
    <List>
      {todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          userState={userState}
          connetionStatus={connetionStatus}
        />
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
