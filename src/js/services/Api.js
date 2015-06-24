'use strict';

/**
 * @class root.services.API
 * @description kitcat API REST client service
 * 
 * @param $http
 */
 angular
 	.module('kitcat')
 		.service('API', 
 		
 			function ($http) {

		        var API = {

		        	baseUrl: 'http://localhost:3000',

		        	/**
		        	 * @function get
		        	 * @memberof root.services.API
		        	 * @description Sends GET method to the given url
		        	 * @param {String} url
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
		        	get: function (url, callback)
		        	{
		        		$http.get(API.baseUrl+url).
						  success(function(data, status, headers, config) {
						    
						    return callback(null, data);
						  }).
						  error(function(data, status, headers, config) {

						    console.log('an error occured when trying to send a get method on API. Status code: '+status);
						    return callback(status, null);
						  });
		        	},

		        	/**
		        	 * @function post
		        	 * @memberof root.services.API
		        	 * @description Sends POST method to the given url
		        	 * @param {String} url
		        	 * @param {JSON} params
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
		        	post: function (url, params, callback)
		        	{
		        		var params = params || {};

		        		$http.post(API.baseUrl+url, params).
								success(function(data, status, headers, config) {
							
								return callback(null, data);
							  }).
							  error(function(data, status, headers, config) {
							    console.log('an error occured when trying to send a post request on API. Status code: '+status);

							    return callback(status, null);
							  });
		        	},

		        	/**
		        	 * @function put
		        	 * @memberof root.services.API
		        	 * @description Sends PUT method to the given url
		        	 * @param {String} url
		        	 * @param {JSON} params
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
		        	put: function (url, params, callback)
		        	{
		        		var params = params || {};

		        		$http.put(API.baseUrl+url, params).
								success(function(data, status, headers, config) {
							
								return callback(null, data);
							  }).
							  error(function(data, status, headers, config) {
							    console.log('an error occured when trying to send a put request on API. Status code: '+status);

							    return callback(status, null);
							  });
		        	},

		        	/**
		        	 * @function delete
		        	 * @memberof root.services.API
		        	 * @description Sends DELETE method to the given url
		        	 * @param {String} url
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
		        	delete: function(url, callback)
		        	{
		        		$http.delete(API.baseUrl+url).
						  success(function(data, status, headers, config) {
						    
						    return callback(null, data);
						  }).
						  error(function(data, status, headers, config) {

						    console.log('an error occured when trying to send a delete request on API. Status code: '+status);
						    return callback(status, null);
						  });
		        	},

		        	/**
		        	 * @function signin
		        	 * @memberof root.services.API
		        	 * @description Sends POST method to signin a user
		        	 * @param {String} username
		        	 * @param {String} password
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					signin: function (username, password, callback)
					{

						if (username && password) {

							API.post('/login', {username: username, password: password}, function(err, res){
								if (err) {

								    if (err == '404') {

								    	return callback('Invalid username or/and password', null);
								    }

							    	return callback('Server error', null);

								}

								return callback(null, res);
							});

						} else {

							return callback('username or/and password are empty', null);
						}
					},

					/**
		        	 * @function signup
		        	 * @memberof root.services.API
		        	 * @description Sends POST method to singup a user
		        	 * @param {String} username
		        	 * @param {String} password
		        	 * @param {String} name
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					signup: function (username, password, name, callback)
					{

						API.post('/user/add', {username: username, password: password, name: name, role: 'USER'}, function(err, res){
							if (err)
							{

								console.log('an error occured when trying to login on API. Status code: '+status);
							    if (status == '404') {

							    	return callback('Invalid username or/and password', null);
							    }

							    	return callback('Server error', null);

							}

							return callback(null, res);
						});

					},

					/**
		        	 * @function getUserById
		        	 * @memberof root.services.API
		        	 * @description Sends GET method to get a user by his id
		        	 * @param {String} user's id from cookie
		        	 * @param {function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					getUserById: function (id, callback)
					{
						API.get('/user/'+id, function(err, res){
							if (err) {
								console.log('an error occured when trying to login on API. Status code: '+status);
						    	return callback('Server error', null);
							}

						    return callback(null, res);
						});
					},

					/**
		        	 * @function getCatsByOwner
		        	 * @memberof root.services.API
		        	 * @description Get cats for the given user id
		        	 * @param {String} userId
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					getCatsByOwner: function (userId, callback)
					{
						API.get('/cat/getByOwner/'+userId, function(err, res){
							if (err) {

								return callback(err, null);
							}

							return callback(null, res);
						});
					},

					updateUser: function (user, callback)
					{
						API.put('/user/'+user._id, user, function(err, res){
							if (err) {

								return callback(err, null);
							}

							return callback(null, res);
						});
					},

					/**
		        	 * @function addCat
		        	 * @memberof root.services.API
		        	 * @description Add a cat for the given user id
		        	 * @param {String} userId
		        	 * @param {JSON} params (ex: {"name": "cat name"})
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					addCat: function (userId, params, callback)
					{
						API.post('/cat/'+userId, params, function(err, res){
							if (err) {

								return callback(err, null);
							}

							return callback(null, res);
						});
					},

					/**
		        	 * @function deleteCat
		        	 * @memberof root.services.API
		        	 * @description Sends Get method to delete a cat for the given id
		        	 * @param {String} catId
		        	 * @param {Function} callback
		        	 * @public
		        	 *
		        	 * @returns {Function} Callback(err, res)
		        	 */
					deleteCat: function (catId, callback)
					{
						API.delete('/cat/'+catId, function(err, res){
							if (err) {

								return callback(err, null);
							}

							return callback(null, res);
						});
					}

				};

				return API;
			}
		);