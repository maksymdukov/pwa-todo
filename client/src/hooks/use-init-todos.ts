import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { setTodoItems } from "store/todos/todos.actions";
import { todosIDB } from "services/todos-idb.service";
import { getConnetionStatus } from "store/tech/tech.selectors";
import { ConnectionStatus } from "store/tech/tech.reducer";
import { fetchUnreadNotifications } from "store/unread-notifications/notifications.actions";

export const useInitTodos = () => {
  const dispatch = useDispatch();
  const connectionStatus = useSelector(getConnetionStatus);
  const initializeTodos = useCallback(async () => {
    // Get todos from db
    const dbTodos = await todosIDB.getAllTodos();
    dispatch(setTodoItems({ items: dbTodos }));
    if (connectionStatus === ConnectionStatus.online) {
      dispatch(fetchUnreadNotifications());
    }
  }, [dispatch]);
  return { initializeTodos };
};
