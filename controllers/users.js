/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

const getUsers = async (req, res) => {
  try {
    // console.log('get users request');
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const getUserById = async (req, res) => {
  try {
    // console.log('get user by id request');
    const id = req.params.userId;
    // console.dir(req.params);
    // console.log(id);
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      // console.log(user);

      res.status(200).send(user);
    }
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

function handleDbError(error, res) {
  // eslint-disable-next-line no-underscore-dangle
  if (
    error
    && (error._message === 'user validation failed' || error._message === 'Validation failed')
  ) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...error });
  }
}

const createUser = async (req, res) => {
  try {
    // console.log('creating user');
    const { name, about, avatar } = req.body;
    // console.log(req.body);
    const user = await new User({ name, about, avatar }).save();

    res.status(200).send(user);
  } catch (e) {
    handleDbError(e, res);
  }
};

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
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (e) {
    handleDbError(e, res);
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    // console.log('update avatar');
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      res.status(404).send({ message: 'Пользователь не найден' });
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (e) {
    // console.dir(e);
    handleDbError(e, res);
  }
};

module.exports = {
  getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar,
};
