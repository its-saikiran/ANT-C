const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const sendReviewAndComments = async(req, res) => {
    console.log('---> send review section!')
   try {
    const movieId = req.body.movieId;
    await prisma.review.create({
        data: req.body
    })

    const data = await prisma.movie.update({
        where: { id: movieId },
        data: { avgRating: req.avgRating },
        include: {
            reviews: true
        }
    })
    res.status(200).json({ data })
   } catch (error) {
    console.log(error)
    res.status(500).json({ Error: 'Internal server error.' })
   }
};


module.exports = {
    sendReviewAndComments,
}