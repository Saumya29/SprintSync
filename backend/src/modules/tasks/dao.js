import prisma from '../../lib/prisma.js';

export const findAllTasks = async (userId, isAdmin, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const baseSelect = {
    id: true,
    title: true,
    description: true,
    status: true,
    totalMinutes: true
  };

  const where = isAdmin ? {} : {userId};
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      select: isAdmin ? {
        ...baseSelect,
        userId: true,
        user: {
          select: {
            email: true
          }
        }
      } : baseSelect,
      skip,
      take: limit,
      orderBy: {createdAt: 'desc'}
    }),
    prisma.task.count({where})
  ]);

  return {
    tasks,
    total
  };
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
