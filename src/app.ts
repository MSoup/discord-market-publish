import { isMarketOpen, isValidMarketSymbol, logError } from './utils';
import dotenv from 'dotenv';
import { invokeWebhook } from './invoke_webhook';
import { MarketSymbol } from './types';

dotenv.config();

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const TICKER: string | undefined = process.argv[2];

if (!WEBHOOK_URL) {
  logError(new Error(`invalid webhook URL: ${WEBHOOK_URL}`));
  process.exit(1);
}
// If TICKER doesn't exist or it's not part of the valid ticker list, throw usage guide
if (!isValidMarketSymbol(TICKER)) {
  logError(
    new Error(
      `Usage: npx ts-node src/app.js usd-jpy|spy|spy-futures - received ${TICKER}`
    )
  );
}
// TICKER is now guaranteed to be usd-jpy|spy|spy-futures
const validatedTicker = TICKER as MarketSymbol;

const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;

const marketStatus = isMarketOpen(new Date()) ? 'Market Open' : 'Market Closed';

const symbolWebhookMetadata: Record<
  MarketSymbol,
  { title: string; description: string; filename: string }
> = {
  'usd-jpy': {
    title: `USD JPY - ${marketStatus}`,
    description: `📅${month}/${day}`,
    filename: 'usd-jpy.png',
  },
  spy: {
    title: `S&P500 - ${marketStatus}`,
    description: `📅${month}/${day}`,
    filename: 'us-spx-500.png',
  },
  'spy-futures': {
    title: `S&P Futures - ${marketStatus}`,
    description: `📅${month}/${day}`,
    filename: 'us-spx-500-futures.png',
  },
};

const marketSymbolMetaData = symbolWebhookMetadata[validatedTicker];

console.log('Invoking webhook for financial instrument:', validatedTicker);
invokeWebhook(WEBHOOK_URL, marketSymbolMetaData);
