import { Stack } from 'aws-cdk-lib';
import {
  UserPool,
  UserPoolClient,
  UserPoolIdentityProviderGoogle,
  UserPoolIdentityProviderGoogleProps,
  UserPoolClientIdentityProvider,
  ProviderAttribute,
  IUserPool,
} from 'aws-cdk-lib/aws-cognito';

import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface AuthenticationCompoentProps {
  /**
   * The redirect URI to use for OAuth flows. This must match what was set in the IDP's console.
   */
  redirectUri: string;
  /**
   * The domain prefix which will be used for the hosted UI.
   * ex: journey-jigsaw leads to https://journey-jigsaw.auth.us-east-1.amazoncognito.com/
   */
  domainPrefix: string;
  /**
   * The ARN of the manually created secret in Secrets Manager, which holds the Google client secret from the
   * Google Cloud console.
   */
  googleClientSecretCompleteArn: string;
  /**
   * The client ID of the Google IDP. This must match what was set in the Google Cloud console.
   */
  googleClientId: string;
}


export class AuthenticationComponent extends Construct {
  public cognitoClientId: string;
  public cognitoClientSecret: Secret;
  public cognitoUserPool: IUserPool;

  constructor(scope: Stack, id: string, props: AuthenticationCompoentProps) {
    super(scope, id);
    const userPool = new UserPool(scope, 'UserPool', {
      selfSignUpEnabled: true,
      autoVerify: { email: true },
      signInAliases: { email: true },
      deletionProtection: false,
    });
    this.cognitoUserPool = userPool;

    userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: props.domainPrefix,
      },
    });

    const googleClientSecret = Secret.fromSecretAttributes(scope, 'GoogleClientSecret', {
      secretCompleteArn: props.googleClientSecretCompleteArn,
    }).secretValue;

    const googleIdentityProviderConfig: UserPoolIdentityProviderGoogleProps = {
      clientId: props.googleClientId,
      clientSecretValue: googleClientSecret,
      userPool: userPool,
      attributeMapping: {
        givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
        familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
        profilePicture: ProviderAttribute.GOOGLE_PICTURE,
      },
    };

    const googleIDP = new UserPoolIdentityProviderGoogle(scope, 'Google', googleIdentityProviderConfig);

    const client = new UserPoolClient(scope, 'UserPoolClient', {
      userPool,
      supportedIdentityProviders: [
        UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        callbackUrls: [
          props.redirectUri,
        ],
      },
      generateSecret: true,
    });

    const cognitoClientSecret = new Secret(scope, 'CognitoClientSecret', {
      description: `This is the secret which is for the Cognito app client ${client.userPoolClientId}, ` +
          'which is auto-generated via CDK.',
      secretName: 'cognito-oauth-app-client-secret',
      secretStringValue: client.userPoolClientSecret,
    });

    this.cognitoClientId = client.userPoolClientId;
    this.cognitoClientSecret = cognitoClientSecret;

    client.node.addDependency(googleIDP);
  }
}