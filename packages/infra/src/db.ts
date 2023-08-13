import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import { Table, AttributeType, BillingMode, ProjectionType } from 'aws-cdk-lib/aws-dynamodb';

export function createTable(stack: Stack) {
  new Table(stack, 'JourneyJigsawData', {
    partitionKey: {
      name: 'pk',
      type: AttributeType.STRING,
    },
    sortKey: {
      name: 'sk',
      type: AttributeType.STRING,
    },
    billingMode: BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for prod - data will be deleted if the stack is destroyed
  });
}

export class MomentsTable extends Table {
  constructor(scope: Stack) {
    super(scope, 'MomentsTable', {
      partitionKey: {
        name: 'momentId',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    this.addGlobalSecondaryIndex({
      indexName: 'ChronologicalIndex',
      partitionKey: {
        name: 'dpk',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'createdAt',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });
  }
}