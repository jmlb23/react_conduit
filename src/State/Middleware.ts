import { Dispatch, Middleware, MiddlewareAPI } from "redux";
import { AppActions } from "./ActionCreators";
import { AppState } from "./Reducers";

export const persisStateMiddleware: Middleware = (api: MiddlewareAPI<Dispatch<any>, AppState>) => (next: Dispatch<AppActions>) => (action: AppActions) => {
  const a = next(action);
  const state = api.getState();
  if (state.token !== null)
    localStorage.setItem("token", state.token)
  console.log("------ store state ------ ", state.token)
  return a;
};
