import {findAllTasks, findTaskById, findTaskByTitleAndUser, createTask, updateTask, deleteTask} from './dao.js';

export const getTasks = async (req, res) => {
  try {
    const {id, isAdmin} = req.user;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await findAllTasks(id, isAdmin, page, limit);
    return res.json(result);
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
    const {title, description, status, totalMinutes} = req.body;
    const {id: currentUserId} = req.user;

    if (!title) {
      return res.status(422).json({message: 'Title is required'});
    }

    const existingTask = await findTaskByTitleAndUser(title, currentUserId);
    if (existingTask) {
      return res.status(409).json({message: 'A task with this title already exists'});
    }

    const taskData = {
      title,
      description,
      status: status || 'TODO',
      totalMinutes: parseInt(totalMinutes, 10) || 0,
      userId: currentUserId
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
    const {title, description, status, totalMinutes} = req.body;
    const {id: currentUserId, isAdmin} = req.user;

    const task = await findTaskById(taskId);

    if (!task || (task.userId !== currentUserId && !isAdmin)) {
      return res.status(404).json({message: 'Task not found'});
    }

    if (title && title !== task.title) {
      const duplicateTask = await findTaskByTitleAndUser(title, task.userId);
      if (duplicateTask) {
        return res.status(409).json({message: 'A task with this title already exists'});
      }
    }

    const updateData = Object.fromEntries(
      Object.entries({
        title,
        description,
        status,
        totalMinutes: totalMinutes !== undefined ? parseInt(totalMinutes, 10) : undefined
      })
        .filter(([_, value]) => value !== undefined)
    );

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
