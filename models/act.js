mongoose = require('mongoose');

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ActSchema = new Schema({
	user	: String,
	content	: String,
	votes	: [],
});

var Act = mongoose.model('Act', ActSchema);

module.exports = Act;