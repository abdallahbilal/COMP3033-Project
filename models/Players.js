const mongoose = require('mongoose');

const dataSchemaObject = new mongoose.Schema({
  PlayerName: { type: String, required: true },
  TeamName: { type: String, required: true },
  Nationality: { type: String },
Age: { type: Number, required: true },
  Position: { type: String, required: true },
});

let mongooseSchema = new mongoose.Schema(dataSchemaObject);
module.exports = mongoose.model('Player', mongooseSchema);