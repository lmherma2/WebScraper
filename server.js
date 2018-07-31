var express = require("express");
var method = require("method-override");
var body = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var cheerio = require("cheerio");
var request = require("request");

var exphbs = require("express-handlebars");


var Story = require("./publick/Story");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/bbaba";


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;


var app = express();
var port = process.env.PORT || 3000;

app.use(logger("dev"));
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.listen(port, function() {
	console.log("Listening on port " + port);
})


app.get("/scrape", function(req, res) {
	request("https://www.nytimes.com/section/world", function(error, response, html) {
	// Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
		var result = {};
		$("div.story-body").each(function(i, element) {
			var link = $(element).find("a").attr("href");
			var title = $(element).find("h2.headline").text()
			var summary = $(element).find("p.summary").text()
			result.link = link;
			result.title = title;
			result.summary = summary;
			var entry = new Story(result);
				entry.save(function (err, entry) {
					if (err) return console.error(err);
					console.log(entry.title);
				  });

			});
		});
		console.log("Scrape finished.");
		res.redirect("/");
	});
app.get("/", function(req, res) {
	Story.find({},  function(err, data) {
			res.render("index", {stories: data});
	});
});