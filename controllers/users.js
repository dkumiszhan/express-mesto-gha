// /* eslint-disable no-underscore-dangle */
// const mongoose = require('mongoose');
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
    // console.log('get users request');
    const users = await User.find({});
    res.status(SUCCESS_STATUS).send({ data: users });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const getUserById = async (req, res) => {
  try {
    // console.log('get user by id request');
    const id = req.params.userId;
    // console.dir(req.params);
    // console.log(id);
    // const mongoId = new mongoose.Schema.Types.ObjectId(id);
    const user = await User.findById(id);
    if (!user) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      // console.log(user);

      res.status(SUCCESS_STATUS).send({ data: user });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const createUser = async (req, res) => {
  try {
    // console.log('creating user');
    const { name, about, avatar } = req.body;
    // console.log(req.body);
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

// function ensureFieldIsStringOrUndefined(field, res) {
//   if (typeof (field) === 'string' || typeof (field) === 'undefined') {
//     return true;
//   }
//   // else {
//   // console.log(field, typeof (field));
//   res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
//   return false;
//   // return false;
//   // }
// }

const updateUserInfo = async (req, res) => {
  try {
    // console.log('update user info');
    // console.dir(req.user);
    // console.dir(req.body);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
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
    // console.log(e);
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    // console.log('update avatar');
    // if (ensureFieldIsStringOrUndefined(req.body.avatar, res)) {
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
    // }
  } catch (e) {
    // console.dir(e);
    // console.log(e);
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
