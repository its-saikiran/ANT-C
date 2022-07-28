const router = require('express').Router();


const {
    sendReviewAndComments
} = require('../controllers/review.controller');

const sendReviewValidation = require('../middlewares/sendReviewValidation');

router.post('/movie', sendReviewValidation, sendReviewAndComments);

module.exports = router;