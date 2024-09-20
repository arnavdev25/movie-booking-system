/**
 * Hall model
 * Represents a Hall entity in the database
 * @module models/Hall
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Hall
 * @class Hall
 */


"use strict";
import { Model } from "sequelize";
import app_constants from "../constants/app.js"


export default (sequelize, DataTypes) => {
    class Hall extends Model {
        static associate(models) {
            // Associate Hall with Seats (1-to-many)
            Hall.hasMany(models.Seat, {
                foreignKey: 'hall_id', // FK in the Seat table
                as: 'seats', // alias to refer to seats in a hall
            });
        }
    }

    Hall.init(
        {
            hall_name: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { sequelize, modelName: 'Hall' }
    )

    return Hall;
};