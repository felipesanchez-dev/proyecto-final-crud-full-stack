interface RespuestaIndividualDto {
    preguntaId: string;
    valor: any;
}

export class SubmitRespuestaDto {
    private constructor(
        public readonly encuestaId: string,
        public readonly respuestas: RespuestaIndividualDto[],
        public readonly usuarioId?: string,
    ) {}

    static create(props: { [key: string]: any }): [string?, SubmitRespuestaDto?] {
        const { encuestaId, respuestas, usuarioId } = props;

        if (!encuestaId) {
            return ["El campo 'encuestaId' es requerido", undefined];
        }

        if (!respuestas || !Array.isArray(respuestas) || respuestas.length === 0) {
            return ["El campo 'respuestas' es requerido y debe ser un array con al menos una respuesta", undefined];
        }

        for (const resp of respuestas) {
            if (!resp.preguntaId) return ["Cada respuesta debe tener un 'preguntaId'", undefined];
            if (resp.valor === undefined || resp.valor === null) return ["Cada respuesta debe tener un 'valor'", undefined];
        }

        return [undefined, new SubmitRespuestaDto(encuestaId, respuestas, usuarioId)];
    }
}
