'use strict';

/**
 * @class root.controllers.Home
 * @description home page controller.
 * @param {Class} $scope
 */
angular.module('kitcat').controller('Home', function (API, Auth, $scope, $rootScope, $location) {
	var init = function () 
	{
		$rootScope.errmsg = '';

		Auth.get(function(err, res){
			$scope.user = res;

			if ($scope.user) {
				API.getCatsByOwner($scope.user._id, function(err, cats){
					$scope.cats = cats;
				});

				window.WebSocket = window.WebSocket || window.MozWebSocket;
				$scope.ws = new WebSocket('ws://192.168.12.131:3000/ws');
			}
		});
	};

	$scope.signin = function (user)
	{

		if (!user.username || !user.password || user.username === '' || user.password === '') {
			$rootScope.errmsg = 'Both fields are required';

			return false;
		}

		API.signin(user.username, user.password, function(err, res){

			if (!err) {
				Auth.update(res);
				$location.path('/');
			} else {
				$scope.errmsg = err;

				return false;
			}
		});
	};

	$scope.logout = function ()
	{
		Auth.remove();
		$scope.user = null;
		$location.path('/'); 
	};

	$scope.onTop = function (event) {
		$scope.eventType = event.type;
		$scope.ws.send('top');
	};

	$scope.onBottom = function (event) {
		$scope.eventType = event.type;
		$scope.ws.send('bottom');
	};

	$scope.onLeft = function (event) {
		$scope.eventType = event.type;
		$scope.ws.send('left');
	};

	$scope.onRight = function (event) {
		$scope.eventType = event.type;
		$scope.ws.send('right');
	};

	init();
});