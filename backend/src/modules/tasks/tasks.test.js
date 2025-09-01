import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import taskRoutes from './routes.js';
import {auth} from '../../middleware/auth.js';
import prisma from '../../lib/prisma.js';

const app = express();
app.use(express.json());
app.use(auth);
app.use('/tasks', taskRoutes);

const generateToken = (userId, isAdmin = false) => jwt.sign(
  {id: userId, email: 'test@example.com', isAdmin},
  process.env.JWT_SECRET || 'test-secret',
  {expiresIn: '1d'}
);

describe('Task Routes', () => {
  let testUser;
  let authToken;
  let testTask;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'hashedpassword',
        isAdmin: false
      }
    });
    authToken = generateToken(testUser.id);
  });

  afterAll(async () => {
    await prisma.task.deleteMany({
      where: {userId: testUser.id}
    });
    await prisma.user.delete({
      where: {id: testUser.id}
    });
    await prisma.$disconnect();
  });

  describe('GET /tasks', () => {
    beforeAll(async () => {
      await prisma.task.createMany({
        data: [
          {
            title: 'Test Task 1',
            description: 'Description 1',
            status: 'TODO',
            totalMinutes: 60,
            userId: testUser.id
          },
          {
            title: 'Test Task 2',
            description: 'Description 2',
            status: 'IN_PROGRESS',
            totalMinutes: 120,
            userId: testUser.id
          }
        ]
      });
    });

    it('should return paginated tasks', async () => {
      const response = await request(app)
        .get('/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.tasks)).toBe(true);
      expect(response.body.tasks.length).toBeGreaterThanOrEqual(2);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .get('/tasks')
        .expect(401);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'New task description',
        status: 'TODO',
        totalMinutes: 90
      };

      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.userId).toBe(testUser.id);

      testTask = response.body;
    });

    it('should fail without title', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({description: 'No title'})
        .expect(422);

      expect(response.body.message).toContain('Title is required');
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({status: 'IN_PROGRESS'})
        .expect(200);

      expect(response.body.message).toContain('updated successfully');

      const updatedTask = await prisma.task.findUnique({
        where: {id: testTask.id}
      });
      expect(updatedTask.status).toBe('IN_PROGRESS');
    });

    it('should fail to update non-existent task', async () => {
      await request(app)
        .patch('/tasks/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({status: 'DONE'})
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toContain('deleted successfully');

      const deletedTask = await prisma.task.findUnique({
        where: {id: testTask.id}
      });
      expect(deletedTask).toBeNull();
    });
  });
});
