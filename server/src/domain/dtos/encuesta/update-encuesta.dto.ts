export class UpdateEncuestaDto {
  private constructor(
    public readonly nombreEncuesta?: string,
    public readonly descripcion?: string
  ) {}

  static create(props: { [key: string]: any }): [string?, UpdateEncuestaDto?] {
    const { nombreEncuesta, descripcion } = props;

    if (nombreEncuesta && typeof nombreEncuesta !== 'string') {
        return ["El campo 'nombreEncuesta' debe ser un texto", undefined];
    }
    if (descripcion && typeof descripcion !== 'string') {
        return ["El campo 'descripcion' debe ser un texto", undefined];
    }

    return [undefined, new UpdateEncuestaDto(nombreEncuesta, descripcion)];
  }
}
