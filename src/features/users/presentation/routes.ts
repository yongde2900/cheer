import { DataSource } from 'typeorm';
import { Router } from 'express';
import { User } from '../../../db/postgres/models';
import { PqUserDataSourceImpl, UserRepositoryImpl, RedisUserDataSourceImpl } from '../infra';
import { UserController } from './controller';
import { Redis } from 'ioredis';

/*
 * @swagger
 * tags:
 *  name: Users
 *  description: User management
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - id
 *        - name
 *        - email
 *      properties:
 *        id:
 *          type: integer
 *          description: The auto-generated id of the user
 *        name:
 *          type: string
 *          description: The name of the user
 *        email:
 *          type: string
 *          description: The email of the user
 *        sex:
 *          type: integer
 *          description: The sex of the user
 *        age:
 *          type: integer
 *          description: The age of the user
 *        birthdate:
 *          type: string
 *          format: date
 *          description: The birthdate of the user
 */

export class UserRoutes {
	static routes(pq: DataSource, redis: Redis): Router {
		const router = Router();
		const pqUserRepository = pq.getRepository(User);
		const redisUserRepository = new RedisUserDataSourceImpl(redis);

		const dataSource = new PqUserDataSourceImpl(pqUserRepository);
		const repository = new UserRepositoryImpl(dataSource, redisUserRepository);
		const controller = new UserController(repository);

		/**
		 * @swagger
		 * /users:
		 *   get:
		 *     summary: Retrieve a list of users
		 *     tags: [Users]
		 *     parameters:
		 *       - name: page
		 *         in: query
		 *         description: The page number
		 *         required: false
		 *         schema:
		 *           type: integer
		 *       - name: limit
		 *         in: query
		 *         description: The page size
		 *         required: false
		 *         schema:
		 *           type: integer
		 *       - name: name
		 *         in: query
		 *         description: The name of the user
		 *         required: false
		 *         schema:
		 *           type: string
		 *       - name: email
		 *         in: query
		 *         description: The email of the user
		 *         required: false
		 *         schema:
		 *           type: string
		 *     responses:
		 *       200:
		 *         description: A list of users
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               properties:
		 *                 data:
		 *                   type: array
		 *                   items:
		 *                     $ref: '#/components/schemas/User'
		 *                 total:
		 *                   type: integer
		 *                   description: The total number of users
		 *                   example: 1
		 */
		router.get('/', controller.getAll);
		/**
		 * @swagger
		 * /users/{id}:
		 *   get:
		 *     summary: Retrieve a user by id
		 *     tags: [Users]
		 *     parameters:
		 *       - name: id
		 *         in: path
		 *         description: The id of the user
		 *         required: true
		 *         schema:
		 *           type: integer
		 *     responses:
		 *       200:
		 *         description: A list of users
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: object
		 *               $ref: '#/components/schemas/User'
		 */
		router.get('/:id', controller.get);
		/**
		 * @swagger
		 * /users:
		 *   post:
		 *     summary: Create a user
		 *     tags: [Users]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *        application/json:
		 *          schema:
		 *            type: object
		 *            properties:
		 *              name:
		 *                type: string
		 *                required: true
		 *                description: The name of the user
		 *              email:
		 *                type: string
		 *                required: true
		 *                description: The email of the user
		 *              sex:
		 *                type: integer
		 *                description: The sex of the user
		 *                enum: [1, 2, 3]
		 *              age:
		 *                type: integer
		 *                description: The age of the user
		 *                minimum: 0
		 *              birthdate:
		 *                type: string
		 *                format: date
		 *                description: The birthdate of the user
		 *     responses:
		 *       200:
		 *         description: The user was successfully created
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/User'
		 */
		router.post('/', controller.create);
		/**
		 * @swagger
		 * /users/{id}:
		 *   put:
		 *     summary: Update a user by id
		 *     tags: [Users]
		 *     parameters:
		 *       - name: id
		 *         in: path
		 *         description: The id of the user
		 *         required: true
		 *         schema:
		 *           type: integer
		 *     requestBody:
		 *       required: true
		 *       content:
		 *        application/json:
		 *          schema:
		 *            type: object
		 *            properties:
		 *              name:
		 *                type: string
		 *                description: The name of the user
		 *              email:
		 *                type: string
		 *                description: The email of the user
		 *              sex:
		 *                type: integer
		 *                description: The sex of the user
		 *                enum: [1, 2, 3]
		 *              age:
		 *                type: integer
		 *                description: The age of the user
		 *                minimum: 0
		 *              birthdate:
		 *                type: string
		 *                format: date
		 *                description: The birthdate of the user
		 *     responses:
		 *       200:
		 *         description: The user was successfully updated
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/User'
		 */
		router.put('/:id', controller.edit);

		/**
		 * @swagger
		 * /users/login:
		 *   post:
		 *     summary: Login a user
		 *     tags: [Users]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *         application/json:
		 *           schema:
		 *             type: object
		 *             properties:
		 *               email:
		 *                 type: string
		 *                 required: true
		 *                 description: The email of the user
		 *               password:
		 *                 type: string
		 *                 required: true
		 *                 description: The password of the user
		 *     responses:
		 *       200:
		 *         description: The user was successfully deleted
		 *         content:
		 *           application/json:
		 *             schema:
		 *               type: string
		 *               description: The JWT token
		 *               example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImlhdCI6MTYxNzIwNjIwMCwiZXhwIjoxNjE3MjA2MjAwfQ.1'
		 */
		router.post('/login', controller.login);

		return router;
	}
}
