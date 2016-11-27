var mysql = require('mysql');
//var sleep = require('sleep');
var noConn = 100;
var conn;
var connStack = [];
var connQueue = [];



var createMyPool = function(noConn){
	var conn;
	console.log("Creating connections");
	for(var counter = 0; counter < noConn; counter++){
		console.log("Creating connections");
		conn = mysql.createConnection({
			host : 'localhost',
			user : 'root',
			password : 'SonyVaio',
			database : 'test'
		});
	connStack.push(conn);
	}
}

var getConnection = function(callback){
	console.log("I came here in get connection")
	if(connStack.length > 0){
		console.log("Length of stack in get connection method : "+ connStack.length)
		connection = connStack.pop();
		//sleep.sleep(10);
		console.log("Length of stack in get connection method 1: "+ connStack.length)
		callback(null, connection);
	}
	else{
		console.log('--------------------------------------------');
		console.log("Length of queue in get connection method 3: "+ connQueue.length)
		connQueue.push(callback);
		console.log("Length of queue in get connection method 4: "+ connQueue.length)
	}
};



setInterval(function(){
	console.log('Checking')
	if(connStack.length > 0){
		if(connQueue.length > 0){
			console.log('removing from the queue');
			callback = connQueue.shift();
			connection = connStack.pop();
			callback(null, connection);
		}
	}
}, 50000)



createMyPool(noConn)


exports.executeQuery = function(userQuery, params, callback) {
	console.log("Called me");
	getConnection(function(err, connection) {
		connection.query(userQuery, params, function(err, result) {
			console.log("Am I here");
			if (err) {
				console.log("Error occurred while executing the query");
				throw (err);
			}
			if (result) {
				console.log("Length of stack in code : "+ connStack.length)
				//sleep.sleep(2);
				connection.releaseConnection;
				connStack.push(connection);
				console.log("Length of stack in code : "+ connStack.length)
				//connection.release()
				callback(result);
			}
		});
	});
}

