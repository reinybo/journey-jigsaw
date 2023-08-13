import { randomUUID } from 'crypto';
import { postMomentHandler } from 'api-typescript-runtime';
import { DynamoDB } from 'aws-sdk';

const ddb = new DynamoDB.DocumentClient();

export const handler = postMomentHandler( async ({ input }) => {
  const momentId = randomUUID();
  const { title, body } = input.requestParameters;
  const momentsTableName = process.env.MOMENTS_TABLE_NAME as string;

  console.log(`Adding post with title "${title}" and body: "${body}" to "${momentsTableName}"`);

  await ddb.put({
    TableName: momentsTableName,
    Item: {
      momentId: momentId,
      title: title,
      body: body,
      createdAt: String(Date.now()),
      dpk: 'all_moments',
    },
  }).promise();

  return {
    statusCode: 200,
    body: {
      message: 'Successfully uploaded a momemnt',
    },
  };
});