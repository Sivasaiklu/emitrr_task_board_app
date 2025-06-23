import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

// --- Type Definitions ---
export type Task = {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  assignedTo: string;
  priority: "low" | "medium" | "high";
  dueDate: string;
};

export type Column = {
  id: string;
  name: string;
  tasks: Task[];
};

export type Board = {
  id: string;
  title: string;
  createdAt: string;
  columns: Column[];
};

interface BoardState {
  boards: Board[];
}

// --- Initial State ---
const initialState: BoardState = {
  boards: [],
};

// --- Slice ---
const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    // Add a new board
    addBoard: (state, action: PayloadAction<{ title: string }>) => {
      const newBoard: Board = {
        id: nanoid(6), // <-- shorter ID
        title: action.payload.title,
        createdAt: new Date().toISOString(),
        columns: [],
      };
      state.boards.push(newBoard);
    },

    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(
        (board) => board.id !== action.payload
      );
    },

    // Add a new column to a board
    addColumn: (
      state,
      action: PayloadAction<{ boardId: string; columnName: string }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.columns.push({
          id: nanoid(6), // shorter column ID
          name: action.payload.columnName,
          tasks: [],
        });
      }
    },

    editColumn: (
      state,
      action: PayloadAction<{
        boardId: string;
        columnId: string;
        newName: string;
      }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      const column = board?.columns.find(
        (c) => c.id === action.payload.columnId
      );
      if (column) column.name = action.payload.newName;
    },

    // Delete a column from a board
    deleteColumn: (
      state,
      action: PayloadAction<{ boardId: string; columnId: string }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (board) {
        board.columns = board.columns.filter(
          (col) => col.id !== action.payload.columnId
        );
      }
    },

    // Add a new task to a column
    addTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        columnId: string;
        task: Omit<Task, "id">;
      }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      const column = board?.columns.find(
        (c) => c.id === action.payload.columnId
      );
      if (column) {
        column.tasks.push({
          id: nanoid(6), // short task ID
          ...action.payload.task,
        });
      }
    },

    // Update a task
    updateTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        columnId: string;
        taskId: string;
        updated: Partial<Omit<Task, "id">>;
      }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      const column = board?.columns.find(
        (c) => c.id === action.payload.columnId
      );
      const task = column?.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        Object.assign(task, action.payload.updated);
      }
    },

    // Move task between columns (drag and drop)
    moveTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        sourceColumnId: string;
        destColumnId: string;
        sourceIndex: number;
        destIndex: number;
      }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      if (!board) return;

      const sourceColumn = board.columns.find(
        (c) => c.id === action.payload.sourceColumnId
      );
      const destColumn = board.columns.find(
        (c) => c.id === action.payload.destColumnId
      );

      if (!sourceColumn || !destColumn) return;

      // Remove task from source column
      const [movedTask] = sourceColumn.tasks.splice(
        action.payload.sourceIndex,
        1
      );

      // Add task to destination column
      destColumn.tasks.splice(action.payload.destIndex, 0, movedTask);
    },

    // Delete a task from a column
    deleteTask: (
      state,
      action: PayloadAction<{
        boardId: string;
        columnId: string;
        taskId: string;
      }>
    ) => {
      const board = state.boards.find((b) => b.id === action.payload.boardId);
      const column = board?.columns.find(
        (c) => c.id === action.payload.columnId
      );
      if (column) {
        column.tasks = column.tasks.filter(
          (task) => task.id !== action.payload.taskId
        );
      }
    },
  },
});

// --- Export Actions and Reducer ---
export const {
  addBoard,
  deleteBoard,
  addColumn,
  editColumn,
  deleteColumn,
  addTask,
  updateTask,
  moveTask,
  deleteTask,
} = boardSlice.actions;

export default boardSlice.reducer;
