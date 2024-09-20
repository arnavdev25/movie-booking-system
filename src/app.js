/**
 * Main entry point for the Movie Booking API.
 * It sets up the express server,
 * imports routes, and starts the server.
 * 
 * @file App.js
 * @module app
 * @category app
 * @subcategory main
 * @requires express
 */


import express from 'express';
import routes from './routes/index.js'; // Import the routes
import migrateDb from './utils/db.util.js';
import dotenv from "dotenv"
dotenv.config() // load environment variables from .env file


const app = express();
app.use(express.json());
const PORT = process.env.APP_PORT;

/*
* Use all routes
*/
app.use('/api/', routes);


/*
* Migrate and start server
*/
migrateDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});