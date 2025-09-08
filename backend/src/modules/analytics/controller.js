import prisma from '../../lib/prisma.js';

export const getTimeLoggedPerDay = async (_, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {totalMinutes: {gt: 0}},
      include: {user: {select: {email: true}}}
    });

    const dateUserMap = tasks.reduce((acc, task) => {
      const date = task.updatedAt.toLocaleDateString();
      const userName = task.user.email.split('@')[0];

      if (!acc[date]) acc[date] = {};
      acc[date][userName] = (acc[date][userName] || 0) + task.totalMinutes;

      return acc;
    }, {});

    // transform to chart format
    const data = Object.entries(dateUserMap)
      .map(([date, users]) => ({
        date,
        ...Object.fromEntries(
          Object.entries(users).map(([user, minutes]) => [user, +(minutes / 60).toFixed(1)])
        )
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({data});
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({message: 'Failed to fetch analytics data'});
  }
};
