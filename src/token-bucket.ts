export class TokenBucket {
  private capacity;
  private windowSize;
  private tokens;
  private nextRefillTime = 0;

  constructor(capacity, windowSize) {
    this.capacity = capacity;
    this.windowSize = windowSize;
    this.tokens = capacity;
    this.refill();
  }

  take() {
    // Calculate how many tokens (if any) should have been added since the last request
    this.refill();

    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    }

    return false;
  }

  refill() {
    const now = Math.floor(Date.now() / 1000);

    if (now < this.nextRefillTime) {
      return;
    }

    this.nextRefillTime = now + this.windowSize;

    this.tokens = this.capacity;
  }
}
