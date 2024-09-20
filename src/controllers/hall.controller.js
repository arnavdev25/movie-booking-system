/**
 * Controller for handling hall operations.
 * @file hall Controller
 * @module hall Controller
 * @category controllers
 * @subcategory hall
 */


import db from '../models/index.js';
import redisClient from '../config/redis.js';
import app_constants from "../constants/app.js"


export const getSeatArrangement = async (req, res) => {
    try {
        const { hall_id } = req.params;
        if (!parseInt(hall_id)) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `hall_id must be an integer`,
                result: {}
            });
        }

        // check for hall exist or not
        const hall = await db.Hall.findByPk(hall_id);
        if (!hall) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Hall does not exist`,
                result: {}
            });
        }

        // get the data from redis
        const cache_data = await redisClient.get(`hall_${hall_id}`)
        if (cache_data) {
            return res.status(app_constants.SUCCESS).json({
                success: 1,
                status: app_constants.SUCCESS,
                message: 'Seating arrangements has been fetched successfully!',
                result: JSON.parse(cache_data)
            });
        }

        // get seat arrangement
        const result = await arrangeSeat(hall_id)
        // cache the data in redis1
        await redisClient.set(`hall_${hall_id}`, JSON.stringify(result), {
            EX: 120,  // Expiration time in seconds
        });

        return res.status(app_constants.SUCCESS).json({
            success: 1,
            status: app_constants.SUCCESS,
            message: 'Seating arrangements has been fetched successfully!',
            result
        });
    }

    catch (error) {
        return res.status(app_constants.INTERNL_SERVER_ERROR).json({
            success: 0,
            status: app_constants.INTERNL_SERVER_ERROR,
            error: error.message
        });
    }
};


async function arrangeSeat(hall_id) {
    const result = {};

    const seats = await db.Seat.findAll({
        where: { hall_id },
        attributes: ['row', 'column', 'is_booked'],
        order: [['row', 'ASC'], ['column', 'ASC']]
    });

    // Organize seats by rows
    seats.forEach(seat => {
        const { row, column, is_booked } = seat;
        // Initialize array for the row if it doesn't exist
        if (!result[row]) {
            result[row] = [];
        }
        // Push seat info into the respective row array
        result[row].push([`${row}${column}`, is_booked === 1 ? 'booked' : 'available']);
    });

    // Convert the seating arrangement object into a 2D array
    return Object.values(result);
}


export const getSeatStatus = async (req, res) => {
    try {
        const { hall_id, seat_number } = req.params;
        if (!parseInt(hall_id)) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `hall_id must be an integer`,
                result: {}
            });
        }

        const parse_seat_no = parseSeatNumber(seat_number)
        if (!parse_seat_no) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: "Invalid seat number format",
                result: {}
            });
        }

        // check for hall exist or not
        const hall = await db.Hall.findByPk(hall_id);
        if (!hall) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Hall does not exist`,
                result: {}
            });
        }

        // get seat status        
        const result = await db.Seat.findOne({
            where: {
                row: parse_seat_no.row,
                column: parse_seat_no.column,
                hall_id
            },
        });

        if (!result) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Seat number does not exist`,
                result: {}
            });
        }

        return res.status(app_constants.SUCCESS).json({
            success: 1,
            status: app_constants.SUCCESS,
            message: 'Status of given seat has been fetched successfully!',
            result: { status: result.dataValues.is_booked == 0 ? 'available' : 'booked' }
        });
    }

    catch (error) {
        return res.status(app_constants.INTERNL_SERVER_ERROR).json({
            success: 0,
            status: app_constants.INTERNL_SERVER_ERROR,
            error: error.message
        });
    }
};


function parseSeatNumber(seatNumber) {
    const seatRegex = /^([A-Z]+)(\d+)$/;
    const match = seatNumber.match(seatRegex);

    if (!match) {
        return false;
    }

    return {
        row: match[1],
        column: parseInt(match[2], 10),
    };
}


export const bookSeat = async (req, res) => {
    const { hall_id, seat_number, customer_name } = req.body;

    try {
        const parse_seat_no = parseSeatNumber(seat_number)
        if (!parse_seat_no) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: "Invalid seat number format",
                result: {}
            });
        }

        // check for hall exist or not
        const hall = await db.Hall.findByPk(hall_id);
        if (!hall) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Hall does not exist`,
                result: {}
            });
        }

        // get seat status        
        const seat = await db.Seat.findOne({
            where: {
                row: parse_seat_no.row,
                column: parse_seat_no.column,
                hall_id
            },
        });

        if (!seat) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Seat number does not exist`,
                result: {}
            });
        }

        // Check if seat is already booked
        if (seat.dataValues.is_booked) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Seat already booked!`,
                result: {}
            });
        }

        // Update the seat to mark it as booked and set the customer name
        await seat.update({
            is_booked: 1,  // Mark the seat as booked
            customer_name,  // Save customer name
        });

        // const book_seat = await Seat.create({ hallId, seatNumber, customerName });
        return res.status(app_constants.SUCCESS).json({
            success: 1,
            status: app_constants.SUCCESS,
            message: 'Seat has been booked successfully!',
            result: {
                seat_number
            }
        });
    }

    catch (error) {
        return res.status(app_constants.INTERNL_SERVER_ERROR).json({
            success: 0,
            status: app_constants.INTERNL_SERVER_ERROR,
            error: error.message
        });
    }
};