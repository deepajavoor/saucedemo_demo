/** Converts a rendered price string like "$29.99" into a number. */
export function parsePrice(priceText: string): number {
  return Number(priceText.replace(/[^0-9.]/g, ''));
}

/** Sums a list of price strings — used to independently verify subtotal math. */
export function sumPrices(priceTexts: string[]): number {
  return priceTexts.reduce((sum, p) => sum + parsePrice(p), 0);
}
