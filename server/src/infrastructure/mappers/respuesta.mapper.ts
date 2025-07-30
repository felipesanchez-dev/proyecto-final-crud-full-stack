import { CustomError } from "../../domain";
import { RespuestaEntity } from "../../domain/entities/respuesta.entity";

export class RespuestaMapper {
  static fromObject(object: { [key: string]: any }): RespuestaEntity {
    const {
      id,
      _id,
      encuestaId,
      usuarioId,
      fechaRespuesta,
      respuestas,
    } = object;

    if (!_id && !id) {
      throw CustomError.badRequest("Falta el ID de la respuesta");
    }
    if (!encuestaId) {
      throw CustomError.badRequest("Falta el ID de la encuesta");
    }
    if (!respuestas) {
      throw CustomError.badRequest("Faltan las respuestas");
    }

    return new RespuestaEntity(
      _id || id,
      encuestaId,
      fechaRespuesta,
      respuestas,
      usuarioId
    );
  }
}
