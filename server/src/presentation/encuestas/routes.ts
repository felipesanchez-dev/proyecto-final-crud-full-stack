import { Router } from "express";
import { EncuestaController } from "./controller";
import {
  EncuestaDatasourceImpl,
  EncuestaRepositoryImpl,
  RespuestaDatasourceImpl,
  RespuestaRepositoryImpl,
} from "../../infrastructure";

/**
 * @swagger
 * components:
 *   schemas:
 *     Pregunta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         numPregunta:
 *           type: number
 *         textoPregunta:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [texto, opcion, boolean]
 *         opciones:
 *           type: array
 *           items:
 *             type: string
 *     Encuesta:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombreEncuesta:
 *           type: string
 *         descripcion:
 *           type: string
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *         preguntas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Pregunta'
 *     CreateEncuestaDto:
 *       type: object
 *       required: [nombreEncuesta, descripcion]
 *       properties:
 *         nombreEncuesta:
 *           type: string
 *         descripcion:
 *           type: string
 *     AddPreguntaDto:
 *       type: object
 *       required: [numPregunta, textoPregunta, tipo]
 *       properties:
 *         numPregunta:
 *           type: number
 *         textoPregunta:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [texto, opcion, boolean]
 *         opciones:
 *           type: array
 *           items:
 *             type: string
 *     SubmitRespuestaDto:
 *       type: object
 *       required: [respuestas]
 *       properties:
 *         usuarioId:
 *           type: string
 *           description: ID del usuario que responde (opcional)
 *         respuestas:
 *           type: array
 *           items:
 *             type: object
 *             required: [preguntaId, valor]
 *             properties:
 *               preguntaId:
 *                 type: string
 *               valor:
 *                 type: "object"
 *                 description: "Puede ser string, boolean o array de strings"
 */
export class EncuestaRoutes {
  static get routes(): Router {
    const router = Router();

    // Datasources
    const encuestaDatasource = new EncuestaDatasourceImpl();
    const respuestaDatasource = new RespuestaDatasourceImpl();

    // Repositories
    const encuestaRepository = new EncuestaRepositoryImpl(encuestaDatasource);
    const respuestaRepository = new RespuestaRepositoryImpl(respuestaDatasource);

    const controller = new EncuestaController(
      encuestaRepository,
      respuestaRepository
    );

    /**
     * @swagger
     * /api/encuestas:
     *   get:
     *     tags: [Encuestas]
     *     summary: Obtener todas las encuestas
     *     responses:
     *       200:
     *         description: Lista de encuestas
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Encuesta'
     */
    router.get("/", controller.getEncuestas);

    /**
     * @swagger
     * /api/encuestas/{id}:
     *   get:
     *     tags: [Encuestas]
     *     summary: Obtener una encuesta por ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Detalles de la encuesta
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.get("/:id", controller.getEncuestaById);

    /**
     * @swagger
     * /api/encuestas:
     *   post:
     *     tags: [Encuestas]
     *     summary: Crear una nueva encuesta
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEncuestaDto'
     *     responses:
     *       201:
     *         description: Encuesta creada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.post("/", controller.createEncuesta);

    /**
     * @swagger
     * /api/encuestas/{id}:
     *   put:
     *     tags: [Encuestas]
     *     summary: Actualizar una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateEncuestaDto'
     *     responses:
     *       200:
     *         description: Encuesta actualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.put("/:id", controller.updateEncuesta);

    /**
     * @swagger
     * /api/encuestas/{id}:
     *   delete:
     *     tags: [Encuestas]
     *     summary: Eliminar una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Encuesta eliminada
     */
    router.delete("/:id", controller.deleteEncuesta);

    /**
     * @swagger
     * /api/encuestas/{id}/preguntas:
     *   post:
     *     tags: [Preguntas]
     *     summary: Añadir una pregunta a una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la encuesta
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AddPreguntaDto'
     *     responses:
     *       200:
     *         description: Encuesta con la nueva pregunta
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.post("/:id/preguntas", controller.addPregunta);

    /**
     * @swagger
     * /api/encuestas/{id}/preguntas/{preguntaId}:
     *   put:
     *     tags: [Preguntas]
     *     summary: Actualizar una pregunta en una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la encuesta
     *       - in: path
     *         name: preguntaId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la pregunta
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AddPreguntaDto'
     *     responses:
     *       200:
     *         description: Encuesta con la pregunta actualizada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.put("/:id/preguntas/:preguntaId", controller.updatePregunta);

    /**
     * @swagger
     * /api/encuestas/{id}/preguntas/{preguntaId}:
     *   delete:
     *     tags: [Preguntas]
     *     summary: Eliminar una pregunta de una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la encuesta
     *       - in: path
     *         name: preguntaId
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la pregunta
     *     responses:
     *       200:
     *         description: Encuesta con la pregunta eliminada
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Encuesta'
     */
    router.delete("/:id/preguntas/:preguntaId", controller.deletePregunta);

    // --- Rutas para Respuestas ---
    /**
     * @swagger
     * /api/encuestas/{id}/responder:
     *   post:
     *     tags: [Respuestas]
     *     summary: Enviar respuestas para una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la encuesta a la que se responde
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubmitRespuestaDto'
     *     responses:
     *       201:
     *         description: Respuestas enviadas correctamente
     */
    router.post("/:id/responder", controller.submitRespuesta);

    /**
     * @swagger
     * /api/encuestas/{id}/resultados:
     *   get:
     *     tags: [Respuestas]
     *     summary: Obtener los resultados agregados de una encuesta
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la encuesta
     *     responses:
     *       200:
     *         description: Resultados de la encuesta
     */
    router.get("/:id/resultados", controller.getEncuestaResults);

    return router;
  }
}
