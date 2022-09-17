const NOT_FOUND_STATUS = 404;
const NOT_FOUND_MSG = 'Page is not found';

function notFoundHandler(req, res) {
  res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
}

module.exports = notFoundHandler;
