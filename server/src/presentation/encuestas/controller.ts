import { Request, Response } from "express";
import {
  AddPreguntaDto,
  CreateEncuestaDto,
  CustomError,
  EncuestaEntity,
  EncuestaRepository,
  RespuestaRepository,
  SubmitRespuestaDto,
  UpdateEncuestaDto,
  UpdatePreguntaDto,
} from "../../domain";

export class EncuestaController {
  constructor(
    private readonly encuestaRepository: EncuestaRepository,
    private readonly respuestaRepository: RespuestaRepository
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  };

  // Métodos para Encuestas
  getEncuestas = (req: Request, res: Response) => {
    this.encuestaRepository
      .getAll()
      .then((encuestas: EncuestaEntity[]) => res.json(encuestas))
      .catch((error: unknown) => this.handleError(error, res));
  };

  getEncuestaById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.encuestaRepository
      .findById(id)
      .then((encuesta: EncuestaEntity | null) => {
        if (!encuesta)
          return res
            .status(404)
            .json({ error: `Encuesta con id ${id} no encontrada` });
        return res.json(encuesta);
      })
      .catch((error: unknown) => this.handleError(error, res));
  };

  createEncuesta = (req: Request, res: Response) => {
    const [error, createEncuestaDto] = CreateEncuestaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.encuestaRepository
      .create(createEncuestaDto!)
      .then((encuesta: EncuestaEntity) => res.status(201).json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  updateEncuesta = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateEncuestaDto] = UpdateEncuestaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.encuestaRepository
      .updateById(id, updateEncuestaDto!)
      .then((encuesta: EncuestaEntity) => res.json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  deleteEncuesta = (req: Request, res: Response) => {
    const { id } = req.params;
    this.encuestaRepository
      .deleteById(id)
      .then((encuesta: EncuestaEntity) => res.json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  // Métodos para Preguntas
  addPregunta = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, addPreguntaDto] = AddPreguntaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.encuestaRepository
      .addPregunta(id, addPreguntaDto!)
      .then((encuesta: EncuestaEntity) => res.json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  updatePregunta = (req: Request, res: Response) => {
    const { id, preguntaId } = req.params;
    const [error, updatePreguntaDto] = UpdatePreguntaDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.encuestaRepository
      .updatePregunta(id, preguntaId, updatePreguntaDto!)
      .then((encuesta: EncuestaEntity) => res.json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  deletePregunta = (req: Request, res: Response) => {
    const { id, preguntaId } = req.params;
    this.encuestaRepository
      .deletePregunta(id, preguntaId)
      .then((encuesta: EncuestaEntity) => res.json(encuesta))
      .catch((error: unknown) => this.handleError(error, res));
  };

  // Métodos para Respuestas
  submitRespuesta = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, submitRespuestaDto] = SubmitRespuestaDto.create({
      ...req.body,
      encuestaId: id,
    });
    if (error) return res.status(400).json({ error });

    this.respuestaRepository
      .submit(submitRespuestaDto!)
      .then((respuesta) => res.status(201).json(respuesta))
      .catch((error) => this.handleError(error, res));
  };

  getEncuestaResults = (req: Request, res: Response) => {
    const { id } = req.params;
    this.respuestaRepository
      .getResultsByEncuestaId(id)
      .then((resultados) => res.json(resultados))
      .catch((error) => this.handleError(error, res));
  };
}
