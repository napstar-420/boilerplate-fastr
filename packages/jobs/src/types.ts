export enum JobType {
  EXAMPLE = 'EXAMPLE',
  EXAMPLE2 = 'EXAMPLE2',
}

export interface DispatchPayload<T extends JobType> {
  type: T;
  payload: Payload[T];
  retries?: number;
}

export interface Payload {
  [JobType.EXAMPLE]: {
    user_id: number;
    email: string;
  };
  [JobType.EXAMPLE2]: {
    timestamp: string;
  };
}
