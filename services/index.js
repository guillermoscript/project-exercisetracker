const { user, exercise } = require('../models/models')

async function getUsers(req, res) {

    const users = await user.find();

    if (!users) {
        return res.status(400).json({
            error: 'No users found'
        })
    }

    return res.json(users)
}

async function getUserLogs(req, res) {

    const { _id } = req.params;

    const userExist = await user.findOne({ _id })

    if (!userExist) {
        return res.status(400).json({
            error: 'User does not exist'
        })
    }

    const userLogs = await exercise.find({ user: _id })

    if (!userLogs) {
        return res.status(400).json({
            error: 'No logs found'
        })
    }

    return res.json({
        _id,
        username: userExist.username,
        count: userLogs.length,
        log: userLogs.map(log => {
            return {
                description: log.description,
                duration: log.duration,
                date: log.date
            }
        })
    })
}

async function createUser(req, res) {

    const { username } = req.body

    const userExist = await user.findOne({ username })

    if (userExist) {
        return res.status(400).json({
            error: 'User already exist'
        })
    }

    const newUser = await user.create({
        username
    })

    return res.status(201).json(newUser);
}

async function createExercise(req, res) {
    const { description, duration } = req.body;

    let { date } = req.body;

    const { _id } = req.params;

    if (!description || !duration) {
        return res.status(400).json({
            error: 'Description and duration are required'
        })
    }

    if (!date) {
        date = new Date()
    } else {
        date = new Date(date)
    }

    const userExist = await user.findOne({ _id })

    if (!userExist) {
        return res.status(400).json({
            error: 'User does not exist'
        })
    }

    const newExercise = await exercise.create({
        description,
        duration: Number(duration),
        date: date,
        user: _id
    })

    return res.status(201).json({
        _id,
        username: userExist.username,
        date: newExercise.date,
        duration: newExercise.duration,
        description: newExercise.description
    })
}

module.exports = {
    getUsers,
    getUserLogs,
    createUser,
    createExercise
}