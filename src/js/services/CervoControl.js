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
 			
 			function ($http) {
 				window.WebSocket = window.WebSocket || window.MozWebSocket;

		    	var CervoControl = {

					ws: null,

					topham: null,

					leftham: null,

					rightham: null,

					bottomham: null,

					init: function ()
					{
						$(document).ready(function(){
							CervoControl.topham = Hammer(jQuery("#top"), {
								transform_always_block: true,
								tap_always: false,
								drag_min_distance: 0
							});

							CervoControl.leftham = Hammer($("#left"), {
								transform_always_block: true,
								tap_always: false,
								drag_min_distance: 0
							});

							CervoControl.rightham = Hammer($("#right"), {
								transform_always_block: true,
								tap_always: false,
								drag_min_distance: 0
							});

							CervoControl.bottomham = Hammer($("#bottom"), {
								transform_always_block: true,
								tap_always: false,
								drag_min_distance: 0
							});

							CervoControl.ws = new WebSocket('ws://192.168.12.131:3000/ws');
							CervoControl.bottomham.on("tap", function(event) {
								console.log("bottom");
								var value = $(this).attr('data-value');
								CervoControl.sendValue(value);
							});
							CervoControl.rightham.on("tap", function(event) {
								console.log("right");
								var value = $(this).attr('data-value');
								CervoControl.sendValue(value);
							});
							CervoControl.leftham.on("tap", function(event) {
								console.log("left");
								var value = $(this).attr('data-value');
								CervoControl.sendValue(value);
							});
							CervoControl.topham.on("tap", function(event) {
								console.log("top");
								var value = $(this).attr('data-value');
								CervoControl.sendValue(value);
							});
						});
						

					},

					sendValue: function(value){
						CervoControl.ws.send(value);
					}

		    	};

				return CervoControl;
			}
		);