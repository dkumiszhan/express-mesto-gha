const express = require('express');
const mongoose = require('mongoose');
const { cardRoutes } = require('./routes/cards');
const { userRoutes } = require('./routes/users');
const notFoundHandler = require('./routes/notFound');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());

// for the yandex project
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '631d147cad13dd266771cb2e', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(userRoutes);
app.use(cardRoutes);
app.use(notFoundHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
