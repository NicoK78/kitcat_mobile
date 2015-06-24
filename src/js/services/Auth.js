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
 			
 			function ($http, API) {

		    	var Auth = {

		    		cookie: store.get('user-kitcat') || {},

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

		    			store.remove('user-kitcat');

		    		},

		    		update: function (cookie)
		    		{
		    			var c = cookie || {};

		    			store.set('user-kitcat', c);
		    		}

		    	};

				return Auth;
			}
		);