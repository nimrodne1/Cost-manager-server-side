const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        first_name: {
            type: String,
            required: true
        },
        last_name: {
            type: String,
            required: true
        },
        birthday: {
            type: Date,
            default: Date.now
        },
        marital_status: {
            type: String,
            enum: ['Single', 'Married'],
            default: 'Single'
        }
    }
);

const User_model = mongoose.model('users', userSchema); //good to know that mongoose pluralizes the name 'User_model' to 'users' for the collection.
module.exports = User_model;
