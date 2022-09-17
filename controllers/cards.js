const Card = require('../models/card');

const BAD_REQUEST_MSG = 'Переданы некорректные данные';
const INTERNAL_SERVER_ERROR_MSG = 'Произошла ошибка на сервере';
const NOT_FOUND_MSG = 'Карточка не найдена';
const BAD_REQUEST_STATUS = 400;
const INTERNAL_SERVER_ERR_STATUS = 500;
const NOT_FOUND_STATUS = 404;
const SUCCESS_STATUS = 200;

const getCards = async (req, res) => {
  try {
    // console.log('get cards');
    const cards = await Card.find({});
    res.status(SUCCESS_STATUS).send({ data: cards });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const createCard = async (req, res) => {
  try {
    // console.log('create card');
    req.body.owner = req.user._id;
    const card = await new Card(req.body).save();
    res.status(SUCCESS_STATUS).send({ data: card });
  } catch (e) {
    // console.log(JSON.stringify(e));
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const deleteCard = async (req, res) => {
  try {
    // console.log('delete card');
    // console.log(req.params.cardId);
    const cardToDelete = await Card.findByIdAndRemove(req.params.cardId);
    // console.log(cardToDelete);
    if (!cardToDelete) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: cardToDelete });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
      return;
    }
    // console.log(e);
    // if (e?.errors?.name?.name === 'ValidatorError') {
    //   res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG, ...e });
    //   return;
    // }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const putLike = async (req, res) => {
  try {
    // console.log('liking card');
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
      return;
    }
    // if (e && e.errors && e.errors.name && e.errors.name.name === 'ValidatorError') {
    //   res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG, ...e });
    //   return;
    // }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const deleteLike = async (req, res) => {
  try {
    // console.log('disliking card');
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
      return;
    }
    // if (e && e.errors && e.errors.name && e.errors.name.name === 'ValidatorError') {
    //   res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG, ...e });
    //   return;
    // }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
