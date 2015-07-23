var request = require("request"),
	expect = require("chai").expect

// testing main page
describe("/", function() {
	it("should have a HTTP of 200 - success", function(done) {
		request("https://loveyourlife.herokuapp.com/", function (err, res, body) {
			expect(res.statusCode).to.equal(200)
			// expect(res.statusCode).to.equal(300)
			done();
			console.log(err, res);
		});
	});
});

// testing acts route
describe("/acts", function() {
	it("should have acts content", function(done) {
		request("https://loveyourlife.herokuapp.com/acts", function (err, res, body) {
			expect(res.body).include('"content":')
			// expect(res.body).include("029837023640527360")
			done();
			console.log(err, res);
		});
	});
});

// testing me route with no one logged in
describe("/me", function() {
	it("should have null user", function(done) {
		request("https://loveyourlife.herokuapp.com/me", function (err, res, body) {
			expect(res.body).include("null")
			// expect(res.body).include("amelia")
			done();
			console.log(err, res);
		});
	});
});

// testing users post route
describe("/users", function() {
	it("should log in a new user", function(done) {
		request.post("https://loveyourlife.herokuapp.com/users", {form:{username:"testuser50", password:"testtest"}}, function (err, res, body) {
			expect(res.body).include("logged in")
			// expect(res.body).include("Frack!")
			done();
			console.log(err, res);
		});
	});
});
