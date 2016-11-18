var MongoClient = require('mongodb').MongoClient; 
var db;
var connected = false;

var MongoUrl = "mongodb://localhost:27017/testAirbnb";

exports.connect = function(callback){    
	MongoClient.connect(MongoUrl, function(err, _db){       
		if (err) { 
			throw new Error('Could not connect: '+err); 
		}      
		console.log("Connected to : "+ MongoUrl);
		db = _db;      
		connected = true;            
		callback(db);     
	}); 
};

exports.collection = function(name){    
	if (!connected) {      
		throw new Error('Must connect to Mongo before calling "collection"');    
	}   
	return db.collection(name);   
};


