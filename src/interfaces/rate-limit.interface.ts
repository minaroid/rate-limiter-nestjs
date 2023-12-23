export interface RateLimitInterface {
  capacity: number;
  window: number;
  tokens: number;
  lastRefillTime: number;
  nextRefillTime: number;
}
