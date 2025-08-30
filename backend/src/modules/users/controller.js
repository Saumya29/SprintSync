import bcrypt from 'bcryptjs';
import {findAllUsers, findUserById, updateUser as updateUserInDb, deleteUser} from './dao.js';
import {validateEmail, validatePassword} from '../auth/utils.js';

export const getUsers = async (_, res) => {
  try {
    const users = await findAllUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({message: 'Failed to fetch users', error: error.message});
  }
};

export const getUser = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = parseInt(id, 10);

    if (userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({message: 'Access denied'});
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({message: 'Failed to fetch user', error: error.message});
  }
};

export const updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = parseInt(id, 10);
    const {email, password, isAdmin} = req.body;

    if (userId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({message: 'Access denied'});
    }

    if (isAdmin !== undefined && !req.user.isAdmin) {
      return res.status(403).json({message: 'Only admins can change admin status'});
    }

    const updateData = {};

    if (email) {
      if (!validateEmail(email)) {
        return res.status(422).json({message: 'Invalid email format'});
      }
      updateData.email = email;
    }

    if (password) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(422).json({message: 'Invalid password', errors: passwordValidation.errors});
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (isAdmin !== undefined && req.user.isAdmin) {
      updateData.isAdmin = isAdmin;
    }

    await updateUserInDb(userId, updateData);
    return res.json({message: 'User updated successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Failed to update user', error: error.message});
  }
};

export const removeUser = async (req, res) => {
  try {
    const {id} = req.params;
    const userId = parseInt(id, 10);

    if (!req.user.isAdmin) {
      return res.status(403).json({message: 'Admin access required'});
    }

    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({message: 'Cannot delete your own account'});
    }

    await deleteUser(userId);
    return res.json({message: 'User deleted successfully'});
  } catch (error) {
    return res.status(500).json({message: 'Failed to delete user', error: error.message});
  }
};
