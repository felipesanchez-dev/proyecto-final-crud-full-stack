import {
  RespuestaDatasource,
  RespuestaEntity,
  RespuestaRepository,
  SubmitRespuestaDto,
} from "../../domain";

export class RespuestaRepositoryImpl implements RespuestaRepository {
  constructor(private readonly datasource: RespuestaDatasource) {}

  submit(submitRespuestaDto: SubmitRespuestaDto): Promise<RespuestaEntity> {
    return this.datasource.submit(submitRespuestaDto);
  }

  getResultsByEncuestaId(encuestaId: string): Promise<any> {
    return this.datasource.getResultsByEncuestaId(encuestaId);
  }
}
