import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '../components/ui/button';
import {TaskList} from '../components/task-list';
import {KanbanBoard} from '../components/kanban-board';
import {TaskForm} from '../components/task-form';
import {useSnackbar} from '../hooks/use-snackbar';
import {Snackbar} from '../components/ui/snackbar';
import {ConfirmModal} from '../components/ui/modal';
import {getTasks, createTask, updateTask, deleteTask, updateTaskStatus} from '../services/tasks';
import {logout, getCurrentUserEmail, isAdmin} from '../services/auth';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState({isOpen: false, taskId: null, taskTitle: ''});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [viewMode, setViewMode] = useState('kanban'); // 'list' or 'kanban'
  const pageSize = 10;
  const navigate = useNavigate();
  const {snackbar, showError, showSuccess, hideSnackbar} = useSnackbar();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks(currentPage, pageSize);
        setTasks(data.tasks);
        setTotalTasks(data.total);
      } catch (err) {
        showError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setCurrentPage(1);
      const data = await getTasks(1, pageSize);
      setTasks(data.tasks);
      setTotalTasks(data.total);
      setShowForm(false);
      showSuccess('Task created successfully');
    } catch (err) {
      showError('Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const updated = await updateTask(editingTask.id, taskData);
      setTasks(tasks.map(t => t.id === editingTask.id ? updated : t));
      setEditingTask(null);
      setShowForm(false);
      showSuccess('Task updated successfully');
    } catch (err) {
      showError('Failed to update task');
    }
  };

  const handleDeleteTask = (task) => {
    setDeleteConfirm({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteConfirm.taskId);
      const data = await getTasks(currentPage, pageSize);
      if (data.tasks.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setTasks(data.tasks);
        setTotalTasks(data.total);
      }
      showSuccess('Task deleted successfully');
      setDeleteConfirm({isOpen: false, taskId: null, taskTitle: ''});
    } catch (err) {
      showError('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      setTasks(tasks.map(t => t.id === id ? {...t, status} : t));
      showSuccess('Status updated successfully');
    } catch (err) {
      showError('Failed to update status');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const taskStats = {
    total: totalTasks,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length
  };

  const userEmail = getCurrentUserEmail();
  const userIsAdmin = isAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-1">
              <h1 className="text-lg sm:text-xl font-semibold">SprintSync</h1>
              <p className="text-xs sm:text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
                {userEmail} {userIsAdmin && <span className="text-xs bg-blue-100 text-blue-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full ml-1 sm:ml-2">Admin</span>}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl sm:text-3xl font-bold">{taskStats.total}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Current page</p>
              <div className="flex gap-4 mt-1">
                <span className="text-sm">
                  <span className="font-semibold text-gray-600">{taskStats.todo}</span>
                  <span className="text-xs text-gray-500 ml-1">Todo</span>
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-blue-600">{taskStats.inProgress}</span>
                  <span className="text-xs text-gray-500 ml-1">In Progress</span>
                </span>
                <span className="text-sm">
                  <span className="font-semibold text-green-600">{taskStats.done}</span>
                  <span className="text-xs text-gray-500 ml-1">Done</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                onClick={() => setViewMode('kanban')}
                size="sm"
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                List
              </Button>
            </div>
            
            {viewMode === 'list' && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'TODO' ? 'default' : 'outline'}
                  onClick={() => setFilter('TODO')}
                  size="sm"
                >
                  To Do
                </Button>
                <Button
                  variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
                  onClick={() => setFilter('IN_PROGRESS')}
                  size="sm"
                >
                  Progress
                </Button>
                <Button
                  variant={filter === 'DONE' ? 'default' : 'outline'}
                  onClick={() => setFilter('DONE')}
                  size="sm"
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          <Button onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }} className="w-full sm:w-auto">
            + New Task
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            ) : viewMode === 'kanban' ? (
              <KanbanBoard
                tasks={tasks}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ) : (
              <>
                <TaskList
                  tasks={tasks}
                  filter={filter}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
                {totalTasks > pageSize && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6 pt-6 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {currentPage}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-400">/</span>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {Math.ceil(totalTasks / pageSize)}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(Math.ceil(totalTasks / pageSize), currentPage + 1))}
                        disabled={currentPage === Math.ceil(totalTasks / pageSize)}
                      >
                        Next
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {totalTasks} total tasks
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({isOpen: false, taskId: null, taskTitle: ''})}
        onConfirm={confirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteConfirm.taskTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </div>
  );
}