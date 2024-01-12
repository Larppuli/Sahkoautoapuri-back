require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Loading = mongoose.model('Loading', {
    date: String,
    hour: Number,
    minute: Number,
    price: Number,
    kWh: Number,
    meterNum: Number,
    sntkWh: [{ hour: String, kWhPrice: Number, price: Number, kWh: Number }],
    fixedPrice: Number,
    totalFixedPrice: Number,
    totalKWh: Number,
    transportPrice: Number,
    totalElectricityPrice: Number,
    totalPrice: Number,
})
    
module.exports = Loading