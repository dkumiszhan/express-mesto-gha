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
    const cards = await Card.find({});
    res.status(SUCCESS_STATUS).send({ data: cards });
  } catch (e) {
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const createCard = async (req, res) => {
  try {
    req.body.owner = req.user._id;
    const card = await new Card(req.body).save();
    res.status(SUCCESS_STATUS).send({ data: card });
  } catch (e) {
    if (e.name === 'ValidationError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const deleteCard = async (req, res) => {
  try {
    const cardToDelete = await Card.findByIdAndRemove(req.params.cardId);
    if (!cardToDelete) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: cardToDelete });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const putLike = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
    res.status(INTERNAL_SERVER_ERR_STATUS).send({ message: INTERNAL_SERVER_ERROR_MSG });
  }
};

const deleteLike = async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      res.status(NOT_FOUND_STATUS).send({ message: NOT_FOUND_MSG });
    } else {
      res.status(SUCCESS_STATUS).send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      res.status(BAD_REQUEST_STATUS).send({ message: BAD_REQUEST_MSG });
      return;
    }
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
