import { DataSource } from 'typeorm';
import { Router } from 'express';
import { User } from '../../../db/postgres/models';
import { UserPgDataSourceImpl, UserRepositoryImpl, UserRedisDataSourceImpl } from '../infra';
import { UserController } from './controller';
import { Redis } from 'ioredis';
import { AuthMiddleware } from '../../shared/presentation/middlewares/auth.middleware';

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
 *          example: 1
 *        name:
 *          type: string
 *          description: The name of the user
 *          example: John Doe
 *        email:
 *          type: string
 *          description: The email of the user
 *          example: JohnDoe@mail.com
 *        sex:
 *          type: integer
 *          description: The sex of the user
 *          enum: [1, 2, 3]
 *          example: 1
 *        age:
 *          type: integer
 *          description: The age of the user
 *          example: 20
 *        birthdate:
 *          type: string
 *          format: date
 *          description: The birthdate of the user
 *          example: 2000-01-01
 */

export class UserRoutes {
	static routes(pg: DataSource, redis: Redis): Router {
		const router = Router();
		const pgUserRepository = pg.getRepository(User);
		const redisUserRepository = new UserRedisDataSourceImpl(redis);

		const dataSource = new UserPgDataSourceImpl(pgUserRepository);
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
		 *         schema:
		 *           type: integer
		 *           example: 1
		 *       - name: limit
		 *         in: query
		 *         description: The page size
		 *         schema:
		 *           type: integer
		 *           example: 10
		 *       - name: name
		 *         in: query
		 *         description: The name of the user
		 *         schema:
		 *           type: string
		 *       - name: email
		 *         in: query
		 *         description: The email of the user
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
		 * /users:
		 *   post:
		 *     summary: Create a user
		 *     tags: [Users]
		 *     requestBody:
		 *       required: true
		 *       content:
		 *        application/json:
		 *          schema:
		 *            required:
		 *              - name
		 *              - email
		 *              - password
		 *            type: object
		 *            properties:
		 *              name:
		 *                type: string
		 *                description: The name of the user
		 *                example: John Doe
		 *              email:
		 *                type: string
		 *                description: The email of the user
		 *                example: example@mail.com
		 *              password:
		 *                type: string
		 *                description: The password of the user
		 *                example: password
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
		 *             required:
		 *               - email
		 *               - password
		 *             properties:
		 *               email:
		 *                 type: string
		 *                 description: The email of the user
		 *                 example: example@mail.com
		 *               password:
		 *                 type: string
		 *                 description: The password of the user
		 *                 example: password
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

		/**
		 * @swagger
		 * /users/me:
		 *   get:
		 *     summary: Retrieve the current user
		 *     tags: [Users]
		 *     security:
		 *       - bearerAuth: []
		 *     responses:
		 *       200:
		 *         description: The current user
		 *         content:
		 *           application/json:
		 *             schema:
		 *               $ref: '#/components/schemas/User'
		 */
		router.get('/me', AuthMiddleware.authenticate, controller.me);

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
		 *           example: 1
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

		return router;
	}
}
