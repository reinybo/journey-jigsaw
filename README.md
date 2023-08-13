# Journey Jigsaw
Journey Jigsaw is an MVP web application built using AWS CDK for infrastructure as code, Smithy for API definitions, Projen for project structuring, and AWS Amplify to deploy a frontend react app. Journey Jigsaw is a social media website with a purpose: to get users excited about their upcoming trip, and help them plan their journey's itinerary as a group.

## Setup
1. Bookmark the [console link](https://723035846152.signin.aws.amazon.com/console) for the root account 723035846152.
1. Install cdk `npm install -g aws-cdk`.
1. Generate an access key for this account, which will be used to perform authenticated actions via shell. [docs](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html)
1. Use those keys to populate your `~/.aws/config` file, which is where cdk will look for credentials. It should look like the following:
```
[default]
aws_access_key_id=AKI..............CTH
aws_secret_access_key=gXI..................................Xxw
region = us-east-1
output = json
```

## How to deploy infrastructure changes
1. Make changes to the `packages/infra/src` directory.
1. `cd` into that directory and run `npx cdk deploy`

## How to deploy front-end changes
1. Make changes to the `packages/client/src` directory.
1. `cd` into that directory and run `npm run build` to create build artifacts in the `packages/client/build` directory.
1. `cd` into the `packages/infra/src` directory.
1. Run `npx cdk deploy`.

## How to get API model changes reflected with autocomplete
1. Run `npx nx run-many --all --target build`.

## Manual changes list
Cdk is nice since it gives you a complete recipe for the stack. However, some things have to be done manually via the Console for this to work. Here's a list of actions which are prerequisites for this deployment to work.
1. Buying the `journey-jigsaw.com` domain, and making sure its name servers match what is in the deployed "HostedZone".
1. Creating accounts for the development team in IAM.
1. Adding the `google-oauth-web-client-secret` secret in secrets manager.