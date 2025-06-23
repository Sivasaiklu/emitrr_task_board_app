import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addBoard, deleteBoard } from "../features/boards/boardSlice";

function BoardList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const boards = useAppSelector((state) => state.boards.boards);

  const [showModal, setShowModal] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const handleAddBoard = () => {
    if (boardTitle.trim()) {
      dispatch(addBoard({ title: boardTitle }));
      setBoardTitle("");
      setShowModal(false);
    }
  };

  const handleDeleteBoard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      dispatch(deleteBoard(id));
    }
  };

  return (
    <div className="p-6">
      <h1 style={{ color: "#E7F6F2" }} className="text-3xl font-bold mb-6">
        📋 Welcome to Task Board Application
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-zinc-200 hover:bg-zinc-100 text-black font-bold px-5 py-2 rounded-md border-2 border-black"
      >
        Create New Board
      </button>

      {/* Table View of Boards */}
      {boards.length === 0 ? (
        <p className="text-white">
          No boards found. Create one to get started!
        </p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto shadow border-2 border-black">
            <thead
              style={{ backgroundColor: "#F5E8C7" }}
              className="bg-gray-200"
            >
              <tr>
                <th className="border-2 border-black px-4 py-2 text-left">
                  Title
                </th>
                <th className="border-2 border-black px-4 py-2 text-left">
                  Created At
                </th>
                <th className="border-2 border-black px-4 py-2 text-left">
                  Columns
                </th>
                <th className="border-2 border-black px-4 py-2 text-left">
                  Tasks
                </th>
                <th className="border-2 border-black px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              style={{ backgroundColor: "#E2DFD0" }}
              className="bg-gray-50"
            >
              {boards.map((board) => {
                const columns = board.columns ?? [];
                const totalTasks = columns.reduce((acc, col) => {
                  const tasks = col.tasks ?? [];
                  return acc + tasks.length;
                }, 0);

                return (
                  <tr key={board.id}>
                    <td
                      className="border-2 border-black px-4 py-2 text-blue-800 hover:underline cursor-pointer font-bold"
                      onClick={() => navigate(`/boards/${board.id}`)}
                    >
                      {board.title}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {new Date(board.createdAt).toLocaleString()}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {columns.length}
                    </td>
                    <td className="border-2 border-black px-4 py-2">
                      {totalTasks}
                    </td>
                    <td className="border-2 border-black px-4 py-2 space-x-2">
                      <button
                        onClick={() => navigate(`/boards/${board.id}`)}
                        className="text-md bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board.id)}
                        className="text-md bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Adding New Board */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Create New Board</h2>
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              placeholder="Enter board title"
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 font-semibold  rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBoard}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-black font-semibold rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardList;
