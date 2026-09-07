import { configureStore } from "@reduxjs/toolkit";

import calculatorReducer from "./slices/calculatorSlice";
import chatReducer from "./slices/chatSlice";
import uiReducer from "./slices/uiSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      chat: chatReducer,
      calculator: calculatorReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
