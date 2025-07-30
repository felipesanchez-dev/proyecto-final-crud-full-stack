export interface RespuestaIndividual {
  preguntaId: string;
  valor: string | boolean | string[];
}

export class RespuestaEntity {
  constructor(
    public id: string,
    public encuestaId: string,
    public fechaRespuesta: Date,
    public respuestas: RespuestaIndividual[],
    public usuarioId?: string
  ) {}
}
