import { CustomError } from "../../domain";
import { EncuestaEntity, Pregunta } from "../../domain/entities/encuesta.entity";

export class EncuestaMapper {
  static fromObject(object: { [key: string]: any }): EncuestaEntity {
    const {
      id,
      _id,
      nombreEncuesta,
      descripcion,
      fechaCreacion,
      preguntas,
    } = object;

    if (!_id && !id) {
      throw CustomError.badRequest("Falta el ID de la encuesta");
    }
    if (!nombreEncuesta) {
      throw CustomError.badRequest("Falta el nombre de la encuesta");
    }
    if (!descripcion) {
      throw CustomError.badRequest("Falta la descripción de la encuesta");
    }

    const mappedPreguntas: Pregunta[] = (preguntas || []).map((p: any) => ({
        id: p._id || p.id,
        numPregunta: p.numPregunta,
        textoPregunta: p.textoPregunta,
        tipo: p.tipo,
        opciones: p.opciones
    }));

    return new EncuestaEntity(
      _id || id,
      nombreEncuesta,
      descripcion,
      fechaCreacion,
      mappedPreguntas
    );
  }
}
