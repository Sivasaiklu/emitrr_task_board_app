import React from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import {
  Column as ColumnType,
  editColumn,
} from "../features/boards/boardSlice";

interface Props {
  column: ColumnType;
  onAddTask: () => void;
  onDeleteColumn: () => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<Props> = ({ column, onAddTask, onDeleteColumn }) => {
  const dispatch = useAppDispatch();
  const { id: boardId } = useParams<{ id: string }>();

  // 🛠️ Handle edit column name
  const handleEditColumn = () => {
    const newName = prompt("Enter new column name:", column.name);
    if (newName?.trim() && boardId) {
      dispatch(editColumn({ boardId, columnId: column.id, newName }));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow w-72 min-w-[18rem] flex-shrink-0">
      {/* Column Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold">{column.name}</h2>
        <div className="flex gap-1 text-xs">
          <button onClick={handleEditColumn} className="text-blue-600">
            ✏️
          </button>
          <button onClick={onDeleteColumn} className="text-red-600">
            🗑️
          </button>
        </div>
      </div>

      {/* Add Task Button */}
      <button
        onClick={onAddTask}
        className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-1 rounded mb-3"
      >
        Add Task
      </button>
    </div>
  );
};

export default Column;
