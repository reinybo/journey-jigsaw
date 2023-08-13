import { getFeedHandler } from 'api-typescript-runtime';
import { DynamoDB } from 'aws-sdk';

export const handler = getFeedHandler( async ({ input }) => {
  const momentsTableName = process.env.MOMENTS_TABLE_NAME as string;
  console.log(momentsTableName);

  const { limit, nextToken } = input.requestParameters;
  const ddb = new DynamoDB.DocumentClient();

  console.log(limit);
  console.log(nextToken);

  const queryParams = {
    TableName: momentsTableName,
    IndexName: 'ChronologicalIndex', // Name of your Global Secondary Index
    KeyConditionExpression: 'dpk = :dv',
    ExpressionAttributeValues: {
      ':dv': 'all_moments',
    },
    Limit: parseInt(limit as string),
    ScanIndexForward: false, // Return in reverse order
    ExclusiveStartKey: nextToken ? JSON.parse(nextToken as string) as DynamoDB.DocumentClient.Key : undefined,
  };

  const result = await ddb.query(queryParams).promise();

  return {
    statusCode: 200,
    body: {
      moments: result.Items,
      nextToken: JSON.stringify(result.LastEvaluatedKey),
    },
  };
});