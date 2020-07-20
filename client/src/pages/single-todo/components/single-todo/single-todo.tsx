import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import TodoHeader from "pages/single-todo/components/todo-header";
import TodoRecords from "pages/single-todo/components/todo-records";
import { useStyles } from "./single-todo.styles";
import { useDispatch, useSelector } from "react-redux";
import { getTodoItemState } from "store/todo/todo.selectors";
import SaveTodoBtn from "./elements/save-todo-btn";
import { ITodo, ITodoRecord } from "models/ITodo";
import { postTodo } from "store/todo/todo.actions";
import {
  getSyncState,
  getTodoItems,
  getTodoItemsInitialized,
} from "store/todos/todos.selectors";
import { getUserState } from "store/user/selectors";
import { SyncStatus } from "store/todos/todos.reducer";
import BackBtn from "components/buttons/back-btn";

type SingleTodoProps = RouteComponentProps<{ id?: string }> & {
  isNew?: boolean;
};

const SingleTodo = ({ match, isNew }: SingleTodoProps) => {
  const classes = useStyles();
  const history = useHistory();
  const todoToEdit = useSelector(getTodoItemState);
  const todos = useSelector(getTodoItems);
  const todosInitialized = useSelector(getTodoItemsInitialized);
  const syncStatus = useSelector(getSyncState);
  const dispatch = useDispatch();
  const [todo, setTodo] = useState<ITodo>(todoToEdit);
  const userProfile = useSelector(getUserState);

  const syncing = syncStatus === SyncStatus.IN_PROGRESS;

  const isEditable = isNew || userProfile.id === todo.creator.id;

  const setItemToEdit = useCallback(
    (todoId: string) => {
      const chosenItem = todos.find((todo) => todo.id === todoId);
      if (chosenItem) {
        setTodo(chosenItem);
      }
      return !!chosenItem;
    },
    [setTodo, todos]
  );

  useEffect(() => {
    if (isNew) {
      return;
    }

    if (match.params.id) {
      if (todosInitialized && !setItemToEdit(match.params.id)) {
        // Can not find note
        history.push("/notes");
      }
    } else {
      // redirect
      history.push("/notes");
    }
  }, [
    isNew,
    dispatch,
    match.params.id,
    syncing,
    todos,
    setItemToEdit,
    history,
    todosInitialized,
  ]);

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
      <div>
        <BackBtn />
      </div>
      {isNew && "Create new note"}
      <TodoHeader
        isNew={isNew}
        setTodo={setTodo}
        todo={todo}
        editable={isEditable}
      />
      <TodoRecords
        editable={isEditable}
        todoRecords={todo.records}
        changeTodoRecords={changeTodoRecords}
      />
      {isEditable && <SaveTodoBtn onClick={onSaveClick} />}
    </div>
  );
};

export default SingleTodo;
