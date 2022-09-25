const NOT_FOUND_MSG = 'Page is not found';
const NotFoundError = require('../middlewares/errors/notFoundError');

function notFoundHandler(req, res, next) {
  next(new NotFoundError(NOT_FOUND_MSG));
}

module.exports = notFoundHandler;
