function notFoundHandler(req, res) {
  res.status(404);
  res.end('Page is not found');
}

module.exports = notFoundHandler;
