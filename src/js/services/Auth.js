'use strict';

/**
 * @class root.services.Auth
 * @description kitcat Auth manager
 * 
 * @param $http
 */
 angular
 	.module('kitcat')
 		.service('Auth', 
 			
 			function ($http, API) {

		    	var Auth = {

		    		/**
		        	 * @var cookie
		        	 * @memberof root.services.Auth
		        	 * @description The user object stored in local storage
		        	 * @public
		        	 */
		    		cookie: store.get('user-kitcat') || {},

		    		/**
		        	 * @function get
		        	 * @memberof root.services.Auth
		        	 * @description Get the user from API for the user that stored in local storage
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
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

		    		/**
		        	 * @function remove
		        	 * @memberof root.services.Auth
		        	 * @description Remove the user from the local storage
		        	 * @public
		        	 *
		        	 * @returns {Void}
		        	 */
		    		remove: function ()
		    		{

		    			store.remove('user-kitcat');

		    		},

		    		/**
		        	 * @function update
		        	 * @memberof root.services.Auth
		        	 * @description Update the user from the local storage with the given user object
		        	 * @param {Object} user
		        	 * @public
		        	 *
		        	 * @returns {Void} 
		        	 */
		    		update: function (user)
		    		{
		    			var u = user || {};

		    			store.set('user-kitcat', u);
		    		}

		    	};

				return Auth;
			}
		);