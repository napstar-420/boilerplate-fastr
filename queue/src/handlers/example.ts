import { JobType } from '@fastr/jobs';

import type { JobHandler } from '.';

export const example: JobHandler<JobType.EXAMPLE> = async payload => {
  console.log('example job handler was triggered!', { ...payload });
};
