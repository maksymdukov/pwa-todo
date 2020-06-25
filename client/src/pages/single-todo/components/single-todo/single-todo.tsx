import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import TodoHeader from "pages/single-todo/components/todo-header";
import TodoRecords from "pages/single-todo/components/todo-records";
import { useStyles } from "./single-todo.styles";
import { useDispatch, useSelector } from "react-redux";
import { getTodoItemState } from "store/todo/todo.selectors";
import SaveTodoBtn from "./elements/save-todo-btn";
import { ITodo, ITodoRecord } from "models/ITodo";
import { postTodo, setSingleTodo } from "../../../../store/todo/todo.actions";
import { getSyncState } from "store/todos/todos.selectors";

type SingleTodoProps = RouteComponentProps<{ id?: string }> & {
  isNew?: boolean;
};

const SingleTodo = ({ match, isNew }: SingleTodoProps) => {
  const classes = useStyles();
  const todoToEdit = useSelector(getTodoItemState);
  const syncing = useSelector(getSyncState);
  const dispatch = useDispatch();
  const [todo, setTodo] = useState<ITodo>(todoToEdit);

  useEffect(() => {
    if (isNew) {
      return;
    }
    if (match.params.id && !syncing) {
      // fetch from DB if not new
      dispatch(setSingleTodo(match.params.id));
    } else {
      // TODO
      // redirect
    }
  }, [isNew, dispatch, match.params.id, syncing]);

  useEffect(() => {
    setTodo(todoToEdit);
  }, [setTodo, todoToEdit]);

  const changeTodoRecords = useCallback(
    (newRecordsState: ITodoRecord[]) => {
      setTodo((prevState) => ({
        ...prevState,
        records: newRecordsState,
      }));
    },
    [setTodo]
  );

  const onSaveClick = () => {
    dispatch(
      postTodo({
        todo: {
          title: todo.title,
          records: todo.records,
          ...(!isNew && { id: todo.id }),
        },
        isNew: !!isNew,
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
