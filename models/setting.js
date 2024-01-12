require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Setting = mongoose.model('Setting', {
    carName: String,
    regNum: String,
    handoverDate: String,
    kmAtBeginning: Number,
    benefactor: String,
    beneficiary: String,
    benefitPerKm: Number,
    fixedAdd: Number,
    carBenefitDefault: Number,
    fixPerKWh: Number,
    latestKmNum: Number,
    latestKWhNum: Number
})
    
module.exports = Setting