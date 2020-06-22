import React from "react";
import TodoList from "components/todo-list";
import { mockedTodos } from "pages/todos/__mocks__/todos";
import { RouteComponentProps } from "react-router";
import Spinner from "components/spinner";

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
  return (
    <div>
      {getPageLabel(scope)}
      <Spinner isActive />
      <TodoList todos={mockedTodos} />
    </div>
  );
};

export default TodosView;
