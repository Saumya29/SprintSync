import {findAllTasks, findTaskById, createTask, updateTask, deleteTask} from './dao.js';

export const getTasks = async (req, res) => {
  try {
    const {id, isAdmin} = req.user;
    const tasks = await findAllTasks(id, isAdmin);
    return res.json(tasks);
  } catch (error) {
    return res.status(500).json({message: 'Failed to fetch tasks', error: error.message});
  }
};

export const getTask = async (req, res) => {
  try {
    const {id} = req.params;
    const taskId = parseInt(id, 10);
    const {id: userId, isAdmin} = req.user;

    const task = await findTaskById(taskId);

    if (!task || (task.userId !== userId && !isAdmin)) {
      return res.status(404).json({message: 'Task not found'});
    }

    return res.json(task);
  } catch (error) {
    return res.status(500).json({message: 'Failed to fetch task', error: error.message});
  }
};

export const addTask = async (req, res) => {
  try {
    const {title, description, status, totalMinutes, userId} = req.body;
    const {id: currentUserId, isAdmin} = req.user;

    if (!title) {
      return res.status(422).json({message: 'Title is required'});
    }

    const taskData = {
      title,
      description,
      status: status || 'TODO',
      totalMinutes: totalMinutes || 0,
      userId: userId && isAdmin ? userId : currentUserId
    };

    const task = await createTask(taskData);
    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({message: 'Failed to create task', error: error.message});
  }
};

export const modifyTask = async (req, res) => {
  try {
    const {id} = req.params;
    const taskId = parseInt(id, 10);
    const {title, description, status, totalMinutes, userId} = req.body;
    const {id: currentUserId, isAdmin} = req.user;

    const task = await findTaskById(taskId);

    if (!task || (task.userId !== currentUserId && !isAdmin)) {
      return res.status(404).json({message: 'Task not found'});
    }

    const updateData = Object.fromEntries(
      Object.entries({title, description, status, totalMinutes})
        .filter(([_, value]) => value !== undefined)
    );
    if (userId !== undefined && isAdmin) {
      updateData.userId = userId;
    }

    await updateTask(taskId, updateData);
    return res.json({message: 'Task updated successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Failed to update task', error: error.message});
  }
};

export const removeTask = async (req, res) => {
  try {
    const {id} = req.params;
    const taskId = parseInt(id, 10);
    const {id: userId, isAdmin} = req.user;

    const task = await findTaskById(taskId);

    if (!task || (task.userId !== userId && !isAdmin)) {
      return res.status(404).json({message: 'Task not found'});
    }

    await deleteTask(taskId);
    return res.json({message: 'Task deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Failed to delete task', error: error.message});
  }
};
