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
      const surveyData = await getSurveyById(id);
      setName(surveyData.encuesta.nombreEncuesta);
      setDescription(surveyData.encuesta.descripcion);
      setQuestions(surveyData.encuesta.preguntas);
    } catch (error) {
      console.error('Failed to fetch survey', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surveyData = { nombreEncuesta: name, descripcion: description };
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
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestionFromSurvey(id, questionId);
        fetchSurvey(); // Refresh survey data
      } catch (error) {
        console.error('Failed to delete question', error);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Survey' : 'Create Survey'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Survey Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained">
            {isEditing ? 'Update Survey' : 'Create Survey'}
          </Button>
        </form>

        {isEditing && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Questions
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(`/admin/surveys/${id}/questions/new`)}
              sx={{ mb: 2 }}
            >
              Add Question
            </Button>
            <Paper>
              <List>
                {questions.map((question) => (
                  <ListItem
                    key={question._id}
                    secondaryAction={
                      <>
                        <IconButton
                          edge="end"
                          onClick={() => navigate(`/admin/surveys/${id}/questions/edit/${question._id}`)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleQuestionDelete(question._id)}>
                          <Delete />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText primary={question.textoPregunta} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SurveyFormPage;
