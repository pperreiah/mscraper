var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  // Saves array of notes.
  notes: [{
    type: Schema.Types.ObjectId,
    ref: "Note"
  }]
});

// Create Article model with ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
