//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var login = require('./services/login');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	
	//Register Queue

	cnn.queue('register_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			console.log(message);
			console.log('-----');
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			register.registerUser(message, function(err,res){
				console.log('in publishing');
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


});





