/**
 * Database configuration and model initialization.
 * Imports and associates all the models with the Sequelize instance.
 * @module models/index
 * @requires sequelize
 * @requires sequelize/Model
 * @requires models/*
 * @exports db
 */


'use strict';
import Sequelize from 'sequelize';
import config from '../config/database.js';


// Import the model files
import User from './User.model.js';
import Hall from './Hall.model.js';
import Seat from './Seat.model.js';


const db = {};
const sequelize = new Sequelize(config);


// Add imported models to the db object
db.User = User(sequelize, Sequelize.DataTypes);
db.Hall = Hall(sequelize, Sequelize.DataTypes);
db.Seat = Seat(sequelize, Sequelize.DataTypes);


// Initialize models
const initializeModels = () => {
    console.log(`Imported ${Object.keys(db).length} models`);
    for (const modelName of Object.keys(db)) {
        console.log(`Associating ${modelName}`);
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    }
};


initializeModels();
db.sequelize = sequelize;
db.Sequelize = Sequelize;


export default db;