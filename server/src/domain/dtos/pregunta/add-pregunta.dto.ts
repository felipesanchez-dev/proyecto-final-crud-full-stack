export class AddPreguntaDto {
  private constructor(
    public readonly numPregunta: number,
    public readonly textoPregunta: string,
    public readonly tipo: 'texto' | 'opcion' | 'boolean',
    public readonly opciones?: string[]
  ) {}

  static create(props: { [key: string]: any }): [string?, AddPreguntaDto?] {
    const { numPregunta, textoPregunta, tipo, opciones } = props;
    const tiposValidos = ['texto', 'opcion', 'boolean'];

    if (numPregunta === undefined || numPregunta === null) {
      return ["El campo 'numPregunta' es requerido", undefined];
    }
    if (typeof numPregunta !== 'number') {
      return ["El campo 'numPregunta' debe ser un número", undefined];
    }
    if (!textoPregunta) {
      return ["El campo 'textoPregunta' es requerido", undefined];
    }
    if (typeof textoPregunta !== 'string') {
      return ["El campo 'textoPregunta' debe ser un texto", undefined];
    }
    if (!tipo) {
      return ["El campo 'tipo' es requerido", undefined];
    }
    if (!tiposValidos.includes(tipo)) {
      return [`El tipo '${tipo}' no es válido. Tipos permitidos: ${tiposValidos.join(', ')}`, undefined];
    }
    if (tipo === 'opcion' && (!opciones || !Array.isArray(opciones) || opciones.length === 0)) {
      return ["El campo 'opciones' es requerido y debe ser un array no vacío para el tipo 'opcion'", undefined];
    }
    if (tipo !== 'opcion' && opciones) {
        return ["El campo 'opciones' solo es permitido para el tipo 'opcion'", undefined];
    }

    return [undefined, new AddPreguntaDto(numPregunta, textoPregunta, tipo, opciones)];
  }
}
