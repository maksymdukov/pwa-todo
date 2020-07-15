import io from "socket.io-client";
import { useCallback, useRef } from "react";
import { config } from "config/config";
import { authPersistence } from "services/auth-persistence";
import { SocketEvents } from "constants/socketio";
import { useDispatch, useSelector } from "react-redux";
import { syncTodos, updateTodosFromIDB } from "store/todos/todos.actions";
import { runOfflineActions, runOnlineActions } from "store/tech/tech.actions";
import { usersService } from "services/users.service";
import { InvalidRefreshToken } from "errors/invalid-refresh-token";
import { logout } from "store/user/actions";
import { wait } from "utils/timeout";
import { JSONparse } from "utils/json";
import { TodoHistoryChange } from "models/ITodoHistoryChange";
import { todosIDB } from "services/todos-idb.service";
import { TodoHistoryReason } from "models/TodoHistoryReason";
import { getUserState } from "store/user/selectors";
import { fetchUnreadNotifications } from "store/unread-notifications/notifications.actions";

export const useSocketIO = () => {
  const dispatch = useDispatch();
  const userState = useSelector(getUserState);
  const socketRef = useRef<SocketIOClient.Socket | undefined>();

  const updateNotifications = useCallback(
    async (todoHistory: TodoHistoryChange) => {
      if (
        todoHistory.todo.creator.id !== userState.id &&
        (todoHistory.reason === TodoHistoryReason.shared ||
          todoHistory.reason === TodoHistoryReason.unshared ||
          todoHistory.reason === TodoHistoryReason.deleted)
      ) {
        dispatch(fetchUnreadNotifications());
      }
    },
    [userState, dispatch]
  );

  const initSocket = useCallback(async () => {
    socketRef.current = io.connect(config.URL!, {
      autoConnect: true,
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${
              authPersistence.getAuthObject()!.accessToken
            }`,
          },
        },
      },
    });
    socketRef.current.on("connect", () => {
      dispatch(runOnlineActions());
    });
    socketRef.current.on("reconnect_attempt", (numb: any) => {
      console.log("reconnect_attempt event", numb);
    });
    socketRef.current.on(SocketEvents.newTodoChanges, async (msg: string) => {
      const historyChange = JSONparse<TodoHistoryChange>(msg);

      if (historyChange) {
        await todosIDB.updateTodos(
          [historyChange],
          new Date(historyChange.createdAt).getTime()
        );
        await dispatch(updateTodosFromIDB());
        await updateNotifications(historyChange);
      } else {
        dispatch(syncTodos());
      }
    });
    socketRef.current.on("connect_error", (error: any) => {
      console.log("connect_error event", error);
      dispatch(runOfflineActions());
    });
    socketRef.current.on("connect_timeout", (error: any) => {
      console.log("connect_timeout event", error);
    });
    socketRef.current.on("disconnect", (error: any) => {
      console.log("disconnect", error);
    });
    socketRef.current.on("reconnect_error", (error: any) => {
      console.log("reconnect_error event", error);
    });
    socketRef.current.on("error", (error: any) => {
      console.log("error event", error);
      if (
        error.type === "UnauthorizedError" ||
        error.code === "invalid_token"
      ) {
        console.log("User token has expired");
        (async () => {
          try {
            socketRef.current?.close();
            await wait(1);
            await usersService.refreshToken();
            await wait(1);
            await initSocket();
          } catch (error) {
            if (error instanceof InvalidRefreshToken) {
              dispatch(logout());
            }
          }
        })();
      }
    });
    return socketRef.current;
  }, [dispatch, socketRef, updateNotifications]);
  return { initSocket, socketRef: socketRef };
};
