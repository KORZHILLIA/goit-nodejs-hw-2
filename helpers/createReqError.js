const createReqError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  console.log(error.status);
  return error;
};

module.exports = createReqError;
