import { JobType } from '@fastr/jobs';

import type { TaskHandler } from '.';

export const example: TaskHandler = async ({ date }) => {
  /**
   * A task runs every minute, and should be fast.
   * It just decides _what_ needs to be done, and doesn't actually
   * do it itself. Instead, you can return a list of jobs here
   * which will be automatically queued and executed by the
   * serverless queue.
   *
   * Here, I'll just make it trigger a queued job every 5 minutes.
   */
  if (date.getMinutes() % 5 === 0) {
    return [
      {
        type: JobType.EXAMPLE2,
        payload: {
          date: date.toISOString(),
        },
      },
    ];
  }
};
