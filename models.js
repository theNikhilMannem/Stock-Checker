
const mongoose = require('mongoose')

mongoose.connect(process.env.DB, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

const { Schema } = mongoose

const stockDataSchema = new Schema({
  stock: { type: String, required: true },
  price: { type: Number, required: true },
  likes: { type: Number, default: 0 }
})

const ipSchema = new Schema({
  ipAddress: { type: String, required: true }
})

const StockData = mongoose.model('StockData', stockDataSchema)
const IP = mongoose.model('IP', ipSchema)

exports.StockData = StockData
exports.IP = IP
