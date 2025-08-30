import prisma from '../../lib/prisma.js';

export const findAllTasks = async (userId, isAdmin) => {
  const baseSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    totalMinutes: true
  };

  if (isAdmin) {
    return prisma.task.findMany({
      select: {
        ...baseSelect,
        userId: true,
        user: {
          select: {
            email: true
          }
        }
      }
    });
  }

  return prisma.task.findMany({
    where: {userId},
    select: baseSelect
  });
};

export const findTaskById = async (id) => prisma.task.findUnique({
  where: {id},
  select: {
    id: true,
    title: true,
    description: true,
    status: true,
    totalMinutes: true,
    userId: true
  }
});

export const createTask = async (data) => prisma.task.create({
  data,
  select: {
    id: true,
    title: true,
    description: true,
    status: true,
    totalMinutes: true,
    userId: true
  }
});

export const updateTask = async (id, data) => prisma.task.update({
  where: {id},
  data
});

export const deleteTask = async (id) => prisma.task.delete({
  where: {id}
});
