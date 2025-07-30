export class CreateEncuestaDto {
  private constructor(
    public readonly nombreEncuesta: string,
    public readonly descripcion: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateEncuestaDto?] {
    const { nombreEncuesta, descripcion } = props;

    if (!nombreEncuesta) {
      return ["El campo 'nombreEncuesta' es requerido", undefined];
    }
    if (typeof nombreEncuesta !== 'string') {
      return ["El campo 'nombreEncuesta' debe ser un texto", undefined];
    }
    if (!descripcion) {
      return ["El campo 'descripcion' es requerido", undefined];
    }
    if (typeof descripcion !== 'string') {
        return ["El campo 'descripcion' debe ser un texto", undefined];
    }

    return [undefined, new CreateEncuestaDto(nombreEncuesta, descripcion)];
  }
}
