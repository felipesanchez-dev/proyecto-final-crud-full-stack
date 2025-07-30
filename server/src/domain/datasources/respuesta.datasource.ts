import { SubmitRespuestaDto } from "../dtos/respuesta/submit-respuesta.dto";
import { RespuestaEntity } from "../entities/respuesta.entity";

export abstract class RespuestaDatasource {
  abstract submit(
    submitRespuestaDto: SubmitRespuestaDto
  ): Promise<RespuestaEntity>;

  abstract getResultsByEncuestaId(encuestaId: string): Promise<any>;
}
