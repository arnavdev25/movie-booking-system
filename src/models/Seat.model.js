/**
 * Seat model
 * Represents a Seat entity in the database
 * @module models/Seat
 * @requires sequelize
 * @requires sequelize/Model
 * @exports Seat
 * @class Seat
 */


"use strict";
import { Model } from 'sequelize';


export default (sequelize, DataTypes) => {
    class Seat extends Model {
        static associate(models) {
            Seat.belongsTo(models.Hall, {
                foreignKey: 'hall_id',
                as: 'hall',
            });
        }
    }

    Seat.init(
        {
            row: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            column: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            customer_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_booked: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },    // status for checking seat is booked or not
        },
        {
            sequelize,
            modelName: 'Seat',
            indexes: [
                {
                    // Composite index for row and column for fast lookups
                    name: 'seat_row_column_idx',
                    fields: ['row', 'column'],
                },
                {
                    // Index on hall_id to optimize queries by hall
                    name: 'seat_hall_idx',
                    fields: ['hall_id'],
                },
                {
                    // Unique composite index to ensure no duplicate seats per hall
                    name: 'unique_seat_per_hall',
                    unique: true,
                    fields: ['hall_id', 'row', 'column'],
                },
            ]
        }
    );

    return Seat;
};