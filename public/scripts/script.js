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

	$(function() {
		$(window).resize(setupBlocks);
	});

	//populate seed data from server
	$.get("/acts", function(data) {
		var acts = data;

		_.each(acts, function(act) {
			console.log(act);
			$("#acts").prepend(actsTemplate(act))
		});
		setupBlocks();
	});

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

	

	
	// $(function() {
	// 	$(window).load(setupBlocks);
	// });


});