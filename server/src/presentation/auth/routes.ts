import { Router } from "express";
import { AuthController } from "./controller";
import { AuthDatasourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del usuario.
 *         name:
 *           type: string
 *           description: Nombre del usuario.
 *         email:
 *           type: string
 *           description: Email del usuario.
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: Roles del usuario.
 *     LoginDto:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *     RegisterDto:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 */
export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    const datasource = new AuthDatasourceImpl();
    const authRepository = new AuthRepositoryImpl(datasource);

    const controller = new AuthController(authRepository);

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     tags: [Auth]
     *     summary: Iniciar sesión de usuario
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginDto'
     *     responses:
     *       200:
     *         description: Login exitoso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     */
    router.post("/login", controller.loginUser);

    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     tags: [Auth]
     *     summary: Registrar un nuevo usuario
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RegisterDto'
     *     responses:
     *       201:
     *         description: Usuario registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     */
    router.post("/register", controller.registerUser);

    /**
     * @swagger
     * /api/auth/:
     *   get:
     *     tags: [Auth]
     *     summary: Obtener lista de usuarios (protegido)
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de usuarios
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       401:
     *         description: No autorizado
     */
    router.get("/", [AuthMiddleware.validateJWT], controller.getUsers);

    /**
     * @swagger
     * /api/auth/revalidate-token:
     *   get:
     *     tags: [Auth]
     *     summary: Revalidar token y obtener datos del usuario
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Token revalidado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     *       401:
     *         description: No autorizado (token inválido o no provisto)
     */
    router.get(
      "/revalidate-token",
      [AuthMiddleware.validateJWT],
      controller.revalidateToken
    );

    /**
     * @swagger
     * /api/auth/admin-login:
     *   post:
     *     tags: [Auth]
     *     summary: Iniciar sesión como administrador
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/LoginDto'
     *     responses:
     *       200:
     *         description: Login de administrador exitoso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     *       401:
     *         description: Credenciales inválidas
     *       403:
     *         description: El usuario no tiene rol de administrador
     */
    router.post("/admin-login", controller.loginAdmin);

    return router;
  }
}
