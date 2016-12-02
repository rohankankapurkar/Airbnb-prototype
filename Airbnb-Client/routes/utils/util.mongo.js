var MongoClient = require('mongodb').MongoClient; 
var db;
var connected = false;

exports.connect = function(url, callback){    
	try{

		MongoClient.connect(url, function(err, _db){       
			if (err) { 
				throw new Error('Could not connect: '+err); 
			}      
			console.log("Connected to : "+url)
			db = _db;      
			connected = true;            
			callback(db);     
		});	
	}
	catch(error)
	{
		console.log("Unexpected Mongo Error Occurred : "+error);
	}
	 
};

exports.collection = function(name){    
	if (!connected) {      
		throw new Error('Must connect to Mongo before calling "collection"');    
	}   
	return db.collection(name);   
};


