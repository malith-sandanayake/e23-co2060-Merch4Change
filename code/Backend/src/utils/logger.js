//print clean, consistent logs for debugging and monitoring backend

const timestamp = () => new Date().toISOString();
// example ISO string: 2026-04-16T10:25:30.123Z

export const logInfo = (message) => {
  console.log(`[INFO] ${timestamp()} ${message}`);
};

export const logError = (message, error) => {
  // with error object 
  // example: print clean, consistent logs for debugging and monitoring your backend.
  if (error) {
    console.error(`[ERROR] ${timestamp()} ${message}`, error);
    return;
  }

  // without error object
  // example: [ERROR] 2026-04-16T10:25:30.123Z Something went wrong
  console.error(`[ERROR] ${timestamp()} ${message}`);
};
