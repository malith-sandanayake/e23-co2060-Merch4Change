const timestamp = () => new Date().toISOString();

export const logInfo = (message) => {
  console.log(`[INFO] ${timestamp()} ${message}`);
};

export const logError = (message, error) => {
  if (error) {
    console.error(`[ERROR] ${timestamp()} ${message}`, error);
    return;
  }

  console.error(`[ERROR] ${timestamp()} ${message}`);
};
