var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Storyschema = new Schema({
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
	summary: {
		type: String,
		default: "Summary unavailable."
	},
});

Storyschema.index({title: "text"});

var Story  = mongoose.model("Story", Storyschema);
module.exports = Story;