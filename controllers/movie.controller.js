const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const addMovie = async (req, res) => {
    const { name, releaseDate } = req.body;
    if (!name && !releaseDate) {
        res.status(400).json({ Error: 'Invalid data.' })
    }
    try {
        const data = await prisma.movie.create({
            data: { name, releaseDate }
        })
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json({ Error: 'Internal server error.' })
    }
};



const getMovies = async (req, res) => {
    try {
        let data = await prisma.movie.findMany({
            include: {
                reviews: true
            }
        })
        data = data.length > 0 ? data : 'There are no movies.'
        res.status(200).json({ data })
    } catch (error) {
        res.status(500).json({ Error: 'Internal server error.' })
    }
};



const deleteMovie = async (req, res) => {
    try {
        let id = req.params.movieId;
        if (!id) {
            return res.status(400).json({ Error: 'Provide a movie id.' })
        }
        id = parseInt(id);
        const movieData = await prisma.movie.findUnique({
            where: { id },
            include: {
                reviews: true
            }
        })
        if (!movieData) {
            return res.status(400).json({ Error: 'Movie not found with this id.' })
        }
        for(let rev of movieData.reviews){
            await prisma.review.delete({
                where: { id: rev.id }
            })
        }
        await prisma.movie.delete({
            where: { id },
            include: {
                reviews: true
            }
        })
        res.status(200).json({ Msg: 'Movie deleted.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ Error: 'Internal server error.' })
    }
};



const searchFun = async(req, res) => {
    console.log('---> search fun section!')
   try {
    let search = req.params.search;
    let moviesData = await prisma.movie.findMany({
        include: {
            reviews: true
        }
    })
    let data = []
    for (let a of moviesData){
        if(a.reviews != 0){
            for(let b of a.reviews){
                if(b.reviewComments != 0){
                    let comments = JSON.parse(b.reviewComments)
                    for(let com of comments){
                        search = search.toLowerCase()
                        if(com.toLowerCase().split(' ').includes(search)){
                            data.push(com)
                        }
                    }
                }
            }
        }
    }
    data = data.length != 0 ? data : 'No matches.'
    res.status(200).json({ data })
   } catch (error) {
    console.log(error)
    res.status(500).json({ Error: 'Internal server error.' })
   }
};



module.exports = {
    addMovie,
    getMovies,
    deleteMovie,
    searchFun,
};