import {
  CustomError,
  RespuestaDatasource,
  RespuestaEntity,
  SubmitRespuestaDto,
} from "../../domain";
import { EncuestaModel, RespuestaModel } from "../../data/mongodb";
import { RespuestaMapper } from "../mappers/respuesta.mapper";
import mongoose from "mongoose";

export class RespuestaDatasourceImpl implements RespuestaDatasource {
  async submit(
    submitRespuestaDto: SubmitRespuestaDto
  ): Promise<RespuestaEntity> {
    const { encuestaId, respuestas } = submitRespuestaDto;

    // 1. Verificar que la encuesta existe
    const encuesta = await EncuestaModel.findById(encuestaId);
    if (!encuesta)
      throw CustomError.notFound(`Encuesta con id ${encuestaId} no encontrada`);

    // 2. Opcional: Verificar que las preguntas existen dentro de la encuesta
    const preguntasDeLaEncuesta = encuesta.preguntas.map((p: any) =>
      p._id!.toString()
    );
    for (const resp of respuestas) {
      if (!preguntasDeLaEncuesta.includes(resp.preguntaId)) {
        throw CustomError.badRequest(
          `La pregunta con id ${resp.preguntaId} no pertenece a esta encuesta.`
        );
      }
    }

    try {
      const respuesta = new RespuestaModel(submitRespuestaDto);
      await respuesta.save();
      return RespuestaMapper.fromObject(respuesta);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer();
    }
  }

  async getResultsByEncuestaId(encuestaId: string): Promise<any> {
    // 1. Verificar que la encuesta existe
    if (!mongoose.isValidObjectId(encuestaId)) {
      throw CustomError.badRequest("ID de encuesta no válido");
    }
    const encuesta = await EncuestaModel.findById(encuestaId);
    if (!encuesta)
      throw CustomError.notFound(`Encuesta con id ${encuestaId} no encontrada`);

    try {
      const resultados = await RespuestaModel.aggregate([
        // Filtrar respuestas para la encuesta específica
        { $match: { encuestaId: new mongoose.Types.ObjectId(encuestaId) } },
        // Desenrollar el array de respuestas para procesar cada una individualmente
        { $unwind: "$respuestas" },
        // Agrupar por pregunta y por valor de la respuesta, y contar
        {
          $group: {
            _id: {
              preguntaId: "$respuestas.preguntaId",
              valor: "$respuestas.valor",
            },
            count: { $sum: 1 },
          },
        },
        // Agrupar de nuevo por pregunta para anidar los resultados
        {
          $group: {
            _id: "$_id.preguntaId",
            resultados: {
              $push: {
                valor: "$_id.valor",
                conteo: "$count",
              },
            },
          },
        },
        // Opcional: buscar la info de la pregunta para dar más contexto
        {
          $project: {
            _id: 0,
            preguntaId: "$_id",
            resultados: "$resultados",
          },
        },
      ]);

      // Mapear los resultados con la información de las preguntas de la encuesta original
      const resultadosMapeados = resultados.map((res: any) => {
        const preguntaInfo = encuesta.preguntas.find(
          (p: any) => p._id!.toString() === res.preguntaId.toString()
        );
        return {
          ...res,
          textoPregunta: preguntaInfo?.textoPregunta,
          tipo: preguntaInfo?.tipo,
        };
      });

      return {
        encuesta: {
          id: encuesta.id,
          nombreEncuesta: encuesta.nombreEncuesta,
          descripcion: encuesta.descripcion,
        },
        resumen: resultadosMapeados,
      };
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer();
    }
  }
}
