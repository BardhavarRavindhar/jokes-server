// index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const sequelize = require('./config/database');
const Favorite = require('./models/Favorite'); // Import your Favorite model

const app = express();
app.use(cors());
app.use(express.json());

// Sync models with the database
sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

// Utility function to standardize responses
const sendResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status: status === 200 ? 'success' : 'error',
        message,
        data,
    });
};

// Route to search jokes
app.get('/api/search-jokes', async (req, res) => {
    const { searchTerm } = req.query;
    console.log("searchTerm:", searchTerm);
    
    try {
        const response = await axios.get(`https://icanhazdadjoke.com/search`, {
            params: { term: searchTerm },
            headers: { Accept: 'application/json' }
        });
        console.log("response:", response.data);
        
        sendResponse(res, 200, 'Jokes fetched successfully', response.data);
    } catch (error) {
        console.error('Error fetching jokes:', error);
        sendResponse(res, 500, 'Failed to fetch jokes');
    }
});

// Route to save favorite jokes
app.post('/api/favorites', async (req, res) => {
    const { jokeId, jokeText, userId } = req.body;

    try {
        const favorite = await Favorite.create({ jokeId, jokeText, userId }); // Use Sequelize to create a favorite
        sendResponse(res, 200, 'Joke saved to favorites', { id: favorite.id });
    } catch (error) {
        console.error('Error saving favorite joke:', error);
        sendResponse(res, 500, 'Failed to save favorite joke');
    }
});

// Route to get favorite jokes
app.get('/api/favorites', async (req, res) => {
    try {
        const favorites = await Favorite.findAll(); 
        sendResponse(res, 200, 'Favorites retrieved successfully', favorites);
    } catch (error) {
        console.error('Error retrieving favorite jokes:', error);
        sendResponse(res, 500, 'Failed to retrieve favorite jokes');
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
