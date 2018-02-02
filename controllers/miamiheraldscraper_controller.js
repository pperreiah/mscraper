var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

mongoose.Promise = Promise;

var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
  res.render("index");
});

// Render savedarticles page
router.get("/savedarticles", function(req, res) {

  // Get docs from Articles array
  Article.find({}, function(error, doc) {

    if (error) {
      console.log(error);
    }
    // Send docs to browser as a json object
    else {
      var hbsArticleObject = {
        articles: doc
      };

      res.render("savedarticles", hbsArticleObject);
    }
  });
});

// GET request scrapes MiamiHerald.com
router.post("/scrape", function(req, res) {

  request("http://www.miamiherald.com/", function(error, response, html) {
    // Load into cheerio and save it to $
    var $ = cheerio.load(html);

    // Make emptry array for temporarily saving and showing scraped Articles.
    var scrapedArticles = [];
    // Get every h4 within an article tag
    $("article h4").each(function(i, element) {

      var result = {};
      // Add title and href of every link as properties of the result
      result.title = $(this).children("a").text();    
      result.link = $(this).children("a").attr("href");

      scrapedArticles[i] = result;
    });

    var hbsArticleObject = {
        articles: scrapedArticles
    };

    res.render("index", hbsArticleObject);

  });
});

router.post("/save", function(req, res) {

  var newArticleObject = {};
  newArticleObject.title = req.body.title;
  newArticleObject.link = req.body.link;

  var entry = new Article(newArticleObject);

  // Save entry to db
  entry.save(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    // Or log the doc
    else {
      console.log(doc);
    }
  });

  res.redirect("/savedarticles");

});

router.get("/delete/:id", function(req, res) {

  Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {
    if (err) {
      console.log("Delete error:" + err);
    } else {
      console.log("Deleted");
    }
    res.redirect("/savedarticles");
  });
});

router.get("/notes/:id", function(req, res) {

  Note.findOneAndRemove({"_id": req.params.id}, function (err, doc) {
    if (err) {
      console.log("Delete error:" + err);
    } else {
      console.log("Deleted");
    }
    res.send(doc);
  });
});

// Get an article by ObjectId
router.get("/articles/:id", function(req, res) {

  Article.findOne({"_id": req.params.id})

  .populate('notes')

  .exec(function(err, doc) {
    if (err) {
      console.log("Could not find article and notes.");
    }
    else {
      console.log("Getting article and any notes." + doc);
      res.json(doc);
    }
  });
});

// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {

  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);
  // Save the new note to db
  newNote.save(function(error, doc) {
    // Log errors
    if (error) {
      console.log(error);
    } 
    else {
      // Use article id to find and then push note
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {notes: doc._id}}, {new: true, upsert: true})

      .populate('notes')

      .exec(function (err, doc) {
        if (err) {
          console.log("Cannot find article.");
        } else {
          console.log("Getting and saving notes. " + doc.notes);
          res.send(doc);
        }
      });
    }
  });
});
// Export routes for server.js to use.
module.exports = router;