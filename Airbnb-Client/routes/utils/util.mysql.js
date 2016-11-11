/**
 * http://usejsdoc.org/
 */
var mysql = require('mysql');

var connectionQueue = [];
var MAX_CONN = 500;
var requestQueue = [];
var CONNECTION_POOLING = false;

for(var i = 0; i < MAX_CONN; i++)
{
	var q = {
			id : i, 
			connection : mysql.createConnection({  
								host     : 'localhost',
								user     : 'root', //your root user. Change if any other user.
								password : 'root', //your password for the above user.
								database : 'airbnb', //db name.
								port  : 3306 })
			}
	connectionQueue.push(q);
}


var getPoolConnection = function(callback){
	if(connectionQueue.length > 0)
	{
		var connection = connectionQueue.pop();
		
		callback(connection, null);
	}
	else if(connectionQueue.length <= 0){
		
		requestQueue.push(callback);
	}
}

setInterval(function(){
	if(requestQueue.length > 0)
	{
		if(connectionQueue.length > 0)
		{
			var connection = connectionQueue.pop();
			var callback = requestQueue.shift();
			
			callback(connection, null);
		}
	}
},10);

function releasePoolConnection(connection)
{
	
	connectionQueue.push(connection);
}

var getConnection = function(){
	var connection = mysql.createConnection({  
		host     : 'localhost',
		user     : 'root', 
		password : 'root', 
		database : 'ebay',
		port  : 3306 
	});
	
	return connection;
};

function executeQuery(callback,sqlQuery)
{  
	if(!CONNECTION_POOLING)
	{
		/*console.log("\nSQL Query::"+sqlQuery);  
		
		var connection=getConnection();  
		
		connection.query(sqlQuery, function(err, rows, fields) {
			if(err)
			{   
				console.log("ERROR: " + err.message);  
			} 
			else 
			{ 
				// return err or result 
				console.log("DB Results:"+rows);
				callback(err, rows); 
			}
		});
		
		console.log("\nConnection closed..");
		connection.end();*/
		/////////////////////////////////////////////////var getPoolConnection	
		
		//console.log("\nSQL Query::"+sqlQuery); 
	}
	else
	{
		getPoolConnection(function (PoolConnection, err){
			PoolConnection.connection.query(sqlQuery, function(err, rows, fields) {
				if(err)
				{   
					console.log("ERROR: " + err.message);  
				} 
				else 
				{ 
					callback(err, rows); 	
					
					setTimeout(function (){
						releasePoolConnection(PoolConnection);
					},2000);
				}
			});//getPoolConnection
			
		});//PoolConnection.connection.query
	}


};


exports.executeQuery = executeQuery;


