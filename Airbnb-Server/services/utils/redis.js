var redis = require('redis');
var client = redis.createClient(6379,"127.0.0.1");

var RedisCache = function () {
}

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.get("string key", function(err,reply){
    console.log("Value " + reply);
});


client.hset("hash key", "hashtest 1", "some value1", redis.print);
client.hset("hash key", "hashtest 2", "some value2", redis.print);
client.hset("hash key", "hashtest 3", "some value3", redis.print);

client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});

module.exports = RedisCache;