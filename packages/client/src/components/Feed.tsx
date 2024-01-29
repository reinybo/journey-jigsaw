/* eslint-disable */

import { Typography, Box, Paper, Button } from '@mui/material';
import { Moment } from 'api-typescript-runtime';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../App';

export function Feed() {

  const [moments, setMoments] = useState<Moment[]>([]);
  useEffect(() => {
    const fetchMoments = async () => {
      const response = await api.getFeed();
      setMoments(response.moments);
      console.log(response.nextToken);
    };

    fetchMoments();
  }, []);

  const navigate = useNavigate();

  const handleCreateItinerary = () => {
    navigate('/create-itinerary');
  };

  const handleCreateMoment = () => {
    navigate('/create');
  };

  return (
    <Box
      sx ={{
        padding: '5%',
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateItinerary}
        sx={{ marginBottom: '2rem' }}
      >
        Create New Itinerary
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateMoment}
        sx={{ marginBottom: '2rem' }}
      >
        Create New Moment
      </Button>

      {moments.map( moment => (
        <Paper
          elevation={5}
          style={{
            marginTop: '2rem',
            padding: '2rem',
          }}
        >
          <Typography
            sx = {{
              fontWeight: 'bold',
            }}
          >
            { moment.title }
          </Typography>
          <Typography>
            { moment.body }
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
