/**
 * User model
 * Represents a User entity in the database
 * @module models/user
 * @requires sequelize
 * @requires sequelize/Model
 * @exports User
 * @class User
 */


"use strict";
import { Model } from "sequelize";
import app_constants from "../constants/app.js"


export default (sequelize, DataTypes) => {
    class User extends Model {}

    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    is: /^[a-zA-Z0-9_]+$/, // <-- regex for alphanumeric and underscore
                },
            },
            password: DataTypes.STRING, // hashed
            role: {
                type: DataTypes.ENUM,
                values: app_constants.USER_ROLES,
                allowNull: false,
                defaultValue: "user",
            }, // role for access control
            token: { type: DataTypes.STRING, defaultValue: null }, // jwt token for refresh token
        },
        {
            sequelize,
            modelName: "User",
            defaultScope: {
                attributes: { // removing password details at response times
                    // exclude: ["password"],
                },
            },
            indexes: [{ unique: true, fields: ["username"] }],
        }
    )

    return User;
};