import { Typography, Grid, Button, Box } from '@mui/material';
import { styled } from '@mui/system';
const bannerImage = process.env.PUBLIC_URL + '/home-background.png';


class HomeProps {
  loginUrl: string;
  constructor(loginUrl: string) {
    this.loginUrl = loginUrl;
  }
}

const FullScreenBackground = styled('div')({
  height: '100vh', // Full screen height
  width: '100vw', // Full screen width
  backgroundImage: `url(${bannerImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center 58px',
  position: 'absolute', // Position it absolutely so it's behind all other content
  top: 0,
  left: 0,
  zIndex: -1, // Ensure it's behind all other content
});

const CenteredContent = styled(Box)({
  'height': '100vh', // Full screen height
  'display': 'flex',
  'flexDirection': 'column',
  'justifyContent': 'center',
  'alignItems': 'center',
  'textAlign': 'center', // Center text alignment
  'color': 'white',
  'zIndex': 1, // Ensure the content is above the background
  'position': 'relative', // Position relative to the FullScreenBackground
  'padding': '0 20px', // Add some padding on the sides
  '& > *': { // Target all direct children
    maxWidth: '600px', // Set a max width for the text to make it more compressed
    width: '100%', // Make the width up to 100% of the parent container
  },
});

export function Home(props: HomeProps) {
  return (
    <>
      <FullScreenBackground />
      <CenteredContent>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
          Journey Jigsaw
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)' }}>
          Plan your group vacations & discover hidden gems across the globe!
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button variant="contained" href={props.loginUrl} color="primary">
              Log in or sign up
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              href="https://github.com/reinybo/journey-jigsaw"
              target="_blank" // opens the link in a new tab
              rel="noopener noreferrer" // Security feature for opening links in new tabs
            >
              Check us out on GitHub!
            </Button>
          </Grid>
        </Grid>
      </CenteredContent>
    </>
  );
}