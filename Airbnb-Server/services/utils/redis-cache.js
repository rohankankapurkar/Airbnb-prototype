var redis = require('redis');
var client = redis.createClient(6379, 'localhost');


var RedisCache = function () {};

RedisCache.cachedSqlQueries	= ["SELECT * FROM AVAILABLE_DATES"];

client.on("error", function (err) 	{
    console.log("Error connecting REDIS Cache Server " + err);
});


RedisCache.getCachedSqlQueries = function() {
	return RedisCache.cachedSqlQueries;
};


/**
 * Caching Categories and SubCategories into REDIS database
 */
RedisCache.cacheDates = function(categories) {
	console.log(categories);
	console.log("Caching Categories & Subcategories");
	client.set("SELECT * FROM AVAILABLE_DATES", categories);
};


/**
 * Getting Categories and SubCategories from REDIS database
 */
RedisCache.getCachedCategories = function(callback) {
	console.log("Getting Caching Categories");
	RedisCache.getCachedDetails("SELECT * FROM AVAILABLE_DATES", callback);
};


/**
 * To fetch cached details mapped by provided key
 */
RedisCache.getCachedDetails = function(key, params, callback) {
	console.log("Fetching cached details for --> " + key);
	client.get(key, function (err, reply){
		console.log("===================================");
		console.log(reply);
		var counter= 0;
		var output = [];
		reply = JSON.parse(reply);
		for(counter = 0; counter < reply.length; counter++){
			if(reply[counter]["prop_id"] == params["prop_id"]){
				output.push(reply[counter]);
			}
		}
		console.log("This is output from redis cache");
		console.log(output);
		callback(output);
	});
};

module.exports = RedisCache;