const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  
  name: String,
  from: String,
  to: String,
  date: String,
  departureTime: String,
  company: String,       
  fare:Number,
  seats:[String]
});

module.exports = mongoose.model('tickets', ticketSchema);