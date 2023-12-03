import { Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Post } from '../types/Post';

export function Feed() {
  const posts: Post[] = [
    new Post(1, 'Let me tell you about this cool place', 'Here is what I did'),
    new Post(1, 'I would recommend this place in Italy', 'Here is why'),
  ];

  const navigate = useNavigate();

  const handleCreateItinerary = () => {
    navigate('/create-itinerary');
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

      {posts.map( post => (
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
            { post.title }
          </Typography>
          <Typography>
            { post.content }
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}