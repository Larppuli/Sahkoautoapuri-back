require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Driving = mongoose.model('Driving', {
    date: String,
    kilometerNum: Number,
    kilometers: Number,
    isPrivateDriving: String,
    lastKilometer: Number,
    startingTime: String,
    endingTime: String,
    route: String,
    startingPlace: String,
    endingPlace: String,
    driver: String,
    reason: String,
})
    
module.exports = Driving