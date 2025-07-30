// src/pages/QuestionFormPage.js

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addQuestionToSurvey } from '../services/survey.service';
import './nuevo.css'; // ¡Importa el archivo CSS aquí!

const QuestionFormPage = () => {
  const { idEncuesta } = useParams();
  const navigate = useNavigate();

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
    const finalOpciones = formData.opciones.map((op) => op.trim()).filter(Boolean);

    if (formData.tipo === 'opcion' && finalOpciones.length < 2) {
      alert('Las preguntas de opción múltiple deben tener al menos 2 opciones.');
      return;
    }

    try {
      const payload = {
        numPregunta: Number(formData.numPregunta),
        textoPregunta: formData.textoPregunta.trim(),
        tipo: formData.tipo,
      };

      if (formData.tipo === 'opcion') {
        payload.opciones = finalOpciones;
      }
      
      if (!idEncuesta) {
        throw new Error("El ID de la encuesta no está definido.");
      }

      await addQuestionToSurvey(idEncuesta, payload);
      alert('Pregunta guardada correctamente');
      navigate(`/admin/surveys/edit/${idEncuesta}`); 
    } catch (error) {
      console.error('Error al guardar la pregunta:', error);
      alert(error.message || 'Ocurrió un error al guardar la pregunta');
    }
  };

  return (
    <div className="question-form-container">
      <h2>Agregar Pregunta a la Encuesta</h2>
      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label htmlFor="numPregunta">Número de Pregunta:</label>
          <input
            id="numPregunta"
            type="number"
            name="numPregunta"
            value={formData.numPregunta}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="textoPregunta">Texto de la Pregunta:</label>
          <input
            id="textoPregunta"
            type="text"
            name="textoPregunta"
            value={formData.textoPregunta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo de Pregunta:</label>
          <select
            id="tipo"
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
          <div className="form-group">
            <label>Opciones (llena al menos 2):</label>
            <div className="options-grid">
              {formData.opciones.map((opcion, index) => (
                <input
                  key={index}
                  type="text"
                  name={`opcion-${index}`}
                  value={opcion}
                  onChange={handleChange}
                  placeholder={`Opción ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="submit-button">Guardar Pregunta</button>
      </form>
    </div>
  );
};

export default QuestionFormPage;