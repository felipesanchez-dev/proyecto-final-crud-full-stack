// Interface para las preguntas anidadas
export interface Pregunta {
  id: string;
  numPregunta: number;
  textoPregunta: string;
  tipo: 'texto' | 'opcion' | 'boolean';
  opciones?: string[];
}

// Entidad principal de la Encuesta
export class EncuestaEntity {
  constructor(
    public id: string,
    public nombreEncuesta: string,
    public descripcion: string,
    public fechaCreacion: Date,
    public preguntas: Pregunta[]
  ) {}
}
