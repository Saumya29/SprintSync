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

  await prisma.task.createMany({
    data: [
      {
        title: 'Setup authentication',
        description: 'Implement JWT auth',
        status: 'DONE',
        totalMinutes: 120,
        userId: john.id
      },
      {
        title: 'Create API endpoints',
        description: 'Build REST APIs',
        status: 'IN_PROGRESS',
        totalMinutes: 180,
        userId: john.id
      },
      {
        title: 'Write tests',
        description: 'Add unit tests',
        status: 'TODO',
        totalMinutes: 240,
        userId: john.id
      },
      {
        title: 'Database optimization',
        description: 'Add indexes',
        status: 'TODO',
        totalMinutes: 90,
        userId: john.id
      },
      {
        title: 'Fix login bug',
        description: 'Debug auth issue',
        status: 'IN_PROGRESS',
        totalMinutes: 60,
        userId: john.id
      },
      {
        title: 'Design dashboard',
        description: 'Create UI mockups',
        status: 'IN_PROGRESS',
        totalMinutes: 360,
        userId: jane.id
      },
      {
        title: 'Mobile responsive',
        description: 'Fix mobile layout',
        status: 'TODO',
        totalMinutes: 180,
        userId: jane.id
      },
      {
        title: 'User research',
        description: 'Conduct interviews',
        status: 'DONE',
        totalMinutes: 300,
        userId: jane.id
      },
      {
        title: 'Performance review',
        description: 'Q4 review',
        status: 'TODO',
        totalMinutes: 180,
        userId: admin.id
      },
      {
        title: 'Budget planning',
        description: 'Next quarter budget',
        status: 'IN_PROGRESS',
        totalMinutes: 240,
        userId: admin.id
      }
    ]
  });

  console.log('Seeded: 3 users, 10 tasks');
}

seed()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
