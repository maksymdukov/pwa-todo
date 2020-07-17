import React from "react";
import { ITodoListItem } from "models/ITodoListItem";
import { Typography, List } from "@material-ui/core";
import { getUserState } from "store/user/selectors";
import { useSelector } from "react-redux";
import { getConnetionStatus, getTodoViewType } from "store/tech/tech.selectors";
import MansoryGrid from "./components/mansory-grid/mansory-grid";
import MansoryGridItem from "./components/mansory-grid-item/mansory-grid-item";
import { TodoViewType } from "store/tech/tech.reducer";
import TodoListItem from "./components/todo-list-item/todo-list-item";

interface TodoListProps {
  todos: ITodoListItem[];
}

const TodoList = ({ todos }: TodoListProps) => {
  const userState = useSelector(getUserState);
  const todoView = useSelector(getTodoViewType);
  const connetionStatus = useSelector(getConnetionStatus);

  return (
    <>
      {!todos.length && (
        <Typography variant="body1" align="center">
          No todos yet
        </Typography>
      )}
      {todoView === TodoViewType.masonry && (
        <MansoryGrid itemMargin={16} itemWidth={250}>
          {todos.map((todo) => (
            <MansoryGridItem
              key={todo.id}
              todo={todo}
              userState={userState}
              connetionStatus={connetionStatus}
            />
          ))}
        </MansoryGrid>
      )}
      {todoView === TodoViewType.list && (
        <List>
          {todos.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              userState={userState}
              connetionStatus={connetionStatus}
            />
          ))}
        </List>
      )}
    </>
  );
};

export default TodoList;
