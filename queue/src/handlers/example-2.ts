import { JobType } from '@fastr/jobs';

import type { JobHandler } from '.';

export const example2: JobHandler<JobType.EXAMPLE2> = async payload => {
  console.log('example2 job handler was triggered!', { ...payload });
};
