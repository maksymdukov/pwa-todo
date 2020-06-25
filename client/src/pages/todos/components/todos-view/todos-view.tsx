import React from "react";
import TodoList from "components/todo-list";
import { RouteComponentProps } from "react-router";
import Spinner from "components/spinner";
import { useSelector } from "react-redux";
import { getTodoItems, getSyncState } from "store/todos/todos.selectors";

type TodosScopes = "all" | "my" | "shared";

type TodosViewProps = {
  scope: TodosScopes;
} & RouteComponentProps;

const getPageLabel = (scope: TodosScopes): string => {
  switch (scope) {
    case "all":
      return "All todos";
    case "my":
      return "My todos";
    case "shared":
      return "Todos shared with me";
  }
};

const TodosView = ({ scope }: TodosViewProps) => {
  const todos = useSelector(getTodoItems);
  const syncing = useSelector(getSyncState);
  return (
    <div>
      {getPageLabel(scope)}
      <Spinner isActive={syncing && !todos.length} />
      <TodoList todos={todos} />
    </div>
  );
};

export default TodosView;
