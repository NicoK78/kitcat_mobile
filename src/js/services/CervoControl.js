'use strict';

/**
 * @class root.services.Auth
 * @description kitcat Auth REST client
 * 
 * @param $http
 */
 angular
 	.module('kitcat')
 		.service('CervoControl', 
 			
 			function ($http, $cookies, API) {
 				window.WebSocket = window.WebSocket || window.MozWebSocket;

		    	var CervoControl = {

					ws: null,

					topham: Hammer($("#top"), {
						transform_always_block: true,
						tap_always: false,
						drag_min_distance: 0
					}),

					leftham: Hammer($("#left"), {
						transform_always_block: true,
						tap_always: false,
						drag_min_distance: 0
					}),

					rightham: Hammer($("#right"), {
						transform_always_block: true,
						tap_always: false,
						drag_min_distance: 0
					}),

					bottomham: Hammer($("#bottom"), {
						transform_always_block: true,
						tap_always: false,
						drag_min_distance: 0
					}),

					init: function ()
					{
						CervoControl.ws = new WebSocket('ws://192.168.12.131:3000/ws');
						bottomham.on("tap", function(event) {
							console.log("bottom");
							var value = $(this).attr('data-value');
							CervoControl.sendValue(value);
						});
						rightham.on("tap", function(event) {
							console.log("right");
							var value = $(this).attr('data-value');
							CervoControl.sendValue(value);
						});
						leftham.on("tap", function(event) {
							console.log("left");
							var value = $(this).attr('data-value');
							CervoControl.sendValue(value);
						});
						topham.on("tap", function(event) {
							console.log("top");
							var value = $(this).attr('data-value');
							CervoControl.sendValue(value);
						});

					},

					sendValue: function(value){
						CervoControl.ws.send(value);
					}

		    	};

				return CervoControl;
			}
		);