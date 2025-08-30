import prisma from '../../lib/prisma.js';

export const findAllUsers = async () => prisma.user.findMany({
  select: {
    id: true,
    email: true,
    isAdmin: true,
    _count: {
      select: {tasks: true}
    }
  }
});

export const findUserById = async (id) => prisma.user.findUnique({
  where: {id},
  select: {
    id: true,
    email: true,
    isAdmin: true,
    tasks: {
      select: {
        id: true,
        title: true,
        status: true,
        totalMinutes: true
      }
    }
  }
});

export const updateUser = async (id, data) => prisma.user.update({
  where: {id},
  data
});

export const deleteUser = async (id) => prisma.user.delete({
  where: {id}
});
