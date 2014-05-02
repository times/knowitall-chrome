/*global $, handlebars, Doughnut, Chart*/
'use strict';

console.log('\'Allo \'Allo! Content script');

(function($){
	var uri = location.href.replace(/bbc\.com/, 'bbc.co.uk');

	$.get('http://knowitall.herokuapp.com/' + encodeURIComponent(uri), function(knowitall){
		console.dir(knowitall);
		var topic_list = [];
		if (knowitall.topics["@set"]) {
			knowitall.topics["@set"].forEach(function(v){
				topic_list.push(v.preferredLabel);
			});
		}
		console.dir(topic_list);
		// compile html template with handlebars
		$.get(chrome.extension.getURL('dialog.hb'), function(v){
			var template = Handlebars.compile(v);
			$('body').append('<canvas id="myChart" width="100" height="100"></canvas>');

			// get data about the page from storyline

			var data = {
				"recommended1":"Peace process fears as Adams arrested over 1972 murder",
				"recommended2":"Police probe Geldof’s heroin death",
				"recommended3":"Teacher’s family face suspect in court",
				"link1":"http://www.thetimes.co.uk/tto/news/uk/article4078027.ece",
				"link2":"http://www.thetimes.co.uk/tto/life/celebrity/article4078211.ece",
				"link3":"http://www.thetimes.co.uk/tto/news/uk/crime/article4078025.ece",
				"date1":"January 1 2014",
				"date2":"January 2 2014",
				"date3":"January 3 2014",
				"percentageRead":30,
				"topics": ["Monty Python's Flying Circus", "The Holy Grail", "Brian"],
				"topicsRead":[10, 50, 80]
			};

			var percentageRead = data.percentageRead

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

		// insert chart

			//Get the context of the canvas element we want to select
			var ctx = document.getElementById("myChart").getContext("2d");
			new Chart(ctx).Doughnut(chartData,options);

			// put data into pie chart

				// Pie chart settings

				var options = {
					//Boolean - Whether we should show a stroke on each segment
					segmentShowStroke : true,

					//String - The colour of each segment stroke
					segmentStrokeColor : "#fff",

					//Number - The width of each segment stroke
					segmentStrokeWidth : 2,

					//The percentage of the chart that we cut out of the middle.
					percentageInnerCutout : 20,

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

			// find topic strings in body copy
			// wrap strings in <attr> tag
			topic_list.forEach(function(topic){
				$('.story-body > p').each(function(){
					if ($(this).text().match(topic)) {
						$(this).html($(this).html().replace(topic, "<abbr style='border-bottom: 1px dotted blue;' class='knowitall' title='Launch KnowItAll'>"+topic+"</abbr>"));
						return false;
					}
				});
			});

			$('abbr').on('click', function() {
				if ($('#popup').length == 0) {
					var x = $(this).offset().left;
					var y = $(this).offset().top;

					//feed the handlebars template the data about the page
					var html = template(data);
					// create the popup
					$('body').append(html);
					$('#popup .standfirst').each(function() {
						if($(this).text().length > 100) {
							$(this).text($(this).text().slice(0,60)+"...");
						}
					});


					//fade in the popup
					$('#popup').animate({'opacity':'1', 'right':'50px'});

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
					var ctx2 = document.getElementById('topicChart').getContext('2d');
					var myNewChart2 = new Chart(ctx2).Doughnut(topicChartData,options);

				}

			});
		});
	});
})(jQuery);
