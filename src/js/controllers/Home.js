'use strict';

/**
 * @class root.controllers.Home
 * @description home page controller.
 * @param {Class} $scope
 */
angular.module('kitcat').controller('Home', function (API, Auth, $scope, $rootScope, $window) {
	var init = function () 
	{
		$rootScope.errmsg = '';

		Auth.get(function(err, res){
			$scope.user = res;

			if (!err && res) {
				API.getCatsByOwner($scope.user._id, function(err, cats){
					$scope.cats = cats;
				});

				window.WebSocket = window.WebSocket || window.MozWebSocket;
				$scope.ws = new WebSocket('ws://192.168.12.131:3000/ws');

				$scope.lastConnection = store.get('lastConnection') || null;
				if(!$scope.lastConnection) {
					var timestampNow = Date.now() /1000 |0;
					store.set('lastConnection', timestampNow);
				}
			}
		});
	};

	// device APIs are available
    //
    var onDeviceReady = function () {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
    }

    // Handle the back button
    //
    var onBackKeyDown = function () {
    	if($scope.lastConnection) {
    		var timestampNow = Date.now() /1000 |0;

    		if($scope.user.timespent > 0) {
    			$scope.user.timespent += ($scope.lastConnection - timestampNow);
    		} else {
    			$scope.user.timespent = ($scope.lastConnection - timestampNow);
    		}
    		
    		API.updateUser($scope.user, function(er, res){});
    	}
    	store.remove('lastConnection');
    }


	$scope.signin = function (user)
	{
		if (!user.username || !user.password || user.username === '' || user.password === '') {
			$rootScope.errmsg = 'Both fields are required';

			return false;
		}

		API.signin(user.username, user.password, function(err, res){

			if (!err) {
				Auth.update(res);
				$window.location.assign('/');
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
		$window.location.assign('/'); 
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