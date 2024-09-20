/**
 * Router for hall .
 * Handles hall operations.
 * @file hall Routes
 * @module hall Routes
 * @category routes
 * @subcategory hall
 */


import { Router } from 'express';
import { getSeatArrangement, getSeatStatus, bookSeat } from '../controllers/hall.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware.js';
import { requiredFields } from '../middlewares/validate.middleware.js';


const router = Router();

/**
 * Route for getting seat arrangemnets.
 * gets the seat arrangemnets with the specified hall ID.
 * Request parameters should include the hall id.
 */
router.get('/:hall_id', getSeatArrangement);

/**
 * Route for getting seat status.
 * gets the seat status with the specified seat-number.
 * Request parameters should include the seat-number.
 */
router.get('/:hall_id/:seat_number', getSeatStatus);

/**
  * Route for booking a seat.
  * Books a seat with the provided information.
  * Requires authentication and admin role.
  * Request body should contain hall-id, customer name and seat number fields.
  */
router.post(
    '/book',
    authenticate,
    authorizeAdmin,
    requiredFields(['hall_id', 'seat_number', 'customer_name']), // Validate required fields
    bookSeat
);


export default router;