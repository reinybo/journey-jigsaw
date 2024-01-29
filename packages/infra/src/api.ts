import { Authorizers, Integrations } from '@aws-prototyping-sdk/type-safe-api';
import { Api } from 'api-typescript-infra';
import { aws_route53_targets, Stack } from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Cors } from 'aws-cdk-lib/aws-apigateway';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';

interface JigsawJourneyApiProps {
  cognitoClientId: string;
  cognitoClientSecret: Secret;
  redirectUri: string;
  cognitoUserPool: IUserPool;
  momentsTable: Table;
  domainName: string;
  apiSubDomain: string;
}

export class JigsawJourneyApi extends Api {

  constructor(scope: Stack, id: string, props: JigsawJourneyApiProps) {

    const getTokensFunction = new NodejsFunction(scope, 'get-tokens', {
      depsLockFilePath: '../../package-lock.json',
      environment: {
        COGNITO_CLIENT_ID: props.cognitoClientId,
        COGNITO_CLIENT_SECRET_ARN: props.cognitoClientSecret.secretArn,
        REDIRECT_URI: props.redirectUri,
      },
      bundling: {
        nodeModules: ['aws-sdk', 'axios'],
      },
    });
    props.cognitoClientSecret.grantRead(getTokensFunction);

    const getCognitoClientId = new NodejsFunction(scope, 'get-cognito-client-id', {
      depsLockFilePath: '../../package-lock.json',
      environment: {
        COGNITO_CLIENT_ID: props.cognitoClientId,
      },
    });

    const postMomentFunction = new NodejsFunction(scope, 'post-moment', {
      depsLockFilePath: '../../package-lock.json',
      environment: {
        MOMENTS_TABLE_NAME: props.momentsTable.tableName,
      },
      bundling: {
        nodeModules: ['aws-sdk'],
      },
    });
    props.momentsTable.grantWriteData(postMomentFunction);

    const getFeedFunction = new NodejsFunction(scope, 'get-feed', {
      depsLockFilePath: '../../package-lock.json',
      environment: {
        MOMENTS_TABLE_NAME: props.momentsTable.tableName,
      },
      bundling: {
        nodeModules: ['aws-sdk'],
      },
    });
    // TODO: Since all we really need is the ability to query, we should change
    // this to not require full access but rather just give the lambda the
    // minimum necessary
    props.momentsTable.grantFullAccess(getFeedFunction);

    const cognitoAuthorizer = Authorizers.cognito({
      userPools: [props.cognitoUserPool],
      authorizerId: 'JourneyJigsawCognitoAuthorizer',
    });


    // TLS certificate
    const zone = route53.HostedZone.fromLookup(
      scope,
      'Zone',
      { domainName: props.domainName },
    );
    const apiCertificate = new acm.Certificate(scope, 'ApiCertificate', {
      domainName: props.apiSubDomain + '.' + props.domainName,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    super(scope, id, {
      integrations: {
        getTokensFromAuthorizationCode: {
          integration: Integrations.lambda(getTokensFunction),
          authorizer: Authorizers.none(),
        },
        getCognitoClientId: {
          integration: Integrations.lambda(getCognitoClientId),
          authorizer: Authorizers.none(),
        },
        postMoment: {
          integration: Integrations.lambda(postMomentFunction),
          authorizer: cognitoAuthorizer,
        },
        getFeed: {
          integration: Integrations.lambda(getFeedFunction),
          authorizer: cognitoAuthorizer,
        },
      },
      corsOptions: {
        allowOrigins: ['https://www.journey-jigsaw.com'],
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
      domainName: {
        domainName: props.apiSubDomain + '.' + props.domainName,
        certificate: apiCertificate,
        securityPolicy: apigateway.SecurityPolicy.TLS_1_2,
      },
    });

    new route53.ARecord(
      scope,
      'ApiAliasRecord',
      {
        target: route53.RecordTarget.fromAlias(
          new aws_route53_targets.ApiGateway(this.api),
        ),
        zone: zone,
        recordName: props.apiSubDomain + '.' + props.domainName,
      },
    );
  }

}
