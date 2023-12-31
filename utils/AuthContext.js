import { createContext, useState } from "react";

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
});
