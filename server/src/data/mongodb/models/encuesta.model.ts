import mongoose, { Schema } from "mongoose";

const preguntaSchema = new Schema({
  numPregunta: {
    type: Number,
    required: [true, "El número de pregunta es requerido"],
  },
  textoPregunta: {
    type: String,
    required: [true, "El texto de la pregunta es requerido"],
  },
  tipo: {
    type: String,
    enum: ["texto", "opcion", "boolean"],
    required: [true, "El tipo de pregunta es requerido"],
  },
  opciones: {
    type: [String],
    // 'opciones' es requerido solo si el tipo es 'opcion'
    required: function () {
      const self = this as any;
      return self.tipo === "opcion";
    },
  },
});

const encuestaSchema = new Schema({
  nombreEncuesta: {
    type: String,
    required: [true, "El nombre de la encuesta es requerido"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es requerida"],
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  preguntas: [preguntaSchema],
});

export const EncuestaModel = mongoose.model("Encuesta", encuestaSchema);
