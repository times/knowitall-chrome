/*global $, handlebars, Doughnut, Chart*/
'use strict';

console.log('\'Allo \'Allo! Content script');

// compile html template with handlebars
$.get(chrome.extension.getURL('dialog.hb'), function(v){
	var template = Handlebars.compile(v);
	console.dir(template);
	$('body').append('<canvas id=\'myChart\' width=\'100\' height=\'100\'></canvas>');

	// get data about the page from storyline

	var data = {
		'recommended1':'Peace process fears as Adams arrested over 1972 murder',
		'recommended2':'Police probe Geldof’s heroin death',
		'recommended3':'Teacher’s family face suspect in court',
		'link1':'http://www.thetimes.co.uk/tto/news/uk/article4078027.ece',
		'link2':'http://www.thetimes.co.uk/tto/life/celebrity/article4078211.ece',
		'link3':'http://www.thetimes.co.uk/tto/news/uk/crime/article4078025.ece',
		'date1':'January 1 2014',
		'date2':'January 2 2014',
		'date3':'January 3 2014',
		'percentageRead':30,
		'topics': ['Monty Python\'s Flying Circus', 'The Holy Grail', 'Brian'],
		'topicsRead':[10, 50, 80]
	};

	var percentageRead = data.percentageRead;

	var chartData = [
		{
			value: percentageRead,
			color:'#F7464A'
		},
		{
			value : 100-percentageRead,
			color : '#E2EAE9'
		}
	];

	// put data into pie chart

		// Pie chart settings

	var options = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : true,

		//String - The colour of each segment stroke
		segmentStrokeColor : '#fff',

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 20,

		//Boolean - Whether we should animate the chart
		animation : true,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : 'easeOutBounce',

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : true,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//Function - Will fire on animation completion.
		onAnimationComplete : null
	};

	// insert chart

	//Get the context of the canvas element we want to select
	var ctx = document.getElementById('myChart').getContext('2d');
	new Chart(ctx).Doughnut(chartData,options);

	// get array of topic strings

	var topics = data.topics;

	// find topic strings in body copy
	// wrap strings in <attr> tag

	var htmls = $('*').html();

	for (var topic = 0; topic < topics.length; topic++) {
	// for each topic
		for (var i = 0, j = 0; j < 1; i++) {
		// for each element in the DOM
			if (htmls[i].match(topic)) {
				htmls[i].replace(topic, '<abbr class=\''+topic+'\'>'+topic+'</abbr>');
				j++;
			}
		}
	}

	// show chart on click

	$('abbr').on('click', function() {
		var x = $(this).offset().left;
		var y = $(this).offset().top;

		//feed the handlebars template the data about the page
		var html = template(data);
		// create the popup
		$(document).append(html);

		// get the chart data
		var n = $.inArray($(this).attr('class'), data.topics);
		var topicsPercentageRead = data.topicsRead[n];

		var topicChartData = [
			{
				value: topicsPercentageRead,
				color:'#F7464A'
			},
			{
				value : 100-topicsPercentageRead,
				color : '#E2EAE9'
			}
		];

		//insert the chart
		var ctx = document.getElementById('topicChart').getContext('2d');
		var myNewChart = new Chart(ctx).Doughnut(topicChartData,options);

		//fade in the popup
		$('#popup').onload(function() {
			$(this).offset({top:y, left: x+50}).animate('opacity',1);
		});
	});
});
