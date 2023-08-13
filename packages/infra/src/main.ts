import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { JigsawJourneyApi } from './api';
import { AuthenticationComponent } from './authn-component';
import { StaticSite } from './static-site';
import { MomentsTable } from './db';


export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);
    const homePage = 'https://www.journey-jigsaw.com/';
    const redirectUri = homePage;

    const authnComponent = new AuthenticationComponent(this, 'AuthorizationComponent', {
      redirectUri: redirectUri,
      domainPrefix: 'journey-jigsaw',
      googleClientSecretCompleteArn: 'arn:aws:secretsmanager:us-east-1:723035846152:secret:google-oauth-web-client-secret-ABkaMw',
      googleClientId: '886329708918-c0fjeke99kj5mr5rcm8fo659v6i5is26.apps.googleusercontent.com',
    });

    new StaticSite(this, 'StaticSite', {
      domainName: 'journey-jigsaw.com',
      siteSubDomain: 'www',
    });

    const momentsTable = new MomentsTable(this);

    new JigsawJourneyApi(this, 'JigsawJourneyApi', {
      cognitoClientId: authnComponent.cognitoClientId,
      cognitoClientSecret: authnComponent.cognitoClientSecret,
      redirectUri: redirectUri,
      cognitoUserPool: authnComponent.cognitoUserPool,
      momentsTable: momentsTable,
    });

  }
}

// For development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: 'us-east-1',
};

const app = new App();

new MyStack(app, 'infra-dev', {
  env: devEnv,
  description: 'This stack includes resources for the Jigsaw Journey frontend site and backend.',
});
// new MyStack(app, 'infra-prod', { env: prodEnv });

app.synth();