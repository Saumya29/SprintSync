import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '../components/ui/button';
import {TaskList} from '../components/task-list';
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
  const navigate = useNavigate();
  const {snackbar, showError, showSuccess, hideSnackbar} = useSnackbar();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        showError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
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
      setTasks(tasks.filter(t => t.id !== deleteConfirm.taskId));
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
    total: tasks.length,
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
            <div>
              <h1 className="text-xl font-semibold">SprintSync Dashboard</h1>
              <p className="text-sm text-gray-600">
                Hello, {userEmail} {userIsAdmin && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">Admin</span>}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold">{taskStats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">To Do</p>
            <p className="text-2xl font-bold text-gray-600">{taskStats.todo}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Done</p>
            <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </Button>
            <Button
              variant={filter === 'TODO' ? 'default' : 'outline'}
              onClick={() => setFilter('TODO')}
            >
              To Do
            </Button>
            <Button
              variant={filter === 'IN_PROGRESS' ? 'default' : 'outline'}
              onClick={() => setFilter('IN_PROGRESS')}
            >
              In Progress
            </Button>
            <Button
              variant={filter === 'DONE' ? 'default' : 'outline'}
              onClick={() => setFilter('DONE')}
            >
              Done
            </Button>
          </div>

          <Button onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}>
            + New Task
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
            ) : (
              <TaskList
                tasks={tasks}
                filter={filter}
                onEdit={handleEdit}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
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