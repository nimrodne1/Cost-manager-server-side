const mongoose = require('mongoose');

const costSchema = new mongoose.Schema(
    {
        userid: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: ['food', 'health', 'housing', 'sport', 'education']
        },
        sum: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now   // if the date not provided use the current date
        }
    }
);





const Cost_model = mongoose.model('costs', costSchema);
module.exports = Cost_model;