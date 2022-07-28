const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const sendReviewValidation = async (req, res, next) => {
    try {
        let { movieId, rating, reviewComments } = req.body;
        if (!movieId) {
            return res.status(400).json({ Error: 'Please provide a movie id.' })
        }
        if (!rating || rating<1 || rating>10) {
            return res.status(400).json({ Error: 'Give a rating and it should be 1 to 10.' })
        }
        if(reviewComments){
            if(typeof(reviewComments) === 'string'){
                reviewComments = [reviewComments]
            }
            req.body.reviewComments = JSON.stringify(reviewComments);
        }
        req.body.movieId = parseInt(movieId);
        const movieData = await prisma.movie.findUnique({
            where: { id: movieId },
            include: {
                reviews: true
            }
        })
        if (!movieData) {
            return res.status(404).json({ Error: 'Movie not found with this id.' })
        }
        let sumOfRatings = 0;
        if(movieData.reviews.length !== 0){
            sumOfRatings = movieData.reviews.map(rev => rev.rating).reduce((total, rat) => total + rat)
        }
        const noOfRatings = movieData.reviews.length + 1;
        rating = parseFloat(rating.toFixed(1))
        const avgRating = parseFloat(((sumOfRatings + rating )/ noOfRatings).toFixed(1));
        req.avgRating = avgRating;
        console.log(avgRating)
        next()
    } catch (error) {
        // console.log(error)
        res.status(500).json({ Error: 'Internal server error.' })
    }
}


module.exports = sendReviewValidation;