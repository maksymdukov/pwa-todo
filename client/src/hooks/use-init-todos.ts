import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { setTodoItems } from "store/todos/todos.actions";
import { todosIDB } from "services/todos-idb.service";

export const useInitTodos = () => {
  const dispatch = useDispatch();
  const initializeTodos = useCallback(async () => {
    // Get todos from db
    const dbTodos = await todosIDB.getAllTodos();
    dispatch(setTodoItems({ items: dbTodos }));
  }, [dispatch]);
  return { initializeTodos };
};
