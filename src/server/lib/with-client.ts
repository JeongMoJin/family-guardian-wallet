import { Client } from 'xrpl';
import { createClient } from '../../xrpl/client';

// 라우트마다 client.connect / disconnect 를 반복 작성하지 않기 위한 래퍼.
export const withClient = async <T>(fn: (client: Client) => Promise<T>): Promise<T> => {
  const client = createClient();
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.disconnect();
  }
};
