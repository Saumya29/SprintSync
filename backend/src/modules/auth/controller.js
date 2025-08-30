import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {findUserByEmail, createUser, getUserInfo} from './dao.js';
import {checkRequiredFields, validateEmail, validatePassword} from './utils.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const {email, password} = req.body;

    const requiredFieldError = checkRequiredFields(email, password);
    if (requiredFieldError) {
      return res.status(422).json({message: requiredFieldError});
    }

    if (!validateEmail(email)) {
      return res.status(422).json({message: 'Invalid email'});
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(422).json({
        message: 'Invalid password',
        errors: passwordValidation.errors
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, hashedPassword);

    const {id, isAdmin} = user;
    const token = jwt.sign(
      {id, email, isAdmin},
      JWT_SECRET,
      {expiresIn: '24h'}
    );

    return res.status(201).json({
      message: 'User created successfully',
      token
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Registration failed', error: error.message});
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const requiredFieldError = checkRequiredFields(email, password);
    if (requiredFieldError) {
      return res.status(422).json({message: requiredFieldError});
    }

    if (!validateEmail(email)) {
      return res.status(422).json({message: 'Invalid email format'});
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const {id, isAdmin} = user;
    const token = jwt.sign(
      {id, email, isAdmin},
      JWT_SECRET,
      {expiresIn: '24h'}
    );

    const userInfo = getUserInfo(user);

    return res.json({
      user: userInfo,
      token
    });
  } catch (error) {
    return res
      .status(500)
      .json({message: 'Login failed', error: error.message});
  }
};
