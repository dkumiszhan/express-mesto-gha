const BAD_REQUEST_STATUS = 400;
// const BAD_REQUEST_MSG = 'Переданы некорректные данные';

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_STATUS;
  }
}
module.exports = BadRequestError;
