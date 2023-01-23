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
    const { from, to, limit } = req.query;

    const userExist = await user.findOne({ _id })

    if (!userExist) {
        return res.status(400).json({
            error: 'User does not exist'
        })
    }

    if (from && to) {
        const userLogs = await exercise.find({ user: _id, date: { $gte: new Date(from), $lte: new Date(to) } }).limit(Number(limit))
        return res.json({
            _id,
            username: userExist.username,
            count: userLogs.length,
            log: userLogs.map(log => {
                return {
                    description: log.description,
                    duration: log.duration,
                    date: new Date(log.date).toLocaleDateString()
                }
            })
        })
    }

    if (from) {
        const userLogs = await exercise.find({ user: _id, date: { $gte: new Date(from) } }).limit(Number(limit))
        return res.json({
            _id,
            username: userExist.username,
            count: userLogs.length,
            log: userLogs.map(log => {
                return {
                    description: log.description,
                    duration: log.duration,
                    date: new Date(log.date).toLocaleDateString()
                }
            })
        })
    }

    if (to) {
        const userLogs = await exercise.find({ user: _id, date: { $lte: new Date(to) } }).limit(Number(limit))
        return res.json({
            _id,
            username: userExist.username,
            count: userLogs.length,
            log: userLogs.map(log => {
                return {
                    description: log.description,
                    duration: log.duration,
                    date: new Date(log.date).toLocaleDateString()
                }
            })
        })
    }

    if (limit) {
        const userLogs = await exercise.find({ user: _id }).limit(Number(limit))
        return res.json({
            _id,
            username: userExist.username,
            count: userLogs.length,
            log: userLogs.map(log => {
                return {
                    description: log.description,
                    duration: log.duration,
                    date: new Date(log.date).toLocaleDateString()
                }
            })
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
                date: new Date(log.date).toLocaleDateString()
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
        username: userExist.username,
        description: newExercise.description,
        duration: newExercise.duration,
        date: new Date(newExercise.date).toDateString(),
        _id,
    })
}

module.exports = {
    getUsers,
    getUserLogs,
    createUser,
    createExercise
}