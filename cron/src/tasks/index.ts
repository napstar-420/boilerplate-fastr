import type { DispatchPayload } from '@fastr/jobs';

import { example } from './example';

export const tasks: TaskHandler[] = [example];

export type TaskHandler = (context: TaskContext) => Promise<void | DispatchPayload<any> | DispatchPayload<any>[]>;

export interface TaskContext {
  date: Date;
}
