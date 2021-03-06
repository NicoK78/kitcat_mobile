'use strict';

/**
 * @class root.controllers.Home
 * @description home page controller.
 * @param {Class} $scope
 * @param {Class} API
 * @param {Class} Auth
 * @param {Class} $rootScope
 * @param {Class} $window
 */
angular.module('kitcat').controller('Home', function (API, Auth, $scope, $rootScope, $window) {
	$('.loader').css({
		display: 'block'
	});

	$('main').hide();

	/**
	 * @function init
	 * @memberof root.controllers.Home
	 * @description all what controller need on load
	 * @private
	 *
	 * @returns {void}
	 */
	var init = function () 
	{
		$rootScope.errmsg = '';

		Auth.get(function(err, res){
			$scope.user = res;

			if (!err && res) {
				API.getCatsByOwner($scope.user._id, function(err, cats){
					$scope.cat = cats[0];
				});

				window.WebSocket = window.WebSocket || window.MozWebSocket;
				$scope.ws = new WebSocket('ws://'+$scope.user.raspIp+':'+$scope.user.raspPortCervo+'/ws');

				document.addEventListener("backbutton", onBackKeyDown, false);
			}

			if(!res) {
				Auth.remove();
			}

			$('main').fadeIn();
			$('.loader').fadeOut();

		});
	};

    /**
	 * @function onBackKeyDown
	 * @memberof root.controllers.Home
	 * @description handler function for 'backbutton' event
	 * @private
	 *
	 * @returns {void}
	 */
    var onBackKeyDown = function () 
    {
    	saveStats(function(err){

    	});
    }

    /**
	 * @function saveStats
	 * @memberof root.controllers.Home
	 * @description save via the API cat stats
	 * @param {Function} callback
	 * @private
	 *
	 * @returns {Function} callback(errors)
	 */
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

    /**
	 * @function signin
	 * @memberof root.controllers.Home
	 * @description handler for the signin form
	 * @param {Object} user
	 * @public
	 *
	 * @returns {Boolean}
	 */
	$scope.signin = function (user)
	{

		if (!user || !user.username || !user.password || user.username === '' || user.password === '') {
			$rootScope.errmsg = 'Both fields are required';

			return false;
		}

		$('.loader').css({
			display: 'block'
		});

		$('main').hide();

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

	/**
	 * @function logout
	 * @memberof root.controllers.Home
	 * @description handler for the logout action
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.logout = function ()
	{
		$('.loader').css({
			display: 'block'
		});

		$('main').hide();

		saveStats(function(err){
			if (!err) {
				Auth.remove();
				$scope.user = null;
				$window.location.reload();
			}
		});
	};

	/**
	 * @function onTop
	 * @memberof root.controllers.Home
	 * @description handler for the 'tap' event on the top directional button
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onTop = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('top');
		console.log('top');
	};

	/**
	 * @function onBottom
	 * @memberof root.controllers.Home
	 * @description handler for the 'tap' event on the bottom directional button
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onBottom = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('bottom');
	};

	/**
	 * @function onLeft
	 * @memberof root.controllers.Home
	 * @description handler for the 'tap' event on the left directional button
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onLeft = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('left');
	};

	/**
	 * @function onRight
	 * @memberof root.controllers.Home
	 * @description handler for the 'tap' event on the right directional button
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onRight = function (event) {
		$scope.lastConnection = store.get('lastConnection') || null;
		if(!$scope.lastConnection) {
			var timestampNow = Date.now() /1000 |0;
			store.set('lastConnection', timestampNow);
		}
		$scope.eventType = event.type;
		$scope.ws.send('right');
	};

	/**
	 * @function onSwipeRight
	 * @memberof root.controllers.Home
	 * @description handler for the 'swipe' (from right) event
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onSwipeRight = function(event) {
		TweenMax.to($('#stats'), 0.5, {
			left: '0%',
			ease: Circ.easeOut
		});
	};

	/**
	 * @function onSwipeLeft
	 * @memberof root.controllers.Home
	 * @description handler for the 'swipe' (from left) event
	 * @public
	 *
	 * @returns {void}
	 */
	$scope.onSwipeLeft = function(event) {
		TweenMax.to($('#stats'), 0.5, {
			left: '-90%',
			ease: Circ.easeOut
		});
	};

	init();
});