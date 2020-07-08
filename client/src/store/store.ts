import { createStore, applyMiddleware, compose, Action } from "redux";
import { rootReducer } from "./rootReducer";
import thunk, { ThunkDispatch } from "redux-thunk";

const composeEnhancers = ((window &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose) as typeof compose;

const middlewares = [thunk];

export const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware<ThunkDispatch<ReturnType<typeof rootReducer>, any, Action>>(
      ...middlewares
    )
  )
);

export type AppState = ReturnType<typeof store.getState>;
