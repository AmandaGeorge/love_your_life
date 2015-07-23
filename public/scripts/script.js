//CLIENT-SIDE JAVASCRIPT

$(document).ready(function() {
	console.log("you gotta give love to get love");

	var colCount = 0;
	var colWidth = 0;
	var margin = 20;
	var windowWidth = 0;
	var blocks = [];

	actsTemplate = _.template($("#acts-template").html());

	//dummy data
	// var acts = [
	// 	{user: "tester1", content: "I was carrying tons of boxes and this guy ran ahead of me and held the door for me and then the elevator too.", votes: []},
	// 	{user: "tester2", content: "Every week my elderly neighbor puts my trash can out on the curb the night before trash day, and then she brings in back after the trash gets picked up.", votes: []},
	// 	{user: "tester3", content: "Two people I didn't know complimented my dress today.  Totally made my day.", votes: []},
	// 	{user: "tester4", content: "I keep Subway gift cards in my car so I have something to give when people are begging at intersections.", votes: []},
	// 	{user: "tester5", content: "I was in line at the local Harvey's supermarket and the elderly lady two people ahead of me had a dozen roses she had added to her shopping items. When the other items were totaled she asked about the price of the flowers. As the cashier waited on the bagboy to return with the price of the flowers she said she hadn't gotten roses since her husband passed. When she was told the price of the flowers she asked for them to be returned and said 'Maybe next time'. The guy ahead of me bought the roses and gave them to her.", votes: []},
	// 	{user: "tester6", content: "Good morning! I was driving up to Tim Horton's today for a cup of coffee when I started to wonder, 'how can I make someones day a little brighter?' Then it came to my mind to pay for the persons order who was behind me in line. We never know what people are going through and it's so nice to surprise with a little 'random act of kindness'. I hope it made their day :) because I know blessing others made mine!", votes: []},
	// ];

	//prepend dummy data to #acts
	// _.each(acts, function(act, index) {
	// 	var $act = $(actsTemplate(act));
	// 	$("#acts").prepend($act);
	// });

	// var baseUrl = "http://localhost:3000" // DEV
	var baseUrl = "https://loveyourlife.herokuapp.com" // PRD

	$(function() {
		$(window).resize(setupBlocks);
	});

	//populate acts from server
	$.get("/acts", function(data) {
		var acts = data;

		_.each(acts, function(act) {
			$("#acts").prepend(actsTemplate(act))
		});
		setupBlocks();
	});

	//setup acts view based on window size
	function setupBlocks() {
		windowWidth = $(window).width();
		colWidth = $(".block").outerWidth();
		blocks = [];
		colCount = Math.floor(windowWidth/(colWidth+margin));
		for(var i=0; i < colCount; i++) {
			blocks.push(margin);
		}
		positionBlocks();
	};
	
	//determine positioning of each act and apply css
	function positionBlocks() {
		$(".block").each(function() {
			var min = Array.min(blocks);
			var index = $.inArray(min, blocks);
			var leftPos = margin+(index*(colWidth+margin));
			$(this).css({
				"left":leftPos+"px",
				"top":min+"px"
			});
			blocks[index] = min+$(this).outerHeight()+margin;
		});
	};

	// Function to get min value in Array
	Array.min = function(array) {
		return Math.min.apply(Math, array);
	};

	// autofocus on the first field in each form
	$('#new-act-modal').on('shown.bs.modal', function() {
                $('#content-text').focus();
            });

	$('#signup-modal').on('shown.bs.modal', function() {
                $('#new-user').focus();
            });

	$('#login-modal').on('shown.bs.modal', function() {
                $('#user').focus();
            });

	$.get("/me", function(data) {
		if (data == null) {
			// NOT LOGGED IN
			console.log("NOT LOGGED IN")
			$("#login-btn").css("display", "inline");
			$("#signup-btn").css("display", "inline");
        	$("#logout-btn").css("display", "none");
		} else {
			// SUCCESS
			console.log(data.username + " is logged in.")
			$("#login-btn").css("display", "none");
			$("#signup-btn").css("display", "none");
        	$("#logout-btn").css("display", "inline");
        	//loop through user's votes array and change vote icon color if present in array

		}
	});

	// event listener for submitting the signup form
	$("#signup-form").submit(function(event) {
		event.preventDefault();
		console.log('creating new user');
		var user = {
			username: $("#new-user").val(),
			password: $("#new-pw").val()
		};
		if (user.password.length >= 5 && user.username.length >= 3) {
			//send request to server to create new user
			$.post("/users", user, function(data) {
				console.log("user added to database");
			});

			$('#signup-modal').modal('hide');

			//reset the form
	        $(this)[0].reset();
		} else {
			alert("Password must be at least 5 characters long.")
		}		
	});

	// add listener to check for unique username on signup
	$("#new-user").on("focusout", function(event) {
		var that = $(this).val();
		$.get("/users/find/username/" + that, function (data) {
			if (data === that ) {
				// console.log(this);
				alert("Username already exists.  Please choose a new username.");
				$("#new-user").val("").focus();
			} else {
				console.log("Username available");
			}
		});
	});

	// event listener for submitting the login form
	$("#login-form").submit(function(event) {
		event.preventDefault();
		console.log("logging in user");
		var user = {
			username: $("#user").val(),
			password: $("#password").val()
		};
		//send request to server to log in the current user
		$.post("/login", user, function(data) {
			// SUCCESS
			console.log(data.username + " logged in.");
			$('#login-modal').modal('hide');
        	//reset the form
        	$("#login-form")[0].reset();

        	location.reload();
		}).fail(function(data) {
			// ERROR
			alert("Incorrect username or password.");
			$("#login-form")[0].reset();
			$("#user").focus();
			console.log("err!")
		});
	});

	// event listener for submitting the new act form
	$("#new-act-form").submit(function(event) {
		event.preventDefault();
		console.log('submitting a new act');
		var act = {
			content: $("#content-text").val()
		};
		$.post("/acts", act, function(data) {
			if (data === "Please login!") {
				// NOT LOGGED IN
				alert("Please login to post.");
			} else {
				// SUCCESS
				$("#acts").prepend(actsTemplate(act));
				setupBlocks();
				console.log(data);

				$('#new-act-modal').modal('hide');
				$("#new-act-form")[0].reset();
			}
		});
	});

	//event listener for logout
	$("#logout-btn").on("click", function(event) {
		event.preventDefault();

		$.get("/logout", function(data) {
			console.log("logging out user");
		});
		location.reload();
	});
	
});