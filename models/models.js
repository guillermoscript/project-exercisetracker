const mongoose = require('mongoose')
const { types } = require('util')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
});

const exerciseSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        validate: (value) => {
            return types.isDate(value)
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const user = mongoose.model('User', userSchema);
const exercise = mongoose.model('Exercise',exerciseSchema);


module.exports = {
    user,
    exercise
}