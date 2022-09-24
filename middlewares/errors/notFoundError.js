// const NOT_FOUND_MSG = 'Пользователь не найден';
const NOT_FOUND_STATUS = 404;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_STATUS;
  }
}

module.exports = NotFoundError;
