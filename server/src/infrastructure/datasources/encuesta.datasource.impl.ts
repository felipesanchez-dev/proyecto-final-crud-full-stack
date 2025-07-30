import { EncuestaModel } from "../../data/mongodb";
import {
  AddPreguntaDto,
  CreateEncuestaDto,
  EncuestaDatasource,
  EncuestaEntity,
  UpdateEncuestaDto,
  UpdatePreguntaDto,
  CustomError,
} from "../../domain";
import { EncuestaMapper } from "../mappers/encuesta.mapper";

export class EncuestaDatasourceImpl implements EncuestaDatasource {
  async create(
    createEncuestaDto: CreateEncuestaDto
  ): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.create(createEncuestaDto);
      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async getAll(): Promise<EncuestaEntity[]> {
    try {
      const encuestas = await EncuestaModel.find();
      return encuestas.map(EncuestaMapper.fromObject);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async findById(id: string): Promise<EncuestaEntity | null> {
    try {
      const encuesta = await EncuestaModel.findById(id);
      if (!encuesta) return null;
      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async updateById(
    id: string,
    updateEncuestaDto: UpdateEncuestaDto
  ): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.findByIdAndUpdate(
        id,
        updateEncuestaDto,
        { new: true }
      );
      if (!encuesta)
        throw CustomError.notFound(`Encuesta con id ${id} no encontrada`);
      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async deleteById(id: string): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.findByIdAndDelete(id);
      if (!encuesta)
        throw CustomError.notFound(`Encuesta con id ${id} no encontrada`);
      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async addPregunta(
    encuestaId: string,
    addPreguntaDto: AddPreguntaDto
  ): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.findById(encuestaId);
      if (!encuesta)
        throw CustomError.notFound(
          `Encuesta con id ${encuestaId} no encontrada`
        );

      encuesta.preguntas.push(addPreguntaDto as any);
      await encuesta.save();

      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async updatePregunta(
    encuestaId: string,
    preguntaId: string,
    updatePreguntaDto: UpdatePreguntaDto
  ): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.findById(encuestaId);
      if (!encuesta)
        throw CustomError.notFound(
          `Encuesta con id ${encuestaId} no encontrada`
        );

      const pregunta = encuesta.preguntas.id(preguntaId);
      if (!pregunta)
        throw CustomError.notFound(
          `Pregunta con id ${preguntaId} no encontrada`
        );

      pregunta.set(updatePreguntaDto);
      await encuesta.save();

      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }

  async deletePregunta(
    encuestaId: string,
    preguntaId: string
  ): Promise<EncuestaEntity> {
    try {
      const encuesta = await EncuestaModel.findByIdAndUpdate(
        encuestaId,
        { $pull: { preguntas: { _id: preguntaId } } },
        { new: true }
      );

      if (!encuesta)
        throw CustomError.notFound(
          `Encuesta con id ${encuestaId} no encontrada`
        );

      return EncuestaMapper.fromObject(encuesta);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
