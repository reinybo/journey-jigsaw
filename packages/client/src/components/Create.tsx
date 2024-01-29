import { Button, TextField, Container, Typography } from '@mui/material';
import { useState } from 'react';
import { api } from '../App';

export function Create() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async () => {
    // Handle the form data here, e.g., make an API call
    console.log('Title:', title);
    console.log('Body:', body);
    await api.postMoment({
      title: title,
      body: body,
    }).then(response => {
      alert('Submitted Successfully');
      console.log(response);
    }).catch(error => {
      alert(`There was an error ${error}`);
      console.log(error);
    });

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
