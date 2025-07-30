export class UpdatePreguntaDto {
    private constructor(
      public readonly numPregunta?: number,
      public readonly textoPregunta?: string,
      public readonly tipo?: 'texto' | 'opcion' | 'boolean',
      public readonly opciones?: string[]
    ) {}

    static create(props: { [key: string]: any }): [string?, UpdatePreguntaDto?] {
      const { numPregunta, textoPregunta, tipo, opciones } = props;
      const tiposValidos = ['texto', 'opcion', 'boolean'];

      if (numPregunta && typeof numPregunta !== 'number') {
        return ["El campo 'numPregunta' debe ser un número", undefined];
      }
      if (textoPregunta && typeof textoPregunta !== 'string') {
        return ["El campo 'textoPregunta' debe ser un texto", undefined];
      }
      if (tipo && !tiposValidos.includes(tipo)) {
        return [`El tipo '${tipo}' no es válido. Tipos permitidos: ${tiposValidos.join(', ')}`, undefined];
      }
      if (tipo === 'opcion' && (!opciones || !Array.isArray(opciones) || opciones.length === 0)) {
        return ["El campo 'opciones' es requerido para el tipo 'opcion'", undefined];
      }
      if (tipo && tipo !== 'opcion' && opciones) {
        return ["El campo 'opciones' solo es permitido para el tipo 'opcion'", undefined];
      }

      return [undefined, new UpdatePreguntaDto(numPregunta, textoPregunta, tipo, opciones)];
    }
  }
