// asynchronous functions error handler
// fn - original route logic
// asynchHandler returns a new function (req, res, next)
// next - use to pass the control to the next middleware

const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
// Promise.resolve converts a synchronous error into a rejected promise, so catch() can handle it still
// usign catch(next)/ next(error) instead of next(), skips all regular routes and looks specially for Error Handling middleware

export default asyncHandler;
