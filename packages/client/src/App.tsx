/* eslint-disable */

import { Configuration, DefaultApi } from 'api-typescript-runtime';
import './App.css';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, ThemeProvider, Avatar, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Create } from './components/Create';
import { Feed } from './components/Feed';
import { Home } from './components/Home';
import { IdTokenPayload } from './types/IdTokenPayload';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F06292',
    },
    secondary: {
      main: '#512DA8',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
  },
});

function App() {

  const apiConfig = new Configuration({
    basePath: 'https://v6usx7oyj0.execute-api.us-east-1.amazonaws.com/prod',
  });

  const api = new DefaultApi(apiConfig);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [givenName, setGivenName] = useState<string>('');

  useEffect(() => {
    const getTokens = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      if (code) {
        const response = await api.getTokensFromAuthorizationCode({ code: code });
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('idToken', response.idToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('expiresAt', String(response.expiresAt));
      }
    };

    getTokens().then(() => {
      if (localStorage.getItem('expiresAt')) {
        let expiresAt = localStorage.getItem('expiresAt') as string;
        let expiryDate = new Date(expiresAt);
        let currentDate = new Date();
        setIsLoggedIn(expiryDate > currentDate);
      }
    }).then(() => {
      const idToken = localStorage.getItem('idToken') as string;
      const payload: IdTokenPayload = decodeJwtPayload(idToken);
      if (!payload) {
        return;
      }
      setProfilePictureUrl(payload.picture || '');
      setGivenName(payload.given_name || '');
    });
  }, []);

  const [clientId, setClientId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await api.getCognitoClientId();
      setClientId(response.clientId);
    };

    fetchData();
  }, []);

  const hrefForHostedUI = clientId ?
    ('https://journey-jigsaw.auth.us-east-1.amazoncognito.com/oauth2/authorize?'
    + `client_id=${clientId}&`
    + 'response_type=code&'
    + 'scope=aws.cognito.signin.user.admin+email+openid+phone+profile'
    + '&redirect_uri=https%3A%2F%2Fwww.journey-jigsaw.com%2F')
    : '#';

  // extract 'code' query parameter from the page URL. If it doesn't exist we send
  // users to the hrefForHostedUI to go through OAauth2 login flow.

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" flexGrow={1}>
                Journey Jigsaw
              </Typography>
              <Box>
                <Avatar alt={givenName} src={profilePictureUrl} />
              </Box>
            </Toolbar>
          </AppBar>


          <Routes>
            <Route path="/create" element={<Create />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/" element={isLoggedIn ? <Feed /> : <Home loginUrl={hrefForHostedUI} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function base64UrlDecode(str: string): string {
  // Convert Base64Url to Base64 by replacing `-` with `+` and `_` with `/`
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Decode the Base64 string
  return decodeURIComponent(atob(base64)
    .split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join(''));
}

function decodeJwtPayload(jwt: string): any {
  // Split the JWT into its three parts
  const parts = jwt?.split('.');
  if (!parts || parts.length < 1) {
    return;
  }

  // Decode the payload
  const payload = parts[1];
  return JSON.parse(base64UrlDecode(payload));
}


export default App;
