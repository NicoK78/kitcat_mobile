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
					console.log(cats);
					$scope.cats = cats;
				});

				// TRYHARD
				API.getUserById($scope.user._id, function(err, id){
					$scope.userName = 'Bonjour '+id.username+' !';
				});
				// FINDUTRYHARD

				window.WebSocket = window.WebSocket || window.MozWebSocket;
				$scope.ws = new WebSocket('ws://'+$scope.user.raspIp+':'+$scope.user.raspPortCervo+'/ws');

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
    	store.remove('lastConnection');

    	if($scope.lastConnection) {
    		var timestampNow = (Date.now() / 1000 | 0);

    		if($scope.cats[0].timespent > 0) {
    			$scope.cats[0].timespent += (timestampNow - $scope.lastConnection);
    		} else {
    			$scope.cats[0].timespent = (timestampNow - $scope.lastConnection);
    		}
    		var day = new Date($scope.lastConnection*1000).toLocaleDateString();

    		$scope.cats[0].daysPlayed = JSON.parse($scope.cats[0].daysPlayed);

    		if(typeof $scope.cats[0].daysPlayed !== 'object') {
    			$scope.cats[0].daysPlayed = {};
    		}

    		if (!$scope.cats[0].daysPlayed[day]) {
    			$scope.cats[0].daysPlayed[day] = {};
    			$scope.cats[0].daysPlayed[day]['timespent'] = (timestampNow - $scope.lastConnection);
    			$scope.cats[0].daysPlayed[day]['nbPlayed'] = 1;
    		} else {
    			$scope.cats[0].daysPlayed[day]['timespent'] += (timestampNow - $scope.lastConnection);
    			$scope.cats[0].daysPlayed[day]['nbPlayed'] += 1;
    		}

    		$scope.cats[0].daysPlayed = JSON.stringify($scope.cats[0].daysPlayed);

    		API.updateCat($scope.cats[0], function(err, res){

    			return callback(err);
    		});
    	}

    	return callback(null);	
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
				$window.location.reload();
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
				$window.location.reload();
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

	$scope.onSwipeRight = function(event) {
		// $('#stats').animate({
  //   		width: 'toggle'
  //   	}, {
  //   		queue: false,
  //   		duration: 500
  //   	})
		TweenMax.to($('#stats'), 0.5, {
			left: '0%',
			ease: Circ.easeOut
		});
	};

	$scope.onSwipeLeft = function(event) {
		// $('#stats').animate({
  //   		width: 'toggle'
  //   	}, {
  //   		queue: false,
  //   		duration: 500
  //   	})
		TweenMax.to($('#stats'), 0.5, {
			left: '-90%',
			ease: Circ.easeOut
		});
	};

	init();
});