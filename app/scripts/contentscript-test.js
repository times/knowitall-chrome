'use strict';

console.log('\'Allo \'Allo! Content script');

// compile html template with handlebars
//$.get(chrome.extension.getURL('dialog.hb'), function(v){

	$(window).on('load', function() {
		var source = $('#popupTemplate').html();
		var template = Handlebars.compile(source);
		$('body').append('<canvas id=\'myChart\' width=\'100\' height=\'100\'></canvas>');

		// insert chart

		//Get the context of the canvas element we want to select
		var ctx = document.getElementById('myChart').getContext('2d');
		new Chart(ctx).Doughnut(chartData,options);

		
		// find topic strings in body copy
		// wrap strings in <attr> tag
		var htmls = $('p').html();

		for (var t = 0; t < data.topics.length; t++) {
		// for each topic
			for (var i = 0, j = 0; j < 1; i++) {
			// for each element in the DOM
				//if (htmls[i].text().match(data.topics[t])) {
					console.log(data.topics[t])
					htmls[i].replace(data.topics[t], '<abbr class=\''+data.topics[t].replace(/\s+/g, '')+'\'>'+data.topics[t]+'</abbr>');
					j++;
				//}
			}
		}

		// show chart on click

		$('abbr').on('click', function() {
			$('#popup').remove();
			$('#sidebar').animate({'opacity':0,'right':'-300px'}, function() {
				$('#sidebar').remove();
			})
			if ($('#popup').length == 0) {
				topic = $(this).text();
				var y = $(window).scrollTop()+100;
				
				// get the chart data
				var n = $.inArray($(this).text(), data.topics);
				var topicsPercentageRead = data.topicsRead[n];

				var topicChartData = [
					{
						value: topicsPercentageRead,
						color:'#2575B2'
					},
					{
						value : 100-topicsPercentageRead,
						color : '#E2EAE9'
					}
				];

				//feed the handlebars template the data about the page
				var html = template(data);
				// create the popup
				$('body').append(html);
				$('#popup .standfirst').each(function() {
					if($(this).text().length > 100) {
						$(this).text($(this).text().slice(0,59)+"...");
					}
				});

				//fade in the popup
				$('#popup').css('top', y).animate({'opacity':'1', 'right':'50px'}, function() {
					//insert the chart
					var ctx2 = document.getElementById('topicChart').getContext('2d');
					new Chart(ctx2).Doughnut(topicChartData,options);
					console.log(topicChartData);
				});
	
			}		
			
			$('.recommended').hover(function() {

				console.log('in');
				
				// get the chart data
				var n = $.inArray(topic, data.topics);
				var topicsPercentageRead = data.topicsRead[n];

				var hoverChartData = [
					{
						value: topicsPercentageRead,
						color:'#2575B2'
					},
					{
						value : data.topicsAddKnowledge[n],
						color : '#FF1C1D'
					},
					{
						value : 100-data.topicsAddKnowledge[n]-topicsPercentageRead,
						color : '#E2EAE9'
					}
				];
				var ctx2 = document.getElementById('topicChart').getContext('2d');
				new Chart(ctx2).Doughnut(hoverChartData, options2);

			}, function() {

				console.log('out');

				// reset the chart data
				var n = $.inArray(topic, data.topics);
				var topicsPercentageRead = data.topicsRead[n];

				var topicChartData = [
					{
						value: topicsPercentageRead,
						color:'#2575B2'
					},
					{
						value : 100-topicsPercentageRead,
						color : '#E2EAE9'
					}
				];
				var ctx2 = document.getElementById('topicChart').getContext('2d');
				new Chart(ctx2).Doughnut(topicChartData, options2);

			});
	
		});

		$('#sidebar').click(function() {
			console.log('clicked');
			if($(this).css('background-image').search('sidebar.png') > -1) {
				$(this).removeClass('sidebar1').addClass('sidebar2');
			} else {
				$(this).removeClass('sidebar2').addClass('sidebar1');
			}
		});

	});
	
	
	// get data about the page from storyline

	var data = {
		'storyline':'Politics',
		'recommended1':'Peace process fears as Adams arrested over 1972 murder',
		'recommended2':'Police probe Geldof’s heroin death',
		'standfirst1':'The arrest of Gerry Adams in connection with one of the most notorious murders of Northern Ireland’s Troubles today prompted renewed fears for the future of the peace process.',
		'standfirst2':'Police are to investigate the circumstances surrounding the death of Peaches Geldof who was discovered dead of a heroin overdose with no drugs paraphernalia at the scene.',
		'link1':'http://www.thetimes.co.uk/tto/news/uk/article4078027.ece',
		'link2':'http://www.thetimes.co.uk/tto/life/celebrity/article4078211.ece',
		'date1':'April 29 2014',
		'date2':'May 2 2014',
		'percentageRead':30,
		'topics': ['Monty Python\'s Flying Circus', 'The Holy Grail', 'Brian', 'Ann Maguire'],
		'topicsRead':[10, 50, 80, 40],
		'topicsAddKnowledge':[5, 20, 15, 10]
	};

	var chartData = [
		{
			value: data.percentageRead,
			color:'#2575B2'
		},
		{
			value : 100-data.percentageRead,
			color : '#E2EAE9'
		}
	];

	// put data into pie chart

		// Pie chart settings

	var options = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : false,

		//String - The colour of each segment stroke
		segmentStrokeColor : '#fff',

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 45,

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

	var options2 = {
		//Boolean - Whether we should show a stroke on each segment
		segmentShowStroke : false,

		//String - The colour of each segment stroke
		segmentStrokeColor : '#fff',

		//Number - The width of each segment stroke
		segmentStrokeWidth : 2,

		//The percentage of the chart that we cut out of the middle.
		percentageInnerCutout : 45,

		//Boolean - Whether we should animate the chart
		animation : true,

		//Number - Amount of animation steps
		animationSteps : 100,

		//String - Animation easing effect
		animationEasing : 'easeInOutQuint',

		//Boolean - Whether we animate the rotation of the Doughnut
		animateRotate : false,

		//Boolean - Whether we animate scaling the Doughnut from the centre
		animateScale : false,

		//Function - Will fire on animation completion.
		onAnimationComplete : null
	};

	var topic;

	function sidebar() {
		$('#popup').fadeOut(200, function() {
			$('#popup').remove();
			$('body').append('<div id="sidebar"></div>');
			$('#sidebar').animate({'opacity':'1', 'right':0});
		});
	}

	$('#sidebar').click(function() {
		console.log('clicked');
		if($(this).css('background-image').search('sidebar.png') > -1) {
			$(this).removeClass('sidebar1').addClass('sidebar2');
		} else {
			$(this).removeClass('sidebar2').addClass('sidebar1');
		}
	});
	
//});
