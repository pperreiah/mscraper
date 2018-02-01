var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create Note schema
var NoteSchema = new Schema({
  body: {
    type: String
  }
});

// Create Note model with NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
