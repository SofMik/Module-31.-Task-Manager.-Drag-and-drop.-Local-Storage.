import { appState } from "../app";
import { User } from "../models/User";

export const authUser = function (login, password, id, isAdmin) {
  const user = new User(login, password, id, isAdmin);
  if (!user.hasAccess) return false;
  appState.currentUser = user;
  return true;
};
