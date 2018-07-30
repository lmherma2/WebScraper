var express = require("express");
var method = require("method-override");
var body = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");

var Story = require("./Story");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/webScraper";


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;


var app = express();
var port = process.env.PORT || 3000;

// app set-ups

app.use(logger("dev"));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(port, function() {
	console.log("Listening on port " + port);
})


app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/world", function(error, response, html) {
		var $ = cheerio.load(html);
		var result = {};
		$("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text()
			var summary = $(element).find("p.summary").text()
			result.link = link;
			result.title = title;
			result.summary = summary;
			var entry = new Story(result);
			Story.find({title: result.title}, function(err, data) {
				if (data.length === 0) {
					entry.save(function(err, data) {
						if (err) throw err;
					});
				}
			});
		});
		console.log("Scrape finished.");
		res.redirect("/");
	});
});

app.get("/", function(req, res) {
	Story.find({},  function(err, data) {
			res.render("index", {stories: data});
	});
});