const User = require('../models/user');

const BAD_REQUEST_MSG = 'Переданы некорректные данные';
const INTERNAL_SERVER_ERROR_MSG = 'Произошла ошибка на сервере';
const NOT_FOUND_MSG = 'Пользователь не найден';
const BAD_REQUEST_STATUS = 400;
const INTERNAL_SERVER_ERR_STATUS = 500;
const NOT_FOUND_STATUS = 404;
const SUCCESS_STATUS = 200;
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(SUCCESS_STATUS).send({ data: users });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    if (!user) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: user });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await new User({ name, about, avatar }).save();

    res.status(SUCCESS_STATUS).send({ data: user });
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const updateUserInfo = async (req, res) => {
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
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedUser });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedUser });
    }
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar,
};
