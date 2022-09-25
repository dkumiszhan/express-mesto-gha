const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/unauthorized');

const UNAUTHORIZED_MSG = 'Ошибка авторизации';

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(UNAUTHORIZED_MSG));
    return;
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    next(new UnauthorizedError(UNAUTHORIZED_MSG));
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
  // return res.status(200).send({ data: payload });
}

module.exports = auth;
