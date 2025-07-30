import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSurveyById } from '../services/survey.service';
import { Typography, Box, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const SurveyDetailPage = () => {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const surveyData = await getSurveyById(id);
        setSurvey(surveyData.encuesta);
      } catch (error) {
        console.error('Failed to fetch survey details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!survey) {
    return <Typography>Survey not found.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {survey.nombreEncuesta}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {survey.descripcion}
      </Typography>
      <Paper>
        <List>
          {survey.preguntas.map((pregunta) => (
            <ListItem key={pregunta._id}>
              <ListItemText
                primary={pregunta.textoPregunta}
                secondary={`Type: ${pregunta.tipo}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default SurveyDetailPage;
