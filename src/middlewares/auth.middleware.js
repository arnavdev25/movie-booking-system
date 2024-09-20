/**
 * Middleware for JWT authentication.
 * Provides JWT authentication middleware.
 * @file JWT Authentication Plugin
 * @module JWT Authentication Plugin
 * @category plugins
 * @subcategory authentication
 */


import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import app_constants from "../constants/app.js"
import dotenv from "dotenv"
dotenv.config()
const { User } = db;


export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(app_constants.UNAUTHORIZED).json({
                success: 0,
                status: app_constants.UNAUTHORIZED,
                message: 'Token is required!',
                result: {}
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(app_constants.UNAUTHORIZED).json({
                success: 0,
                status: app_constants.UNAUTHORIZED,
                message: 'Unauthorized!',
                result: {}
            });
        }

        req.user = user; // Attach the user to the request
        next();
    }

    catch (error) {
        res.status(app_constants.INTERNL_SERVER_ERROR).json({
            success: 0,
            status: app_constants.INTERNL_SERVER_ERROR,
            error: 'Invalid token'
        });
    }
};


export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(app_constants.FORBIDDEN).json({
            success: 0,
            status: app_constants.FORBIDDEN,
            message: 'Forbidden! Admins only can access the route.',
            result: {}
        });
    }

    next();
};
