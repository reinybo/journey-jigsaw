import { getCognitoClientIdHandler } from 'api-typescript-runtime';

export const handler = getCognitoClientIdHandler( async () => {
  const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

  if (COGNITO_CLIENT_ID === undefined) {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.journey-jigsaw.com',
      },
      body: {
        message: 'Cognito client ID not found',
      },
    };
  } else {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://www.journey-jigsaw.com',
      },
      body: {
        clientId: COGNITO_CLIENT_ID,
      },
    };
  }
});
