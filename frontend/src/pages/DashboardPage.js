import React, { useState, useEffect } from "react";
import { getAllSurveys } from "../services/survey.service";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";

const DashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const surveysData = await getAllSurveys();
        // surveysData ya ES un array, no un objeto con "encuestas"
        setSurveys(Array.isArray(surveysData) ? surveysData : []);
      } catch (error) {
        console.error("Failed to fetch surveys", error);
        setSurveys([]); // fallback si ocurre error
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Encuestas Disponibles
      </Typography>

      {surveys.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No hay encuestas disponibles por el momento.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {surveys.map((survey) => (
            <Grid item xs={12} sm={6} md={4} key={survey.id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {survey.nombreEncuesta}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 1 }}>
                    {survey.descripcion}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Creada el:{" "}
                    {new Date(survey.fechaCreacion).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/surveys/${survey.id}`}
                  sx={{ margin: 2 }}
                  variant="outlined"
                >
                  Ver Detalles
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;
