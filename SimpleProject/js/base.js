$(function() {
	$('.tabs li').click(function() {
		var index = $(this).index();
		var $_this = $(this);
		$_this.addClass('active').siblings().removeClass('active');
		$('.tab_context').eq(index).addClass('tab_context_active').siblings().removeClass('tab_context_active');
	});
	$('.item').click(function() {
		var html = $(this).html();
		$('#mainContext').append(html);
	});


});