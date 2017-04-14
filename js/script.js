$(function(){
	
	var step = 0;
	var total_steps = $('section.step').length;
	
	// Intro
	TweenMax.from(".main_wrapper", 1, {opacity: 0.5, width:0});
	TweenMax.staggerFrom( $('header > *'), 1, {opacity:0, y:30, delay:1}, 0.2);

	function getPosition(elm_offset)
	{
		con_offset = $('#gifts').offset();
		pos = (elm_offset.left - con_offset.left) * -1;
		return pos;
	}

	function goToStep(step)
	{
		var step_section = $('section.step[data-step="' + step + '"]');
		var step_id = step_section.attr('id');
		updateNav(step);

		var tl = new TimelineLite();
		tl.to($('section.step'), 0.2, {opacity:0, display:'none', overwrite:'all'})
		TweenMax.killAll(true);

		switch (step_id){
			case 'introduction':
				tl.to($('.gifts_wrapper'), 0.2, {opacity:0, display:'none', overwrite:'all'});
				break;

			case 'gift_selection':
				// If coming back from summary
				if( $('.gifts_wrapper').hasClass('summary') ){
					elm_offset = $('#gifts li.selected').offset();
					pos = getPosition(elm_offset);
					tl.to($('.gifts_wrapper li.selected'), 0, {x:-pos});
				}

				tl.to($('.gifts_wrapper li'), 0, {opacity:1, visability:'inherit'} )
				break;

			case 'summary':
				elm_offset = $('#gifts li.selected').offset();
				pos = getPosition(elm_offset);
				$('.gifts_wrapper').addClass('summary');
				tl.to($('.summary li').not('.selected'), 0.2, {opacity:0, visability:'hidden'} )
				tl.to($('li.selected'), 0.5, {x:pos});
				break;
		}

		tl.to(step_section, 0.2, {opacity:1, display:'inherit'});

		tl.from(step_section.find('h2.title'), 0.5, {opacity:0, x:10});
		tl.from(step_section.find('p.desc'), 0.5, {opacity:0, x:-10});

		switch (step_id){
			case 'gift_selection':
				$('#gifts li.selected').length == 0 ? $('#next').prop("disabled", true) : $('#next').prop("disabled", false);
				tl.to($('.gifts_wrapper'), 0, {opacity:1, display:'inherit'});
				tl.staggerFrom($('ul#gifts figure'), 0.3, {x:-30, y:30, opacity:0}, 0.2);
				break;

			case 'summary':
				break;
		}
	}	


	function updateNav(step)
	{
		$('nav a').removeClass('active');
		$('nav a[data-step="' + step + '"]').addClass('active');
		$('#prev, #next').prop( "disabled", false );
		step <= 1 ? $('#prev').prop( "disabled", true ) : "";
		step == total_steps ? $('#next').prop( "disabled", true ) : "";
		$('.pages span').html('שלב ' + step + ' מתוך ' + total_steps);
	}

	// Start Button
	$(document).on('click', '#start', function()
	{
		step = 1;
		updateNav(step);

		var tl = new TimelineLite({onComplete:goToStep,onCompleteParams: [step]})
			.to($('#start'), 0.1, {scale:0, opacity:0,})
			.to($('header > *'), 0.5, {opacity:0})
			.to($('header'), 0, {className: '+=top'})
			.to($('header > *'), 1, {opacity:1, y: 5},1)
			.to($('footer'), 1, {opacity:1, y: -5, display: 'inherit'},1);
	});
	
	// Previous Button
	$(document).on('click', '#prev', function()
	{
		step--;
		goToStep(step);
	});
	
	// Next Button
	$(document).on('click', '#next', function()
	{
		step++;
		goToStep(step);
	});

	// Gift selection
	$(document).on('click', '#gifts > li', function()
	{
		$('#next').prop( "disabled", false );
		$('#gifts > li').removeClass('selected');
		$(this).toggleClass('selected');
		TweenLite.to($('#gifts figure'), 0.5, {css:{borderColor:"transparent"}});
		TweenLite.to($('#gifts > li.selected figure'), 0.2, {css:{borderColor:"rgb(70,130,180)"}});
	});

	
});
	