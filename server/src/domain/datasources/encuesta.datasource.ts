import { AddPreguntaDto, CreateEncuestaDto, UpdateEncuestaDto, UpdatePreguntaDto } from "../dtos";
import { EncuestaEntity, Pregunta } from "../entities/encuesta.entity";


export abstract class EncuestaDatasource {
    abstract create(createEncuestaDto: CreateEncuestaDto): Promise<EncuestaEntity>;
    abstract getAll(): Promise<EncuestaEntity[]>;
    abstract findById(id: string): Promise<EncuestaEntity | null>;
    abstract updateById(id: string, updateEncuestaDto: UpdateEncuestaDto): Promise<EncuestaEntity>;
    abstract deleteById(id: string): Promise<EncuestaEntity>;

    // Sub-documentos
    abstract addPregunta(encuestaId: string, addPreguntaDto: AddPreguntaDto): Promise<EncuestaEntity>;
    abstract updatePregunta(encuestaId: string, preguntaId: string, updatePreguntaDto: UpdatePreguntaDto): Promise<EncuestaEntity>;
    abstract deletePregunta(encuestaId: string, preguntaId: string): Promise<EncuestaEntity>;
}
