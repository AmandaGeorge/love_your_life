var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	salt = bcrypt.genSaltSync(10);

var ActSchema = require("./act");

var Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	username	: String,
	password	: String,
	acts		: [ActSchema],
	votes		: [{

				}]
});

// create a new user with a secure password
UserSchema.statics.createSecure = function(username, password, callback) {
	var that = this;

	bcrypt.genSalt(function (err, salt) {
		bcrypt.hash(password, salt, function (err, hash) {
			console.log(hash);

			that.create({
				username: username,
				password: hash
			}, callback);
		});
	});
};

// authenticate user on login
UserSchema.statics.authenticate = function (username, password, callback) {
	// find user by username entered at login
	this.findOne({username: username}, function (err, user) {
		console.log(user);

		//throw error if username not found
		if (user === null) {
			throw new Error("Cannot find user with username " + username);

		//if found, check password
		} else if (user.checkPassword(password)) {
			callback(null, user);
		}
	});
};

UserSchema.methods.checkPassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};




var User = mongoose.model('User', UserSchema);

module.exports = User;
