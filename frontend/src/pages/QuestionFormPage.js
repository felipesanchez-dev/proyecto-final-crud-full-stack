import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addQuestionToSurvey,
  updateQuestionInSurvey,
  getSurveyById,
} from '../services/survey.service';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const QuestionFormPage = () => {
  const [text, setText] = useState('');
  const [type, setType] = useState('texto');
  const [options, setOptions] = useState('');
  const { surveyId, questionId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(questionId);

  useEffect(() => {
    if (isEditing) {
      const fetchQuestion = async () => {
        try {
          const surveyData = await getSurveyById(surveyId);
          const question = surveyData.encuesta.preguntas.find(q => q._id === questionId);
          if (question) {
            setText(question.textoPregunta);
            setType(question.tipo);
            setOptions(question.opciones ? question.opciones.join(',') : '');
          }
        } catch (error) {
          console.error('Failed to fetch question', error);
        }
      };
      fetchQuestion();
    }
  }, [surveyId, questionId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const questionData = {
      textoPregunta: text,
      tipo: type,
      opciones: type === 'opcion' ? options.split(',').map(opt => opt.trim()) : undefined,
    };
    try {
      if (isEditing) {
        await updateQuestionInSurvey(surveyId, questionId, questionData);
      } else {
        await addQuestionToSurvey(surveyId, questionData);
      }
      navigate(`/admin/surveys/edit/${surveyId}`);
    } catch (error) {
      console.error('Failed to save question', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          {isEditing ? 'Edit Question' : 'Add Question'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Question Text"
            fullWidth
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
              <MenuItem value="texto">Text</MenuItem>
              <MenuItem value="opcion">Option</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
            </Select>
          </FormControl>
          {type === 'opcion' && (
            <TextField
              label="Options (comma-separated)"
              fullWidth
              required
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          <Button type="submit" variant="contained">
            {isEditing ? 'Update Question' : 'Add Question'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default QuestionFormPage;
