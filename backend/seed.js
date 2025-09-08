import bcrypt from 'bcryptjs';
import prisma from './src/lib/prisma.js';

async function seed() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);

  const [admin, john, jane] = await Promise.all([
    prisma.user.create({
      data: {email: 'admin@sprintsync.com', password, isAdmin: true}
    }),
    prisma.user.create({
      data: {email: 'john@example.com', password, isAdmin: false}
    }),
    prisma.user.create({
      data: {email: 'jane@example.com', password, isAdmin: false}
    })
  ]);

  const now = new Date();
  const tasks = [
    {
      title: 'Setup authentication',
      description: 'Implement JWT auth',
      status: 'DONE',
      totalMinutes: 120,
      userId: john.id,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Review project requirements',
      description: 'Analyze specs',
      status: 'DONE',
      totalMinutes: 90,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Team standup',
      description: 'Daily sync',
      status: 'DONE',
      totalMinutes: 30,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Create API endpoints',
      description: 'Build REST APIs',
      status: 'IN_PROGRESS',
      totalMinutes: 180,
      userId: john.id,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Design dashboard',
      description: 'Create UI mockups',
      status: 'IN_PROGRESS',
      totalMinutes: 240,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Resource allocation',
      description: 'Plan sprint resources',
      status: 'DONE',
      totalMinutes: 120,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Write tests',
      description: 'Add unit tests',
      status: 'TODO',
      totalMinutes: 240,
      userId: john.id,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Create wireframes',
      description: 'Mobile app wireframes',
      status: 'DONE',
      totalMinutes: 150,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Performance review',
      description: 'Q4 review',
      status: 'TODO',
      totalMinutes: 180,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Database optimization',
      description: 'Add indexes',
      status: 'TODO',
      totalMinutes: 90,
      userId: john.id,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Mobile responsive',
      description: 'Fix mobile layout',
      status: 'TODO',
      totalMinutes: 180,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Security audit',
      description: 'Review security policies',
      status: 'IN_PROGRESS',
      totalMinutes: 150,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Fix login bug',
      description: 'Debug auth issue',
      status: 'IN_PROGRESS',
      totalMinutes: 60,
      userId: john.id,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Component library',
      description: 'Build reusable components',
      status: 'IN_PROGRESS',
      totalMinutes: 210,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Budget planning',
      description: 'Next quarter budget',
      status: 'IN_PROGRESS',
      totalMinutes: 240,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Code review',
      description: 'Review pull requests',
      status: 'DONE',
      totalMinutes: 150,
      userId: john.id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'User research',
      description: 'Conduct interviews',
      status: 'DONE',
      totalMinutes: 300,
      userId: jane.id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Client meeting',
      description: 'Progress update',
      status: 'DONE',
      totalMinutes: 90,
      userId: admin.id,
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Documentation',
      description: 'Update API docs',
      status: 'IN_PROGRESS',
      totalMinutes: 120,
      userId: john.id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Accessibility audit',
      description: 'Check WCAG compliance',
      status: 'TODO',
      totalMinutes: 180,
      userId: jane.id,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Sprint planning',
      description: 'Next sprint planning',
      status: 'TODO',
      totalMinutes: 60,
      userId: admin.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await prisma.task.createMany({
    data: tasks
  });

  console.log('Seeded: 3 users, 21 tasks (7 days of data with each user having tasks each day)');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
