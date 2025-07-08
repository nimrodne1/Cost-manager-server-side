const Cost = require('../../database/models/cost_model');
const User = require('../../database/models/user_model');



async function addCost(req, res) {
    let { userid, year, month, day, description, category, sum } = req.body;
    if (!year && !month && !day) {
        const time = new Date();
        year = time.getFullYear();
        month = time.getMonth() + 1;
        day = time.getDate();
    }
    else if (!year || !month || !day) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    const isExisting = await User.findOne({ id: userid });
    if (!isExisting) {
        return res.status(404).json({ message: 'User not found' });
    }
    try {
        const newEntry = new Cost({
            userid: userid,
            year: year,
            month: month,
            day: day,
            description: description,
            sum: sum,
            category: category
        })
        await newEntry.save();
        res.status(201).json({ message: 'New cost entry added', data: newEntry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getReport(req, res) {
    try {
        const { id, year, month } = req.query;

        if (!year || !month || !id) {
            return res.status(400).json({ message: 'Missing required query parameters' });
        }

        if (parseInt(month) < 1 || parseInt(month) > 12) {
            return res.status(400).json({ message: 'Invalid month value' });
        }

        const userExists = await User.findOne({ id: parseInt(id) });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const results = await Cost.find({
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month)
        });

        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No cost data found" });
        }

        const categories = ['food', 'health', 'housing', 'sport', 'education'];

        const costsArray = categories.map(category => {
            const filtered = results
                .filter(r => r.category === category)
                .map(r => ({
                    sum: r.sum,
                    description: r.description,
                    day: r.day
                }));
            return { [category]: filtered };
        });

        const finalReport = {
            userid: parseInt(id),
            year: parseInt(year),
            month: parseInt(month),
            costs: costsArray
        };

        res.status(200).json(finalReport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}




module.exports = {addCost,getReport};