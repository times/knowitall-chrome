'use strict';

// compile html template with handlebars
var source = $("#popupTemplate").html();
var template = Handlebars.compile(source);

$('body').append('<canvas id="myChart" width="100" height="100"></canvas>')

// get data about the page from storyline

var data = {"this":10,"that":"example"}

var percentageRead = 30

var chartData = [
	{
		value: percentageRead,
		color:"#F7464A"
	},
	{
		value : 100-percentageRead,
		color : "#E2EAE9"
	}
]

// put data into pie chart

	// Pie chart settings

	Doughnut.defaults = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,
		
		//String - The colour of each segment stroke
		segmentStrokeColor : "#fff",
		
		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,
		
		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 50,
		
		//Boolean - Whether we should animate the chart	
		animation : true,
		
		//Number - Amount of animation steps
		animationSteps : 100,
		
		//String - Animation easing effect
		animationEasing : "easeOutBounce",
		
		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,
		
		//Function - Will fire on animation completion.
		onAnimationComplete : null
	}

	//Get the context of the canvas element we want to select
	var ctx = document.getElementById("myChart").getContext("2d");
	var myNewChart = new Chart(ctx).Doughnut(chartData,options);

// get array of topic strings

var topics = ["Monty Python's Flying Circus", "The Holy Grail", "Brian"]

// find topic strings in body copy
// wrap strings in <attr> tag

var htmls = $('*').html()

for (topic = 0; topic < topics.length; topic++) {
// for each topic
	for (i = 0; i < html.length; i++) {
	// for each element in the DOM
		htmls[i].replace(topic, "<attr class='"+topic+"'>"+topic+"</attr>")
	}
}

// show chart on click

$('attr').on('click', function() {
	x = $(this).offset().left;
	y = $(this).offset().top;

	//feed the handlebars template the data about the page
	var html = template(data);
	// create the popup
	$(document).append(html);
});


