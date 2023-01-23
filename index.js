const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { getUserLogs, getUsers, createExercise, createUser } = require('./services/index')
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(express.urlencoded({ extended: true }))

const uri = process.env.MONGO_URL

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.get('/api/users', getUsers)
app.get('/api/users/:_id/logs', getUserLogs)

app.post('/api/users', createUser)
app.post('/api/users/:_id/exercises', createExercise)