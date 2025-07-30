import React, { useState, useEffect } from 'react';
import { getAllSurveys, deleteSurvey } from '../services/survey.service';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const AdminDashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const surveysData = await getAllSurveys();
      setSurveys(surveysData.encuestas);
    } catch (error) {
      console.error('Failed to fetch surveys', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteSurvey(id);
        fetchSurveys(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete survey', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Manage Surveys</Typography>
        <Button variant="contained" component={Link} to="/admin/surveys/new">
          Create Survey
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {surveys.map((survey) => (
              <TableRow key={survey.id}>
                <TableCell>{survey.nombreEncuesta}</TableCell>
                <TableCell>{survey.descripcion}</TableCell>
                <TableCell align="right">
                  <IconButton component={Link} to={`/admin/surveys/edit/${survey.id}`}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(survey.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboardPage;
