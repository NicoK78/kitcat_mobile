'use strict';

/**
 * @class root.services.Auth
 * @description kitcat Auth REST client
 * 
 * @param $http
 */
 angular
 	.module('kitcat')
 		.service('Auth', 
 			
 			function ($http, $cookies, API) {

		    	var Auth = {

		    		cookie: $cookies.getObject('user-kitcat-motherfucker-app') || {},

		    		get: function (callback)
		    		{

		    			if (Auth.cookie.id) {
							API.getUserById(Auth.cookie.id, function(err, res){
								if (!err) {
									return callback(null, res);
								}

								return callback(err, null);
							});
						} else {
							
							return callback('no cookie found', null);
						}

		    		},

		    		remove: function ()
		    		{

		    			$cookies.remove('user-kitcat-motherfucker-app');

		    		},

		    		update: function (cookie)
		    		{
		    			var c = cookie || {};

		    			$cookies.putObject('user-kitcat-motherfucker-app', c);
		    		}

		    	};

				return Auth;
			}
		);