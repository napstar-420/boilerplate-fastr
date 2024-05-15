import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { mockClient } from 'aws-sdk-client-mock';
import { beforeEach, expect, suite, test } from 'vitest';

import { dispatch, JobType } from '../src';

const sqsMock = mockClient(SQSClient);

beforeEach(() => {
  sqsMock.reset();
});

suite('jobs', () => {
  test.concurrent('should successfully queue a given job', () => {
    sqsMock.on(SendMessageCommand).resolves({
      MessageId: '1234',
    });

    expect(
      dispatch({
        type: JobType.GIVE_UNITS,
        payload: {
          player_id: '123456',
          units: 1_000,
        },
      }),
    ).resolves.toStrictEqual({
      MessageId: '1234',
    });
  });
});
