import { Button, TextField, Container, Typography } from '@mui/material';
import { useState } from 'react';

export function Create() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = () => {
    // Handle the form data here, e.g., make an API call
    console.log('Title:', title);
    console.log('Body:', body);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Share your experience!
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit}>
        POST
      </Button>
    </Container>
  );
}
