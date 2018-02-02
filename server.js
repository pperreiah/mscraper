var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var PORT = process.env.PORT || 3100;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
var routes = require("./controllers/miamiheraldscraper_controller.js");

app.use("/", routes);

//Added to heroku mongolab
// mongoose.connect("mongodb://heroku_<address>.mlab.com:25262/heroku_<address>");
mongoose.connect("mongodb://plp4consult@gmail.com:Pizzas10!@ds121898.mlab.com:21898/heroku_mv48lg7t")
// mongoose.connect("mongodb://localhost/miamiheralddb");

// mongoose.connect("mongodb://heroku_gnzk5747:4d2121nhgnfbdl1pfirsdepk9n@ds125262.mlab.com:25262/heroku_gnzk5747");



var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Listen on port 3100
app.listen(PORT, function() {
  console.log("App running on PORT " + PORT);
});
