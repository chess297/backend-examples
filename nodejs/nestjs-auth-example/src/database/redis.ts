class Redis {
  private data: Record<string, string> = {};
  set(key: string, value: string) {
    this.data[key] = value;
  }

  get(key: string) {
    return this.data[key];
  }

  delete(key: string) {
    delete this.data[key];
  }
}

export const redis = new Redis();
