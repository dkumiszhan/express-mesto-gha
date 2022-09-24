// const UNAUTHORIZED_MSG = 'Пользователь не найден';
const UNAUTHORIZED_STATUS = 401;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_STATUS;
  }
}

module.exports = UnauthorizedError;
