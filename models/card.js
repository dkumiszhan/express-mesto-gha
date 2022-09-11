const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
      minlength: 2, // минимальная длина имени — 2 символа
      maxlength: 30, // а максимальная — 30 символов
    },
    link: {
      // у пользователя есть имя — опишем требования к имени в схеме:
      type: String, // имя — это строка
      required: true, // оно должно быть у каждого пользователя, так что имя — обязательное поле
    },
    owner: {
      type: mongoose.ObjectId,
      required: true,
    },
    likes: [
      {
        type: mongoose.ObjectId,
        default: [],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
);
module.exports = mongoose.model('card', cardSchema);