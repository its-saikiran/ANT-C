const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
const { port } = require('./auth/config');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', async (req, res, next) => {
  res.send({
    addMovie: 'http://localhost:9000/movie/add',
    getMovies: 'http://localhost:9000/movie/all',
    deleteMovie: 'http://localhost:9000/movie/delete/:movieId',
    search: 'http://localhost:9000/movie/:search',
    review: 'http://localhost:9000/review/movie',
  });
});

app.use('/movie', require('./routes/movie.route'));
app.use('/review', require('./routes/review.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});


app.listen(port, () => console.log(`🚀 @ http://localhost:${port}`));
