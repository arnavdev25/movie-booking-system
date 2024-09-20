/**
 * Router for auth .
 * Handles auth operations.
 * @file auth Routes
 * @module auth Routes
 * @category routes
 * @subcategory auth
 */


import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller.js';
import { requiredFields } from '../middlewares/validate.middleware.js';


const router = Router();

/**
 * Route for user signup.
 * Handles the user signup functionality.
 */
router.post(
    '/register',
    requiredFields(['username', 'password', 'role']), // Validate required fields
    registerUser
);

/**
 * Route for user login.
 * Handles the user login functionality.
 */
router.post(
    '/login',
    requiredFields(['username', 'password']), // Validate required fields
    loginUser
);


export default router;