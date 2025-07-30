import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createSurvey,
  getSurveyById,
  updateSurvey,
  deleteQuestionFromSurvey,
} from '../services/survey.service';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const SurveyFormPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchSurvey();
    }
  }, [id, isEditing]);

  const fetchSurvey = async () => {
    try {
      const survey = await getSurveyById(id);
      setName(survey.nombreEncuesta);
      setDescription(survey.descripcion);
      setQuestions(Array.isArray(survey.preguntas) ? survey.preguntas : []);
    } catch (error) {
      console.error('Failed to fetch survey', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = {
      nombreEncuesta: name,
      descripcion: description,
    };
    try {
      if (isEditing) {
        await updateSurvey(id, surveyData);
      } else {
        await createSurvey(surveyData);
      }
      navigate('/admin');
    } catch (error) {
      console.error('Failed to save survey', error);
    }
  };

  const handleQuestionDelete = async (questionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      try {
        await deleteQuestionFromSurvey(id, questionId);
        fetchSurvey(); // Refresca la lista
      } catch (error) {
        console.error('Error eliminando la pregunta', error);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Editar Encuesta' : 'Crear Encuesta'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nombre de la encuesta"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            {isEditing ? 'Actualizar Encuesta' : 'Crear Encuesta'}
          </Button>
        </form>

        {isEditing && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Preguntas
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/admin/surveys/${id}/questions/new`)}
              sx={{ mb: 2 }}
            >
              Agregar Pregunta
            </Button>
            <Paper>
              <List>
                {Array.isArray(questions) && questions.length > 0 ? (
                  questions.map((question) => (
                    <ListItem
                      key={question.id}
                      secondaryAction={
                        <>
                          <IconButton
                            edge="end"
                            onClick={() =>
                              navigate(`/admin/surveys/${id}/questions/edit/${question.id}`)
                            }
                          >
                            <Edit />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleQuestionDelete(question.id)}>
                            <Delete />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText primary={question.textoPregunta} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No hay preguntas aún." />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SurveyFormPage;
