/**
 * Middleware to validate required fields in request body.
 * @param {Array} requiredFields - Array of required field names.
 * @returns Middleware function for validation.
 */


import app_constants from "../constants/app.js"


export const requiredFields = (required_fields) => {
    return (req, res, next) => {
        const missing_fields = required_fields.filter(field => !req.body[field]);

        if (missing_fields.length > 0) {
            return res.status(app_constants.BAD_REQUEST).json({
                success: 0,
                status: app_constants.BAD_REQUEST,
                message: `Missing required fields: ${missing_fields.join(', ')}`,
                result: {}
            });
        }

        next();
    };
}