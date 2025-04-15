import React, { useState } from 'react';
import { Edit2, CheckCircle, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const taskStatuses = [
  { name: 'To Do', color: 'text-red-600', bgColor: 'bg-red-50', iconBg: 'bg-red-100' },
  { name: 'In Progress', color: 'text-blue-600', bgColor: 'bg-blue-50', iconBg: 'bg-blue-100' },
  { name: 'Done', color: 'text-green-600', bgColor: 'bg-green-50', iconBg: 'bg-green-100' }
];

const users = [
  { id: 1, name: 'Alice', avatar: 'https://i.pravatar.cc/32?img=1' },
  { id: 2, name: 'Bob', avatar: 'https://i.pravatar.cc/32?img=2' },
  { id: 3, name: 'Charlie', avatar: 'https://i.pravatar.cc/32?img=3' }
];

export default function TaskBoard() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: "Wireframe the dashboard",
      status: "To Do",
      due: "2025-04-14",
      description: "Create wireframes for all main views",
      priority: "High",
      assignedTo: 1
    },
    {
      id: '2',
      title: "Write team notes",
      status: "In Progress",
      due: "2025-04-15",
      description: "Document meeting notes and decisions",
      priority: "Medium",
      assignedTo: 2
    },
    {
      id: '3',
      title: "Deploy app",
      status: "Done",
      due: "2025-04-16",
      description: "Deploy to Vercel for testing",
      priority: "Low",
      assignedTo: 3
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState('To Do');
  const [editingTask, setEditingTask] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  const markAsDone = (taskId) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: 'Done' } : task));
  };

  const filteredTasks = tasks.filter(task => task.status === selectedStatus);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(filteredTasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    // Update tasks order in main tasks array
    const newTasks = tasks.filter(t => t.status !== selectedStatus).concat(reorderedTasks);
    setTasks(newTasks);
  };

  const getUserById = (id) => users.find(u => u.id === id);

  const openEditModal = (task) => setEditingTask(task);
  const closeEditModal = () => setEditingTask(null);

  const handleEditChange = (field, value) => {
    setEditingTask({ ...editingTask, [field]: value });
  };

  const saveTask = () => {
    setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
    closeEditModal();
  };

  const openProgressModal = () => setProgressModalOpen(true);
  const closeProgressModal = () => setProgressModalOpen(false);

  const tasksGroupedByStatus = taskStatuses.map(status => ({
    status: status.name,
    tasks: tasks.filter(task => task.status === status.name)
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Add Task"
          onClick={() => openEditModal({ id: Date.now().toString(), title: '', status: 'To Do', due: '', description: '', priority: 'Medium', assignedTo: null })}
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {taskStatuses.map(status => (
          <button
            key={status.name}
            onClick={() => setSelectedStatus(status.name)}
            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              selectedStatus === status.name
                ? `border-b-4 border-blue-600 text-blue-700 bg-blue-50 shadow`
                : `text-gray-600 hover:text-blue-600 hover:bg-blue-50`
            }`}
            aria-pressed={selectedStatus === status.name}
            title={`${status.name} tasks`}
          >
            {status.name} ({tasks.filter(task => task.status === status.name).length})
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500">No tasks in this category.</p>
              ) : (
                filteredTasks.map((task, index) => {
                  const user = getUserById(task.assignedTo);
                  return (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${taskStatuses.find(s => s.name === task.status).bgColor} p-4 rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors cursor-pointer relative group ${
                            snapshot.isDragging ? 'bg-blue-100 shadow-lg' : ''
                          }`}
                          tabIndex={0}
                          aria-label={`${task.title}, due ${task.due}, status ${task.status}`}
                          onClick={() => openEditModal(task)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span className="text-xs text-gray-800">{task.due}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{task.description}</p>

                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              task.priority === 'High' ? 'bg-red-200 text-red-800' :
                              task.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {task.priority} Priority
                            </span>
                            {user && (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                title={user.name}
                                className="w-6 h-6 rounded-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://via.placeholder.com/24?text=User';
                                }}
                              />
                            )}
                          </div>

                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                            <button
                              type="button"
                              aria-label={`Edit task ${task.title}`}
                              onClick={(e) => { e.stopPropagation(); openEditModal(task); }}
                              className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <Edit2 size={16} />
                            </button>
                            {task.status !== 'Done' && (
                              <button
                                type="button"
                                aria-label={`Mark task ${task.title} as done`}
                                onClick={(e) => { e.stopPropagation(); markAsDone(task.id); }}
                                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"       
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Edit Task Modal */}
      {editingTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-task-title"
          onClick={closeEditModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="edit-task-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              {tasks.find(t => t.id === editingTask.id) ? 'Edit Task' : 'Add Task'}
            </h3>

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Title
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => handleEditChange('title', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </label>

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Description
              <textarea
                value={editingTask.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                rows={3}
              />
            </label>

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Due Date
              <input
                type="date"
                value={editingTask.due}
                onChange={(e) => handleEditChange('due', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </label>

            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Priority
              <select
                value={editingTask.priority}
                onChange={(e) => handleEditChange('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <label className="block mb-4 font-semibold text-gray-700 dark:text-gray-300">
              Assigned To
              <select
                value={editingTask.assignedTo || ''}
                onChange={(e) => handleEditChange('assignedTo', e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </label>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"      
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTask}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal */}
      {progressModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="progress-modal-title"
          onClick={closeProgressModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="progress-modal-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Task Progress Details
            </h3>
            {tasksGroupedByStatus.map(({ status, tasks }) => (
              <div key={status} className="mb-4">
                <h4 className="text-lg font-semibold mb-2">{status} ({tasks.length})</h4>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto">
                  {tasks.map(task => (
                    <li key={task.id} className="text-gray-700 dark:text-gray-300">
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeProgressModal}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress bar click area */}
      <div
        className="mt-6 cursor-pointer"
        onClick={openProgressModal}
        aria-label="Open task progress details"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openProgressModal();
        }}
      >
        {/* This div can be styled or positioned as needed */}
      </div>
    </div>
  );
}
