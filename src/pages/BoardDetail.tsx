import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addColumn,
  addTask,
  deleteColumn,
  deleteTask,
  updateTask,
} from "../features/boards/boardSlice";
import { useState } from "react";

function BoardDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [newColName, setNewColName] = useState("");
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<{
    columnId: string;
    taskId: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    createdBy: "",
    assignedTo: "",
    priority: "medium",
    dueDate: "",
  });

  const board = useAppSelector((state) =>
    state.boards.boards.find((b) => b.id === id)
  );
  if (!board)
    return <div className="text-center p-8 text-red-600">Board not found</div>;

  const handleAddColumn = () => {
    if (newColName.trim()) {
      dispatch(addColumn({ boardId: id!, columnName: newColName }));
      setNewColName("");
    }
  };

  const handleEditTask = (columnId: string, taskId: string) => {
    const column = board.columns.find((c) => c.id === columnId);
    const task = column?.tasks.find((t) => t.id === taskId);
    if (!task) return;

    setEditingTask({ columnId, taskId });
    setFormData({ ...task });
    setShowEditTaskForm(true);
  };

  const handleEditFormSubmit = () => {
    if (!editingTask) return;
    dispatch(
      updateTask({
        boardId: id!,
        columnId: editingTask.columnId,
        taskId: editingTask.taskId,
        updated: {
          ...formData,
          priority: formData.priority as "low" | "medium" | "high",
        },
      })
    );
    setShowEditTaskForm(false);
    setEditingTask(null);
  };

  const openTaskForm = (columnId: string) => {
    setActiveColumnId(columnId);
    setShowTaskForm(true);
    setFormData({
      title: "",
      description: "",
      createdBy: "",
      assignedTo: "",
      priority: "medium",
      dueDate: "",
    });
  };

  const handleFormSubmit = () => {
    if (!activeColumnId) return;
    dispatch(
      addTask({
        boardId: id!,
        columnId: activeColumnId,
        task: {
          ...formData,
          priority: formData.priority as "low" | "medium" | "high",
        },
      })
    );
    setShowTaskForm(false);
    setActiveColumnId(null);
  };

  return (
    <div className="p-6">
      <h1 style={{color:"#E7F6F2"}} className="text-3xl font-bold mb-6">
        {" "}
        Board - {board.title}
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          style={{ backgroundColor: "#F5E8C7", color: "black" }}
          type="text"
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
          placeholder="Enter column name"
          className="p-3 border font-normal rounded-xl w-5/6 focus:outline-none focus:ring-1 focus:ring-red text-black placeholder-black"
        />

        <button
          onClick={handleAddColumn}
          className=" bg-slate-50  hover:bg-zinc-100 text-black font-bold text-md px-5 py-2 rounded-xl"
        >
          Add Column
        </button>
      </div>
      {board.columns.length === 0 ? (
        <p className="text-center p-5 text-white italic">
          No columns yet. Add one to get started!
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {board.columns.map((col) => (
            <div
              key={col.id}
              className="bg-slate-600 border border-green-600 rounded-xl shadow-sm p-5 flex flex-col gap-4"
            >
              {/* Column Title */}
              <div className="flex justify-between items-center">
                <h2 className="text-white text-2xl font-semibold cursor-pointer hover:text-gray-300">
                  Column - {col.name}
                </h2>
              </div>

              {/* Add Task Button */}
              <button
                onClick={() => openTaskForm(col.id)}
                className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition"
              >
                Add Task
              </button>

              {/* Task List */}
              {(col.tasks?.length ?? 0) === 0 ? (
                <p className="text-sm text-gray-300 italic text-center py-4">
                  No tasks yet
                </p>
              ) : (
                col.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-100 border border-gray-300 rounded-md p-4 flex flex-col justify-between"
                  >
                    <h3 className="font-bold text-gray-800 mb-2 text-sm">
                      Task - {task.title}
                    </h3>

                    <div className="text-xs text-gray-700 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold">Description:</span>
                        <span className="text-right font-semibold">
                          {task.description}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Created by:</span>
                        <span className="text-right font-semibold">
                          {task.createdBy}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Assigned to:</span>
                        <span className="text-right font-semibold">
                          {task.assignedTo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Priority:</span>
                        <span
                          className={`font-semibold capitalize ${
                            task.priority === "high"
                              ? "text-red-600"
                              : task.priority === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold">Due Date:</span>
                        <span className="text-right font-semibold">
                          {task.dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-4 pt-2  border-t border-gray-200">
                      <button
                        onClick={() => handleEditTask(col.id, task.id)}
                        className="text-sm bg-green-700 p-1 w-32 text-white border border-green-600 rounded hover:bg-green-800 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          dispatch(
                            deleteTask({
                              boardId: id!,
                              columnId: col.id,
                              taskId: task.id,
                            })
                          )
                        }
                        className="text-sm bg-red-700 p- w-32 text-white border border-red-600 rounded hover:bg-red-800 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}

              {/* Delete Column Button at Bottom */}
              <button
                onClick={() =>
                  dispatch(deleteColumn({ boardId: id!, columnId: col.id }))
                }
                className="bg-black hover:bg-gray-900 text-slate-100 px-4 py-2 rounded-md  mt-auto"
              >
                Delete Column
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50  rounded-lg shadow-lg"
        >
          <div className="bg-white p-6 rounded-lg  max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black required"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Created By"
                value={formData.createdBy}
                onChange={(e) =>
                  setFormData({ ...formData, createdBy: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowTaskForm(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 font-semibold  rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFormSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-black font-semibold rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Form Modal */}
      {showEditTaskForm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Created By"
                value={formData.createdBy}
                onChange={(e) =>
                  setFormData({ ...formData, createdBy: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowEditTaskForm(false);
                  setEditingTask(null);
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 font-semibold  rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFormSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-black font-semibold rounded"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => navigate("/")}
        className="mb-4 mt-5 bg-slate-50  hover:bg-zinc-100 text-black font-bold text-md  px-4 py-2 rounded"
      >
        &larr; Back to Dashboard
      </button>
    </div>
  );
}

export default BoardDetail;
