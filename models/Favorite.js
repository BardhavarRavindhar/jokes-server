const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

class Favorite extends Model {}

Favorite.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jokeId: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    jokeText: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Favorite',
});

module.exports = Favorite;
