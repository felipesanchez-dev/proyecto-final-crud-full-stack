import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@mui/material';
import { getSurveyById, sendSurveyResponse } from '../services/survey.service';

const SurveyDetailPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await getSurveyById(id);
        setSurvey(data);
      } catch (error) {
        console.error('Error al obtener la encuesta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleChange = (preguntaId, valor) => {
    setRespuestas((prev) => ({
      ...prev,
      [preguntaId]: valor,
    }));
  };

  const handleSubmit = async () => {
    const usuarioId = '688a667604ed530fa83ef431';

    try {
      await sendSurveyResponse(id, usuarioId, respuestas);
      alert('¡Respuestas enviadas con éxito!');
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      alert('Error al enviar las respuestas. Intenta de nuevo.');
    }
  };

  if (loading) return <Typography>Cargando encuesta...</Typography>;
  if (!survey) return <Typography>Encuesta no encontrada</Typography>;

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        {survey.nombreEncuesta}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {survey.descripcion}
      </Typography>

      {survey.preguntas.map((pregunta) => (
        <Card key={pregunta.id} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">{pregunta.texto}</Typography>
            <RadioGroup
              value={respuestas[pregunta.id] || ''}
              onChange={(e) => handleChange(pregunta.id, e.target.value)}
            >
              {pregunta.opciones.map((opcion, index) => (
                <FormControlLabel
                  key={index}
                  value={opcion}
                  control={<Radio />}
                  label={opcion}
                />
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={Object.keys(respuestas).length !== survey.preguntas.length}
      >
        Enviar Respuestas
      </Button>
    </div>
  );
};

export default SurveyDetailPage;
