/**
 * Util for migrating db
 */

import db from "../models/index.js";
import app_constants from "../constants/app.js"


export default async function migrateDb() {
    try {
        await db.sequelize.sync({ alter: true });
        console.log('Database synchronized');
        seedData()
    }

    catch (err) {
        console.error('Database sync failed:', err);
    }
}


async function seedData() {
    try {
        // Check if there is any existing data in the "halls" table
        const check_data = await db.Hall.count();
        
        // If data exists, return early
        if (check_data > 0) {
            console.log('Data already seeded');
            return;
        }

        // Prepare bulk insert data
        const rows = app_constants.SEAT_ROWS;
        const columns = app_constants.SEAT_COLUMNS;
        const screens = app_constants.SCREENS;

        const seat_data = [];

        // Generate hall data
        for (let screen of screens) {
              // Create hall data
            const hall = await db.Hall.create({
                hall_name: screen,
            })
            for (let row of rows) {
                for (let column of columns) {
                    seat_data.push({
                        hall_id: hall.id,
                        row: row,
                        column: column
                    });
                }
            }
        }

        // Bulk insert the hall data
        await db.Seat.bulkCreate(seat_data);

        console.log('Data Seeded Successfully');
    }

    catch (error) {
        console.error('Error seeding data:', error);
    }
}