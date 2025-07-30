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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminDashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await getAllSurveys();

      if (Array.isArray(response)) {
        setSurveys(response);
      } else {
        console.warn('La respuesta de la API no es un arreglo:', response);
        setSurveys([]);
      }
    } catch (error) {
      console.error('Error al obtener encuestas:', error);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de eliminar esta encuesta?');
    if (!confirmed) return;

    try {
      await deleteSurvey(id);
      fetchSurveys(); // Refresca después de eliminar
    } catch (error) {
      console.error('Error al eliminar encuesta:', error);
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
    <Box sx={{ padding: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Encuestas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/admin/surveys/new"
        >
          Crear Encuesta
        </Button>
      </Box>

      {surveys.length === 0 ? (
        <Typography>No hay encuestas registradas.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Descripción</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.nombreEncuesta}</TableCell>
                  <TableCell>{survey.descripcion}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      to={`/admin/surveys/edit/${survey.id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(survey.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminDashboardPage;
