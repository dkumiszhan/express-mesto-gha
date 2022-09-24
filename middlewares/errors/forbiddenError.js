// const FORBIDDEN_MSG = 'Пользователь не найден';
const FORBIDDEN_STATUS = 403;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_STATUS;
  }
}

module.exports = ForbiddenError;
