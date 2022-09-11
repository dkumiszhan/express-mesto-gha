/* eslint-disable no-underscore-dangle */
const Card = require('../models/card');

function handleDbError(error, res) {
  if (
    error
    && (error._message === 'card validation failed' || error._message === 'Validation failed')
  ) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  } else {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...error });
  }
}

const getCards = async (req, res) => {
  try {
    // console.log('get cards');
    const cards = await Card.find({});
    res.status(200).send(cards);
  } catch (e) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...e });
  }
};

const createCard = async (req, res) => {
  try {
    // console.log('create card');
    req.body.owner = req.user._id;
    const card = await new Card(req.body).save();
    res.status(200).send(card);
  } catch (e) {
    handleDbError(e, res);
  }
};

const deleteCard = async (req, res) => {
  try {
    // console.log('delete card');
    // console.log(req.params.cardId);
    const cardToDelete = await Card.findByIdAndRemove(req.params.cardId);
    // console.log(cardToDelete);
    if (!cardToDelete) {
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(200).send('');
    }
  } catch (e) {
    // console.log(e);
    handleDbError(e, res);
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
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(200).send('');
    }
  } catch (e) {
    handleDbError(e, res);
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
      res.status(404).send({ message: 'Карточка не найдена' });
    } else {
      res.status(200).send('');
    }
  } catch (e) {
    handleDbError(e, res);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
