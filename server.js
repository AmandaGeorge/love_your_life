//SERVER-SIDE JAVASCRIPT

var express = require("express"),
	app = express(),
	_ = require("underscore"),
	cors = require("cors"),
	bodyParser = require("body-parser"),
	session = require("express-session"),
	mongoose = require("mongoose");

// mongoose.connect(config.MONGO_URI);
mongoose.connect(process.env.MONGOLAB_URI 
				|| process.env.MONGOHQ_URL 
				|| require("./config").MONGO_URI);

var Act = require("./models/act");
var User = require("./models/user");

app.use(express.static(__dirname + "/public"));

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

// set session options
app.use(session({
	secret: require("./config").SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

// middleware to manage sessions
app.use("/", function (req, res, next) {
	// save userId in session for current user
	req.login = function (user) {
		req.session.userId = user.id;
	};

	// find current user based on session.userId
	req.currentUser = function (callback) {
		User.findOne({_id: req.session.userId}, function (err, user) {
			req.user = user;
			callback(null, user);
		});
	};

	// destroy session.userId to log out user
	req.logout = function () {
		req.session.userId = null;
		req.user = null;
	};

	next();
});

// var acts = [
// 		{user: "tester1", content: "I was carrying tons of boxes and this guy ran ahead of me and held the door for me and then the elevator too.", votes: []},
// 		{user: "tester2", content: "Every week my elderly neighbor puts my trash can out on the curb the night before trash day, and then she brings in back after the trash gets picked up.", votes: []},
// 		{user: "tester3", content: "Two people I didn't know complimented my dress today.  Totally made my day.", votes: []},
// 		{user: "tester4", content: "I keep Subway gift cards in my car so I have something to give when people are begging at intersections.", votes: []},
// 		{user: "tester5", content: "I was in line at the local Harvey's supermarket and the elderly lady two people ahead of me had a dozen roses she had added to her shopping items. When the other items were totaled she asked about the price of the flowers. As the cashier waited on the bagboy to return with the price of the flowers she said she hadn't gotten roses since her husband passed. When she was told the price of the flowers she asked for them to be returned and said 'Maybe next time'. The guy ahead of me bought the roses and gave them to her.", votes: []},
// 		{user: "tester6", content: "Good morning! I was driving up to Tim Horton's today for a cup of coffee when I started to wonder, 'how can I make someones day a little brighter?' Then it came to my mind to pay for the persons order who was behind me in line. We never know what people are going through and it's so nice to surprise with a little 'random act of kindness'. I hope it made their day :) because I know blessing others made mine!", votes: []},
// ];

//ROUTES
//root route for home page
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/public/views/index.html")
});

//acts index
app.get("/acts", function(req, res) {
	Act.find().sort("_id").exec(function(err, acts) {
		// console.log(acts);
		res.json(acts);
	});
});

//create new act
app.post("/acts", function(req, res) {
	//grab data from form
	var newAct = new Act({
		content: req.body.content,
	});
	//find user currently logged in
	req.currentUser(function (err, user) {
		if (user !== null) {
			// save new act to db
			newAct.save(function(err, act) {
				console.log(req.session.userId);
				user.acts.push(act);
				user.save(function (err, user) {
					res.json("Saved!");
				});
			});
		} else {
			res.send("Please login!");
		};
	});
});

//create new user after user submits signup
app.post("/users", function(req, res) {
	//grab data from form
	var newUser = new User({
		username: req.body.username,
		password: req.body.password
	});
	// console.log(newUser);	

	// save new user to db
	User.createSecure(newUser.username, newUser.password, function (err, user) {
		req.login(user);
		res.send(user.username + " logged in.");
	});
});

//user submits login form
app.post("/login", function (req, res) {
	var userData = {
		username: req.body.username,
		password: req.body.password
	};

	User.authenticate(userData.username, userData.password, function (err, user) {
		if (err) {
			res.status(403).send(err);
			console.log(err);
		} else {
			//saves user id to session
			req.login(user);
			res.status(201).send(user);
			console.log(userData.username + " is logged in.");
		}
	});
});

app.get("/users/find/username/:username", function (req, res) {
	var targetUser = req.params.username;

	User.findOne({username: targetUser}, function (err, foundUser) {
		if(foundUser) {
			res.json(foundUser.username)
		} else {
			res.send("New user");
		}
	});
});

// show user view
app.get("/me", function (req, res) {
	//find user currently logged in
	req.currentUser(function (err, user) {
		console.log(req.currentUser);
		res.json(user);
	});
});

app.get("/logout", function (req, res) {
	console.log("logging out " + req.session.userId);
	req.logout();
	res.redirect("/");
});


app.listen(process.env.PORT || require("./config").PORT, function() {
	console.log("server started");
});