import {
  AddPreguntaDto,
  CreateEncuestaDto,
  EncuestaDatasource,
  EncuestaEntity,
  EncuestaRepository,
  UpdateEncuestaDto,
  UpdatePreguntaDto,
} from "../../domain";

export class EncuestaRepositoryImpl implements EncuestaRepository {
  constructor(private readonly datasource: EncuestaDatasource) {}

  create(createEncuestaDto: CreateEncuestaDto): Promise<EncuestaEntity> {
    return this.datasource.create(createEncuestaDto);
  }

  getAll(): Promise<EncuestaEntity[]> {
    return this.datasource.getAll();
  }

  findById(id: string): Promise<EncuestaEntity | null> {
    return this.datasource.findById(id);
  }

  updateById(
    id: string,
    updateEncuestaDto: UpdateEncuestaDto
  ): Promise<EncuestaEntity> {
    return this.datasource.updateById(id, updateEncuestaDto);
  }

  deleteById(id: string): Promise<EncuestaEntity> {
    return this.datasource.deleteById(id);
  }

  addPregunta(
    encuestaId: string,
    addPreguntaDto: AddPreguntaDto
  ): Promise<EncuestaEntity> {
    return this.datasource.addPregunta(encuestaId, addPreguntaDto);
  }

  updatePregunta(
    encuestaId: string,
    preguntaId: string,
    updatePreguntaDto: UpdatePreguntaDto
  ): Promise<EncuestaEntity> {
    return this.datasource.updatePregunta(
      encuestaId,
      preguntaId,
      updatePreguntaDto
    );
  }

  deletePregunta(
    encuestaId: string,
    preguntaId: string
  ): Promise<EncuestaEntity> {
    return this.datasource.deletePregunta(encuestaId, preguntaId);
  }
}
