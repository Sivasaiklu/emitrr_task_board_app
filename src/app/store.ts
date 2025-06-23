import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "../features/boards/boardSlice";

// Load saved state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("boardsState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to localStorage on every change
const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("boardsState", serializedState);
  } catch (err) {
    // ignore write errors
  }
};

const store = configureStore({
  reducer: {
    boards: boardReducer,
  },
  preloadedState: {
    boards: loadState(), // 👈 pre-fill Redux state from localStorage
  },
});

store.subscribe(() => {
  saveState(store.getState().boards); // 👈 save only boards state
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
