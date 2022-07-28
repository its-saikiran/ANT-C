const router = require('express').Router();


const {
  addMovie,
  getMovies,
  deleteMovie,
  searchFun
} = require('../controllers/movie.controller');

router.post('/add', addMovie);
router.get('/all', getMovies);
router.delete('/delete/:movieId', deleteMovie);
router.get('/:search', searchFun)

module.exports = router;