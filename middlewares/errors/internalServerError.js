// const NOT_FOUND_MSG = 'Пользователь не найден';
const INTERNAL_SERVER_STATUS = 500;

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_STATUS;
  }
}

module.exports = InternalServerError;
