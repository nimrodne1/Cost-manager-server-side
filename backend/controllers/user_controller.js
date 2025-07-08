const User = require('../../database/models/user_model');
const Cost = require('../../database/models/cost_model');

async function getUserDetails(req, res) {
    try {
        const userId = Number(req.params.id);  // parseInt טוב, Number גם
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userCosts = await Cost.find({ userid: userId });
        const total = userCosts.reduce((sum, item) => sum + item.sum, 0);

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



async function createNewUser(req, res)
{
    try
    {
        const newUser = new User(req.body);
        await newUser.save().then(user => {
            return res.status(201).json(user);
        });
    }
    catch(error)
    {
        return res.status(400).json({error: error});
    }
}

module.exports = {createNewUser, getUserDetails};

