import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Activity = {
  id: number;
  type: string; // such as 'Hotel', 'Hike', 'Museum', etc.
  name: string; // could be the hotel name, hiking trail, museum name, etc.
  date: string; // when they plan to go
  details: string; // room number for hotel, guide name for hike, etc.
  address: string; // common field for all activities
};

export default function CreateItinerary() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState<Activity[]>([]); // Array of activities for trip.

  const addActivityField = () => {
    // Use a unique id for key, for example, the next array length could be used
    setActivities([
      ...activities,
      {
        id: activities.length,
        type: '',
        name: '',
        date: '',
        details: '',
        address: '',
      },
    ]);
  };

  // Function to update an activity
  const updateActivity = (index: number, field: keyof Activity, value: string) => {
    const newActivities = [...activities];
    (newActivities[index][field] as any) = value;
    setActivities(newActivities);
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const itinerary = {
      activities: activities,
    };

    try {
      // Send info to API later...
      console.log('Itinerary to be sent: ', itinerary);
      navigate('/feed');
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& .MuiTextField-root': { m: 1 } }}>
      {activities.map((activity, index) => (
        <Paper key={activity.id} sx={{ padding: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h6" gutterBottom>Activity {index + 1}</Typography>
          <TextField
            label="Activity Type (e.g., Hotel, Hike, Museum)"
            value={activity.type}
            onChange={e => updateActivity(index, 'type', e.target.value)}
            fullWidth
          />
          <TextField
            label="Activity Name"
            value={activity.name}
            onChange={e => updateActivity(index, 'name', e.target.value)}
            fullWidth
          />
          <TextField
            label="Date"
            value={activity.date}
            onChange={e => updateActivity(index, 'date', e.target.value)}
            fullWidth
          />
          <TextField
            label="Details"
            value={activity.details}
            onChange={e => updateActivity(index, 'details', e.target.value)}
            fullWidth
          />
          <TextField
            label="Address"
            value={activity.address}
            onChange={e => updateActivity(index, 'address', e.target.value)}
            fullWidth
          />
          {/* Button to remove the activity field */}
          <Button
            variant="outlined"
            color="error"
            onClick={() => setActivities(activities.filter((_, i) => i !== index))}
            sx={{ mt: 1 }}
          >
            Remove Activity
          </Button>
        </Paper>
      ))}
      <Button onClick={addActivityField} variant="outlined" sx={{ mt: 1 }}>Add Another Activity</Button>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>Save Itinerary</Button>
    </Box>
  );
}