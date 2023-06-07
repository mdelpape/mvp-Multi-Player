const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  user: String,
  id: String,
  className: String
})

const Players = mongoose.model('Players', playerSchema);

module.exports = Players;