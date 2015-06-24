$(document).ready(function() {

	window.WebSocket = window.WebSocket || window.MozWebSocket;
	var ws = new WebSocket('ws://192.168.12.131:3000/ws');


	var topham = Hammer($("#top"), {
		transform_always_block: true,
		tap_always: false,
		drag_min_distance: 0
	});
	topham.on("tap", function(event) {
		console.log("top");
		var value = $(this).attr('data-value');
		sendValue(value);
	});


	var leftham = Hammer($("#left"), {
		transform_always_block: true,
		tap_always: false,
		drag_min_distance: 0
	});
	leftham.on("tap", function(event) {
		console.log("left");
		var value = $(this).attr('data-value');
		sendValue(value);
	});


	var rightham = Hammer($("#right"), {
		transform_always_block: true,
		tap_always: false,
		drag_min_distance: 0
	});
	rightham.on("tap", function(event) {
		console.log("right");
		var value = $(this).attr('data-value');
		sendValue(value);
	});


	var bottomham = Hammer($("#bottom"), {
		transform_always_block: true,
		tap_always: false,
		drag_min_distance: 0
	});
	bottomham.on("tap", function(event) {
		console.log("bottom");
		var value = $(this).attr('data-value');
		sendValue(value);
	});



	function sendValue(value){
		ws.send(value);
	}
});