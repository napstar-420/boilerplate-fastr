import { JobType, type DispatchPayload, type Payload } from '@fastr/jobs';

import { example } from './example';
import { example2 } from './example-2';

export const handlers: Record<JobType, JobHandler<any>> = {
  [JobType.EXAMPLE]: example,
  [JobType.EXAMPLE2]: example2,
};

export type JobHandler<T extends JobType> = (payload: Payload[T]) => Promise<JobResponse<any>>;
export type JobResponse<T extends JobType> = void | DispatchPayload<T>;
