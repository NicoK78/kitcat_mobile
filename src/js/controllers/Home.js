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

				document.addEventListener("backbutton", onBackKeyDown, false);
			}

			if(!res) {
				Auth.remove();
			}
		});
	};

    // Handle the back button
    //
    var onBackKeyDown = function () 
    {
    	saveStats(function(err){

    	});
    }

    var saveStats = function (callback)
    {
    	if($scope.lastConnection) {
    		var timestampNow = Date.now() /1000 |0;

    		if($scope.cats[0].timespent > 0) {
    			$scope.cats[0].timespent += ($scope.lastConnection - timestampNow);
    		} else {
    			$scope.cats[0].timespent = ($scope.lastConnection - timestampNow);
    		}
    		var date = new Date($scope.lastConnection*1000);
    		var day = date.toString();

    		if (!$scope.cats[0].daysPlayed[day]) {
    			$scope.cats[0].daysPlayed[day].timespent = ($scope.lastConnection - timestampNow);
    			$scope.cats[0].daysPlayed[day].nbPlayed = 1;
    		} else {
    			$scope.cats[0].daysPlayed[day].timespent += ($scope.lastConnection - timestampNow);
    			$scope.cats[0].daysPlayed[day].nbPlayed += 1;
    		}
    		
    		API.updateCat($scope.cats[0], function(err, res){
    			store.remove('lastConnection');

    			return callback(err);
    		});
    	}
    };


	$scope.signin = function (user)
	{

		if (!user || !user.username || !user.password || user.username === '' || user.password === '') {
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
		saveStats(function(err){
			if (!err) {
				Auth.remove();
				$scope.user = null;
				$window.location.assign('/'); 
			}
		});
	};

	$scope.onTop = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('top');
	};

	$scope.onBottom = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('bottom');
	};

	$scope.onLeft = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('left');
	};

	$scope.onRight = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('right');
	};

	init();
});