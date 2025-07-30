import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addQuestionToSurvey } from '../services/survey.service';

const QuestionFormPage = () => {
  const { idEncuesta } = useParams();

  const [formData, setFormData] = useState({
    numPregunta: 1,
    textoPregunta: '',
    tipo: 'opcion',
    opciones: ['', '', '', ''],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('opcion')) {
      const index = parseInt(name.split('-')[1], 10);
      const updatedOpciones = [...formData.opciones];
      updatedOpciones[index] = value;
      setFormData({ ...formData, opciones: updatedOpciones });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        numPregunta: Number(formData.numPregunta),
        textoPregunta: formData.textoPregunta.trim(),
        tipo: formData.tipo,
        opciones: formData.opciones.map((op) => op.trim()).filter(Boolean),
      };

      await addQuestionToSurvey(idEncuesta, payload);
      alert('Pregunta guardada correctamente');
    } catch (error) {
      console.error('Error al guardar la pregunta:', error);
      alert('Ocurrió un error al guardar la pregunta');
    }
  };

  return (
    <div>
      <h2>Agregar Pregunta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Número de Pregunta:</label>
          <input
            type="number"
            name="numPregunta"
            value={formData.numPregunta}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>Texto de la Pregunta:</label>
          <input
            type="text"
            name="textoPregunta"
            value={formData.textoPregunta}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Tipo de Pregunta:</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="opcion">Opción Múltiple</option>
            <option value="abierta">Abierta</option>
          </select>
        </div>

        {formData.tipo === 'opcion' && (
          <div>
            <label>Opciones:</label>
            {formData.opciones.map((opcion, index) => (
              <input
                key={index}
                type="text"
                name={`opcion-${index}`}
                value={opcion}
                onChange={handleChange}
                placeholder={`Opción ${index + 1}`}
                required
              />
            ))}
          </div>
        )}

        <button type="submit">Guardar Pregunta</button>
      </form>
    </div>
  );
};

export default QuestionFormPage;
