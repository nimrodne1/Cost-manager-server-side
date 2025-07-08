const Developer = require('../../database/models/about_model');

async function getDevelopers(req, res) {
    try {
        const developers = await Developer.find({}, 'first_name last_name -_id');
        res.status(200).json(developers);
    } catch (error) {
        console.error('Error fetching developers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = { getDevelopers };