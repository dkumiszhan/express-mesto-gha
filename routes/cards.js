const express = require('express');
const {
  getCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const cardRoutes = express.Router();

cardRoutes.get('/cards', getCards);

cardRoutes.post('/cards', createCard);

cardRoutes.delete('/cards/:cardId', deleteCard);

cardRoutes.put('/cards/:cardId/likes', putLike);

cardRoutes.delete('/cards/:cardId/likes', deleteLike);

module.exports = { cardRoutes };
