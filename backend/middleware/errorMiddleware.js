function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || (err.name === 'ValidationError' ? 400 : 500);
  res.status(status).json({ message: status === 500 ? 'Something went wrong on the server' : err.message });
}
export default errorHandler;
