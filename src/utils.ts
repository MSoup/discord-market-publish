export const isMarketOpen = (time: Date) =>
  time.getHours() < 5 ||
  (time.getHours() >= 22 && time.getMinutes() >= 30) ||
  time.getHours() >= 23;
