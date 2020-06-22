import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import TodoHeader from "pages/single-todo/components/todo-header";
import TodoRecords from "pages/single-todo/components/todo-records";
import { useStyles } from "./single-todo.styles";
import { useDispatch, useSelector } from "react-redux";
import { getTodoItemState } from "store/todo/todo.selectors";
import SaveTodoBtn from "./elements/save-todo-btn";
import { ITodo, ITodoRecord } from "models/ITodo";
import { postTodo } from "../../../../store/todo/todo.actions";

type SingleTodoProps = RouteComponentProps<{ id?: string }> & {
  isNew?: boolean;
};

const SingleTodo = ({ match, isNew }: SingleTodoProps) => {
  const classes = useStyles();
  const todoToEdit = useSelector(getTodoItemState);
  const dispatch = useDispatch();
  const [todo, setTodo] = useState<ITodo>(todoToEdit);

  useEffect(() => {
    if (isNew) {
      return;
    }
    // fetch from DB if not new
  }, [isNew, dispatch]);

  const changeTodoRecords = useCallback(
    (newRecordsState: ITodoRecord[]) => {
      setTodo(prevState => ({
        ...prevState,
        records: newRecordsState
      }));
    },
    [setTodo]
  );

  const onSaveClick = () => {
    dispatch(
      postTodo({
        title: todo.title,
        records: todo.records
      })
    );
  };

  return (
    <div className={classes.container}>
      Create new todo
      <TodoHeader setTodo={setTodo} todo={todo} />
      <TodoRecords
        todoRecords={todo.records}
        changeTodoRecords={changeTodoRecords}
      />
      <SaveTodoBtn onClick={onSaveClick} />
    </div>
  );
};

export default SingleTodo;
