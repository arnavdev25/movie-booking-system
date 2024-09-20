/**
 * Controller for handling auth operations.
 * @file auth Controller
 * @module auth Controller
 * @category controllers
 * @subcategory auth
 */


import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import app_constants from "../constants/app.js"
import dotenv from "dotenv"
dotenv.config() // load environment variables from .env file
const { User } = db


export const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // check if user with same username exist
        const exist_user = await User.findOne({ where: { username } });
        if (exist_user) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: 'User already exists!',
                result: {}
            });
        }

        const salt = await bcrypt.genSalt(10)
        const hashed_password = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            password: hashed_password,
            role
        });

        return res.status(app_constants.SUCCESS).json({
            success: 1,
            status: app_constants.SUCCESS,
            message: 'User has been registered successfully!',
            result: { id: user.id, username }
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


export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.User.findOne({ where: { username } });
        if (!user && !user?.dataValues) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: 'User does not exist!',
                result: {}
            });
        }

        const is_match = await bcrypt.compare(password, user.dataValues.password);
        if (!is_match) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: 'Invalid credentials!',
                result: {}
            });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(app_constants.SUCCESS).json({
            success: 1,
            status: app_constants.SUCCESS,
            message: 'User logged in successfully!',
            result: token
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