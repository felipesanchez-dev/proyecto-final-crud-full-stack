import api from './api';

export const getAllSurveys = async () => {
  const { data } = await api.get('/encuestas');
  return data;
};

export const getSurveyById = async (id) => {
  const { data } = await api.get(`/encuestas/${id}`);
  return data;
};

export const createSurvey = async (surveyData) => {
  const { data } = await api.post('/encuestas', surveyData);
  return data;
};

export const updateSurvey = async (id, surveyData) => {
  const { data } = await api.put(`/encuestas/${id}`, surveyData);
  return data;
};

export const deleteSurvey = async (id) => {
  const { data } = await api.delete(`/encuestas/${id}`);
  return data;
};

// Question related services
export const addQuestionToSurvey = async (surveyId, questionData) => {
  const { data } = await api.post(`/encuestas/${surveyId}/preguntas`, questionData);
  return data;
};

export const updateQuestionInSurvey = async (surveyId, questionId, questionData) => {
  const { data } = await api.put(`/encuestas/${surveyId}/preguntas/${questionId}`, questionData);
  return data;
};

export const deleteQuestionFromSurvey = async (surveyId, questionId) => {
  const { data } = await api.delete(`/encuestas/${surveyId}/preguntas/${questionId}`);
  return data;
};
