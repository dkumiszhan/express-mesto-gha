const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InternalServerError = require('../middlewares/errors/internalServerError');
const BadRequestError = require('../middlewares/errors/badRequestError');
const NotFoundError = require('../middlewares/errors/notFoundError');
const UnauthorizedError = require('../middlewares/errors/unauthorized');
const ConflictError = require('../middlewares/errors/conflictError');

const BAD_REQUEST_MSG = 'Переданы некорректные данные';
const CONFLICT_MSG = 'Email занят';
const INTERNAL_SERVER_ERROR_MSG = 'Произошла ошибка на сервере';
const NOT_FOUND_MSG = 'Пользователь не найден';
const UNAUTHORIZED_MSG = 'Ошибка авторизации';
const SUCCESS_STATUS = 200;
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(SUCCESS_STATUS).send({ data: users });
  } catch (e) {
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      next(new NotFoundError(NOT_FOUND_MSG));
    } else {
      res.status(SUCCESS_STATUS).send({ data: user });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: passwordHash,
    });

    res.status(SUCCESS_STATUS).send({ data: user });
  } catch (e) {
    console.error(e);
    if (e.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    if (e.code === 11000) {
      next(new ConflictError(CONFLICT_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(SUCCESS_STATUS).send({ data: user });
  } catch (e) {
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
    // res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      next(new NotFoundError(NOT_FOUND_MSG));
      // res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedUser });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      // res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
    // res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      next(new NotFoundError(NOT_FOUND_MSG));
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedUser });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError(UNAUTHORIZED_MSG));
      // res.status(401).send({ message: 'Неправильные почта или пароль' });
      // return Promise.reject(new Error('Неправильные почта или пароль'));
    } else {
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        next(new UnauthorizedError(UNAUTHORIZED_MSG));
        // res.status(401).send({ message: 'Неправильные почта или пароль' });
        return;
        // return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // res.set('token', token);
      res.status(SUCCESS_STATUS).send({ _id: user._id, token });
    }
  } catch (e) {
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
    // res.status(500).send({ message: e.name });
  }
};

module.exports = {
  getUsers, getUserById, createUser, getUserInfo, updateUserInfo, updateUserAvatar, login,
};
