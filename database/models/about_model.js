const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema({
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

});

module.exports = mongoose.model('Developer', developerSchema);