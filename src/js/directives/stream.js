'use strict';

/**
  * @class root.directives.stream
  * @description Directive. Set up streamn with piCam
  */
 angular
 	.module('kitcat')
 		.directive('stream', function ($scope){
		    return {
		    	restrict: 'A',
		    	scope: true,
		    	link: function (scope, element, attr) 
		    	{
					element.on('ready', function(event) {

						// Show loading notice
						var canvas = element;
						var ctx = canvas.getContext('2d');
						ctx.fillStyle = '#444';
						ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

				 		// Setup the WebSocket connection and start the player
						var client = new WebSocket('ws://'+scope.user.raspIp+':'+scope.user.raspPortCam+'/');
						var player = new jsmpeg(client, {canvas:canvas});

					});