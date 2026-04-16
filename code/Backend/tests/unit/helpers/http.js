export const createMockResponse = () => {
  const res = {
    statusCode: undefined,
    payload: undefined,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
  };

  return res;
};

export const nextTick = () => new Promise((resolve) => setImmediate(resolve));
