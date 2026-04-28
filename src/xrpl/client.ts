import { Client } from 'xrpl';
import { config } from '../config';

export const createClient = (): Client => new Client(config.network);

export const explorerTxUrl = (hash: string): string =>
  `https://testnet.xrpl.org/transactions/${hash}`;
