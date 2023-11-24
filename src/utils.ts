import { MarketSymbol } from 'types';

export const isMarketOpen = (time: Date) =>
  time.getHours() < 5 ||
  (time.getHours() >= 22 && time.getMinutes() >= 30) ||
  time.getHours() >= 23;

export const logError = (error: Error) => {
  console.error(error);
};

export const isValidMarketSymbol = (symbol: string): symbol is MarketSymbol =>
  ['usd-jpy', 'spy', 'spy-futures'].includes(symbol);
