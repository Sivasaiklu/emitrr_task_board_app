import React from "react";

interface Props {
  title: string;
  createdAt: string;
  onClick: () => void;
  onDelete: () => void; // ✅ New prop for delete
}

const BoardCard: React.FC<Props> = ({
  title,
  createdAt,
  onClick,
  onDelete,
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Created on {new Date(createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onClick}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition"
        >
          View Board
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoardCard;
