import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Icon for Dropdown
import DateRangeIcon from '@mui/icons-material/DateRange'; // Icon for Dates
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Icon for Travel
import EventIcon from '@mui/icons-material/Event'; // Icon for Events
import HotelIcon from '@mui/icons-material/Hotel'; // Icon for Lodging
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Icon for Location
import { Box, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Activity = {
  id: number;
  type: string;
  name: string;
  date: string;
  details: string;
  address: string;
};

export default function CreateItinerary() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([{ id: 0, type: '', name: '', date: '', details: '', address: '' }]);
  const [itinerary, setItinerary] = useState({
    tripName: '',
    location: '',
    participants: '',
    description: '',
    startDate: '',
    endDate: '',
    travelInfoBefore: {
      travelType: '',
      travelTime: '',
      details: '',
    },
    travelInfoAfter: {
      travelType: '',
      travelTime: '',
      details: '',
    },
    lodgingName: '',
    lodgingAddress: '',
  });

  const TRAVEL_TYPES = ['Airplane', 'Train', 'Bus', 'Car', 'Other'];
  const ACTIVITY_TYPES = [
    'Sightseeing Tour',
    'Outdoor Adventure',
    'Cultural Experience',
    'Food and Drink',
    'Recreational Sport',
    'Nature Exploration',
    'Leisure and Relaxation',
    'Educational Activities',
    'Nightlife',
    'Art and Craft',
    'Local Experiences',
    'Fitness and Wellness',
    'Historical Site',
    'Volunteering',
    'Other',
  ];

  const addActivityField = () => {
    setActivities([...activities, { id: activities.length, type: '', name: '', date: '', details: '', address: '' }]);
  };

  const updateActivity = (index: number, field: keyof Activity, value: string) => {
    const newActivities = [...activities];
    (newActivities[index][field] as any) = value;
    setActivities(newActivities);
  };

  const handleChange = (field: keyof typeof itinerary, value: any) => {
    setItinerary({ ...itinerary, [field]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log('Itinerary to be sent: ', { ...itinerary, activities });
      navigate('/feed');
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        '& .MuiTextField-root': { m: 1 },
        'padding': '2rem', // This adds padding to the entire page
        'maxWidth': '800px',
        'margin': 'auto', // This centers the form on the page
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <LocationCityIcon sx={{ mr: 1 }} /> Basic Information
      </Typography>
      <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
        <TextField label="Trip Name" value={itinerary.tripName} onChange={e => handleChange('tripName', e.target.value)} fullWidth />
        <TextField label="Location (City, Country)" value={itinerary.location} onChange={e => handleChange('location', e.target.value)} fullWidth />
        <TextField label="Number of Participants" type="number" value={itinerary.participants} onChange={e => handleChange('participants', e.target.value)} fullWidth />
        <TextField label="Description" multiline rows={4} value={itinerary.description} onChange={e => handleChange('description', e.target.value)} fullWidth />
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <DateRangeIcon sx={{ mr: 1 }} /> Dates
        </Typography>
        <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={itinerary.startDate} onChange={e => handleChange('startDate', e.target.value)} fullWidth />
        <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={itinerary.endDate} onChange={e => handleChange('endDate', e.target.value)} fullWidth />
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <DirectionsCarIcon sx={{ mr: 1 }} /> Travel Information
      </Typography>
      <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
        <Typography variant="h6">Travel Information to Trip:</Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel>Travel Type</InputLabel>
          <Select
            value={itinerary.travelInfoBefore.travelType}
            onChange={e => handleChange('travelInfoBefore', { ...itinerary.travelInfoBefore, travelType: e.target.value })}
            label="Travel Type"
            IconComponent={ArrowDropDownIcon}
          >
            {TRAVEL_TYPES.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Travel Time" type="time" InputLabelProps={{ shrink: true }} value={itinerary.travelInfoBefore.travelTime} onChange={e => handleChange('startDate', e.target.value)} fullWidth />

        <Typography variant="h6">Travel Information after Trip:</Typography>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel>Travel Type</InputLabel>
          <Select
            value={itinerary.travelInfoAfter.travelType}
            onChange={e => handleChange('travelInfoAfter', { ...itinerary.travelInfoAfter, travelType: e.target.value })}
            label="Travel Type"
            IconComponent={ArrowDropDownIcon}
          >
            {TRAVEL_TYPES.map((type, index) => (
              <MenuItem key={index} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Travel Time" type="time" InputLabelProps={{ shrink: true }} value={itinerary.travelInfoAfter.travelTime} onChange={e => handleChange('startDate', e.target.value)} fullWidth />
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <HotelIcon sx={{ mr: 1 }} /> Lodging
      </Typography>
      <Paper sx={{ padding: '1rem', marginBottom: '1rem' }}>
        <TextField label="Lodging Location Name" value={itinerary.lodgingName} onChange={e => handleChange('lodgingName', e.target.value)} fullWidth />
        <TextField label="Lodging Address" value={itinerary.lodgingAddress} onChange={e => handleChange('lodgingAddress', e.target.value)} fullWidth />
      </Paper>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <EventIcon sx={{ mr: 1 }} /> Events Planned
      </Typography>
      {activities.map((activity, index) => (
        <Paper key={activity.id} sx={{ padding: '1rem', marginBottom: '1rem' }}>
          <Typography variant="h6">Activity {index + 1}</Typography>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={activity.type}
              onChange={e => updateActivity(index, 'type', e.target.value)}
              label="Activity Type"
            >
              {ACTIVITY_TYPES.map((type, idx) => (
                <MenuItem key={idx} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Activity Name"
            value={activity.name}
            onChange={e => updateActivity(index, 'name', e.target.value)}
            fullWidth
          />
          <TextField
            label="Date & Time"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={activity.date}
            onChange={e => updateActivity(index, 'date', e.target.value)}
            fullWidth
          />
          <TextField
            label="Location"
            value={activity.address}
            onChange={e => updateActivity(index, 'address', e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={activity.details}
            onChange={e => updateActivity(index, 'details', e.target.value)}
            fullWidth
          />
          <Button variant="outlined" color="error" onClick={() => setActivities(activities.filter((_, i) => i !== index))} sx={{ mt: 1 }}>
            Remove Activity
          </Button>
        </Paper>
      ))}
      <Button onClick={addActivityField} variant="outlined" sx={{ mt: 1, mr: 2 }}>Add Another Activity</Button>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>Save Itinerary</Button>
    </Box>
  );
}