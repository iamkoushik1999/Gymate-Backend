export const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  const message = error.message ? error.message : 'Internal server error';
  const stack = error.stack ? error.stack : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: stack,
  });
};
