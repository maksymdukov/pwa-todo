import React from "react";
import TodoList from "components/todo-list";
import { RouteComponentProps } from "react-router";
import Spinner from "components/spinner";
import { useSelector } from "react-redux";
import {
  getTodoItems,
  getSyncState,
  getSharedWithMeTodos,
  getMyTodoItems,
} from "store/todos/todos.selectors";
import { TodosScopes } from "pages/todos/todo-scopes";
import { Typography } from "@material-ui/core";
import CreateTodoBtn from "../create-todo-btn/create-todo-btn";

type TodosViewProps = {
  scope: TodosScopes;
} & RouteComponentProps;

const getPageLabel = (scope: TodosScopes): string => {
  switch (scope) {
    case TodosScopes.all:
      return "All todos";
    case TodosScopes.my:
      return "My todos";
    case TodosScopes.shared:
      return "Todos shared with me";
    default:
      return "";
  }
};

const todosSelector = {
  [TodosScopes.all]: getTodoItems,
  [TodosScopes.shared]: getSharedWithMeTodos,
  [TodosScopes.my]: getMyTodoItems,
};

const TodosView = ({ scope }: TodosViewProps) => {
  const todoSelector = todosSelector[scope];
  const todos = useSelector(todoSelector);
  const syncing = useSelector(getSyncState);
  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        {getPageLabel(scope)}
      </Typography>
      <Spinner isActive={syncing && !todos.length} />
      <TodoList todos={todos} />
      {scope !== TodosScopes.shared && <CreateTodoBtn />}
    </div>
  );
};

export default TodosView;
