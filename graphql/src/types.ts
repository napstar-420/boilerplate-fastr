import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';

import type { User } from '@fastr/orm';

export interface UserContext {
  user: User;
}

export interface ServerContext {
  event: APIGatewayProxyEventV2;
  context: Context;
}

export interface RequestContext extends ServerContext, UserContext {}

export type Scalars = {
  DateTime: {
    Input: Date;
    Output: Date;
  };
  EmailAddress: {
    Input: string;
    Output: string;
  };
  ID: {
    Input: string;
    Output: string;
  };
  URL: {
    Input: string;
    Output: string;
  };
};
