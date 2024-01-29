import { getTokensFromAuthorizationCodeHandler } from 'api-typescript-runtime';
import { SecretsManager } from 'aws-sdk';
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';

const secretsManager = new SecretsManager();

export const handler = getTokensFromAuthorizationCodeHandler( async ({ input }) => {
  const code = input.requestParameters.code;

  const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID as string;
  const REDIRECT_URI = process.env.REDIRECT_URI as string;
  console.log(REDIRECT_URI);
  let COGNITO_CLIENT_SECRET = '';

  try {
    const secretData = await secretsManager.getSecretValue({
      SecretId: process.env.COGNITO_CLIENT_SECRET_ARN as string,
    }).promise();

    COGNITO_CLIENT_SECRET = secretData.SecretString || '';

  } catch (error) {
    console.error('Error fetching secret:', error);
    throw new Error('Failed to fetch Cognito client secret');
  }

  const COGNITO_TOKEN_URL = 'https://journey-jigsaw.auth.us-east-1.amazoncognito.com/oauth2/token';

  const data = new URLSearchParams();
  data.append('grant_type', 'authorization_code');
  data.append('client_id', COGNITO_CLIENT_ID);
  data.append('code', code);
  /** note: the redirect uri must exactly match what is set for the user pool, even down to the ending '/' */
  data.append('redirect_uri', REDIRECT_URI);

  // Encode the client_id and client_secret using base64
  const encodedCredentials = Buffer.from(`${COGNITO_CLIENT_ID}:${COGNITO_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(COGNITO_TOKEN_URL, data.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    const expiresIn = Number(response.data.expires_in);
    const date = new Date();
    date.setSeconds(date.getSeconds() + expiresIn);

    const accessToken = response.data.access_token;
    const idToken = response.data.id_token;
    const refreshToken = response.data.refresh_token;
    const expiresAt = date.toISOString();

    if (accessToken && idToken && refreshToken && expiresAt) {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': 'https://www.journey-jigsaw.com',
        },
        body: {
          accessToken: accessToken,
          idToken: idToken,
          refreshToken: refreshToken,
          // TODO: parsing as an int to address compiler warning. Change Smithy model so `expiresAt` is a string.
          expiresAt: parseInt(expiresAt),
        },
      };
    } else {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://www.journey-jigsaw.com',
        },
        body: {
          message: 'Some or all token information was missing in the response from Google',
        },
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.journey-jigsaw.com',
      },
      body: {
        message: 'An unexpected error occurred',
      },
    };
  }
});
