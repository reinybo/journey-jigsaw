import { Typography, Grid, Button, Paper, Box } from '@mui/material';

class HomeProps {
  loginUrl: string;
  constructor(loginUrl: string) {
    this.loginUrl = loginUrl;
  }
}

export function Home(props: HomeProps) {
  return (
    <Box>
      <Paper
        sx={{
          height: '500px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Grid container>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // This centers the content vertically
              paddingLeft: 10,
              paddingRight: 10,
              height: '500px',
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx = {{
                fontWeight: 'bold',
              }}
            >
                Journey Jigsaw
            </Typography>
            <Typography variant="body1" gutterBottom>
                Journey Jigsaw is the best place to discover hidden jems & plan your upcoming vacation as a group!
                Whether you're an experienced trip planner or are just getting started, you can join our inclusive
                community to get lots of inspirations!
            </Typography>
            <Grid
              container
              spacing={2}
              sx={{ paddingTop: 2 }}
            >
              <Grid item>
                <Button variant="contained" href={props.loginUrl} color="primary">
                    Log in or sign up
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary">
                    Check us out on GitHub!
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              '& img': {
                height: '100%',
                width: 'auto',
              },
            }}
          >
            <Box
              component="img"
              src="banner-image.png"
              alt="Your Description"
              sx={{
                height: '500px',
                objectFit: 'contain',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      <Typography
        align="center"
        variant="body1"
        sx={{
          padding: '50px',
        }}>
            We should write some more content here, which will intice the user
            to sign up.
      </Typography>
    </Box>
  );
}