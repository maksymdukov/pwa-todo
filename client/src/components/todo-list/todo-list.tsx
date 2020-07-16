import React from "react";
import { Theme } from "@material-ui/core/styles";
import TodoListItem from "./components/todo-list-item/todo-list-item";
import { ITodoListItem } from "models/ITodoListItem";
import { List, useMediaQuery, Typography } from "@material-ui/core";
import { getUserState } from "store/user/selectors";
import { useSelector } from "react-redux";
import { getConnetionStatus } from "store/tech/tech.selectors";
import MansoryGrid from "./components/mansory-grid/mansory-grid";

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
    <MansoryGrid itemMargin={16} itemWidth={250}>
      {new Array(15).fill(0).map((itm, idx) => (
        <div key={idx}>
          idx: {idx}
          <p>ABC</p>
          {idx % 2 === 0 && <p>ABC2</p>}
          {idx % 3 === 0 && <p>ABC3</p>}
          {idx % 4 === 0 && <p>ABC4</p>}
        </div>
      ))}
    </MansoryGrid>
  );
};

export default TodoList;
