const Card = require('../models/card');
const InternalServerError = require('../middlewares/errors/internalServerError');
const BadRequestError = require('../middlewares/errors/badRequestError');
const NotFoundError = require('../middlewares/errors/notFoundError');
const ForbiddenError = require('../middlewares/errors/forbiddenError');

const BAD_REQUEST_MSG = 'Переданы некорректные данные';
const INTERNAL_SERVER_ERROR_MSG = 'Произошла ошибка на сервере';
const NOT_FOUND_MSG = 'Карточка не найдена';
const FORBIDDEN_MSG = 'Ошибка прав';

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (e) {
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await new Card({ name, link, owner: req.user._id }).save();
    res.send({ data: card });
  } catch (e) {
    if (e.name === 'ValidationError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const cardToDelete = await Card.findById(req.params.cardId);
    if (!cardToDelete) {
      next(new NotFoundError(NOT_FOUND_MSG));
    } else if (cardToDelete.owner.toString() === req.user._id) {
      await cardToDelete.remove();
      res.send({ data: cardToDelete });
      return;
    } else {
      next(new ForbiddenError(FORBIDDEN_MSG));
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const putLike = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      next(new NotFoundError(NOT_FOUND_MSG));
    } else {
      res.send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!updatedCard) {
      next(new NotFoundError(NOT_FOUND_MSG));
    } else {
      res.send({ data: updatedCard });
    }
  } catch (e) {
    if (e.name === 'CastError') {
      next(new BadRequestError(BAD_REQUEST_MSG));
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_MSG));
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
