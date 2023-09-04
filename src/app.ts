import { isMarketOpen } from './utils';
import dotenv from 'dotenv';
import { invokeWebhook } from './invoke_webhook';
import { MarketSymbol, MarketMetadata } from './types';

dotenv.config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const FETCH_DATA = process.argv[2];

if (!WEBHOOK_URL) {
  const invalidEnvError = new Error('Error: Check WEBHOOK_URL env variable');
  console.error(invalidEnvError.message);
  process.exit(1);
}
if (!FETCH_DATA) {
  const invalidArgsError = new Error(
    'Usage: npx ts-node src/app.js usd-jpy|spy|spy-futures'
  );
  console.error(invalidArgsError.message);
  process.exit(1);
}

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;

const marketStatus = isMarketOpen(new Date()) ? 'Market Open' : 'Market Closed';

const metadata: Record<MarketSymbol, MarketMetadata> = {
  'usd-jpy': {
    title: `USD JPY - ${marketStatus}`,
    description: `State of USD JPY - ${month}/${day}`,
    filename: 'usd-jpy.png',
  },
  spy: {
    title: `S&P500 - ${marketStatus}`,
    description: `State of S&P500 - ${month}/${day}`,
    filename: 'us-spx-500.png',
  },
  'spy-futures': {
    title: `S&P Futures - ${marketStatus}`,
    description: `State of S&P500 Futures - ${month}/${day}`,
    filename: 'us-spx-500-futures.png',
  },
};

const marketSymbolMetaData = metadata[FETCH_DATA as MarketSymbol];

console.log('Invoking webhook for financial instrument:', FETCH_DATA);
invokeWebhook(WEBHOOK_URL, marketSymbolMetaData);
