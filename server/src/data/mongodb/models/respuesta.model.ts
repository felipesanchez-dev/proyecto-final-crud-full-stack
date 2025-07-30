import mongoose, { Schema } from "mongoose";

const respuestaIndividualSchema = new Schema({
  preguntaId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Pregunta' // Aunque es un subdocumento, la referencia puede ser útil
  },
  valor: {
    type: Schema.Types.Mixed, // Permite string, boolean, o array de strings
    required: true,
  },
});

const respuestaSchema = new Schema({
  encuestaId: {
    type: Schema.Types.ObjectId,
    ref: 'Encuesta',
    required: [true, 'El ID de la encuesta es requerido'],
  },
  usuarioId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    // Opcional, ya que las rutas no estarán protegidas
  },
  fechaRespuesta: {
    type: Date,
    default: Date.now,
  },
  respuestas: [respuestaIndividualSchema],
});

export const RespuestaModel = mongoose.model("Respuesta", respuestaSchema);
