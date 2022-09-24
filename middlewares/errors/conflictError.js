// const CONFLICT_MSG = 'Пользователь не найден';
const CONFLICT_STATUS = 409;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_STATUS;
  }
}

module.exports = ConflictError;
