import prisma from '../../lib/prisma.js';

export const findUserByEmail = async (email) => prisma.user.findUnique({
  where: {email}
});

export const createUser = async (email, hashedPassword) => prisma.user.create({
  data: {
    email,
    password: hashedPassword
  }
});

export const getUserInfo = (user) => {
  const {id, email, isAdmin} = user;
  return {
    id,
    email,
    isAdmin
  };
};
