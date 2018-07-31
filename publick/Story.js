var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Storyschema = new Schema({
	title: {
		type: String,
	},
	link: {
		type: String,
	},
	summary: {
		type: String,
	},
});

Storyschema.index({title: "text"});

var Story  = mongoose.model("Story", Storyschema);
module.exports = Story;