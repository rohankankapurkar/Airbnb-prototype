//super simple rpc server example
var amqp = require('amqp')
, util = require('util')
,process = require('process');


// set the mode here like connection pooling, sql caching and many more.
// process.env.MODE = "NONE";
process.env.MODE = "CONNECTION_POOL";


var signin = require('./services/signin');
var signup = require('./services/signup');
var hostService = require('./services/hosts/hosts.service');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){

	console.log("Started Server");
	
	// Signin qeue to make user sigin into the system
	cnn.queue('signin_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signin.signinUser(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Signup queue for enabing the user to register
	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signup.signupUser(message, function(err,res){
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});


	// Service to check if the user is host or not
	cnn.queue('checkIsHost_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			hostService.checkIsHost(message, function(err,res){
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

