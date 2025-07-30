import React, { useState, useEffect } from 'react';
import { getAllSurveys } from '../services/survey.service';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Grid, Box, CircularProgress } from '@mui/material';

const DashboardPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const surveysData = await getAllSurveys();
        setSurveys(surveysData.encuestas);
      } catch (error) {
        console.error('Failed to fetch surveys', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Available Surveys
      </Typography>
      <Grid container spacing={3}>
        {surveys.map((survey) => (
          <Grid item xs={12} sm={6} md={4} key={survey.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{survey.nombreEncuesta}</Typography>
                <Typography color="textSecondary">{survey.descripcion}</Typography>
              </CardContent>
              <Button component={Link} to={`/surveys/${survey.id}`} sx={{ margin: 2 }}>
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;
