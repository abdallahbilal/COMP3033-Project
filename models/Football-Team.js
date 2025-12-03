const mongoose = require('mongoose');

const dataSchemaObject = new mongoose.Schema({
  TeamName: { type: String, required: true },
  City: { type: String },
  Players: { type: [String], required: true },
  Coach: { type: String, required: true },
  League: { type: String },
  Position: { type: Number, required: true },
});

let mongooseSchema = new mongoose.Schema(dataSchemaObject);
module.exports = mongoose.model('FootballTeam', mongooseSchema);