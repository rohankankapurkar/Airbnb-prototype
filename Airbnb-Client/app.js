
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  
	

// favicon to display favicon icon in tab
  favicon = require('serve-favicon');

/**
 * passport dependencies
 */
passport = require('passport');
require('./routes/user/user.signin')(passport);
   
/**
 * Session dependencies
 */
session = require('express-session')

   
/**
 * Utilities dependencies should be added after this
 */
mongo = require("./routes/utils/util.mongo");


   
/**
 * All route dependencies
 */
var usersession = require('./routes/misc/misc.session'); //contains functions related to session management
var analytics = require("./routes/misc/misc.analytics"); //contains functions related to logging of client activities
var register = require("./routes/user/user.register");
var utilSession = require("./routes/misc/misc.session")
   
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var mongoStore = require("connect-mongo")(session);

var app = express();

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

//session properties
app.use(session({
	secret: 'airbnb_client_session',
	resave : false,
	saveUninitialized : false,
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({  
		url: mongoSessionConnectURL})
	})
);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/getusersession',usersession.getSession);
app.post('/analytics', analytics.logdata);
app.post('/user/register', register.signup);
app.post('/user/signin',function(req, res, next) 
		{
			passport.authenticate('signin', function(err, user) 
			{
				console.log("after auth")
				if(err)
				{		
					console.log("in error")
					res.send({"statuscode" : 1, "username":null});  
				} 
				if(user == false)
				{	
					console.log("in user error")
					res.send({"statuscode" : 1, "username":null});
				}
				else
				{
					console.log("authenticated")
					utilSession.setSession(req, user);
					var response = {
						statuscode : 0,
						user : user
					}
					res.send(response);
				}
			})(req, res, next);
		});


mongo.connect(mongoSessionConnectURL, function(){  
	console.log('Connected to mongo at: ' + mongoSessionConnectURL); 
	http.createServer(app).listen(app.get('port'), function(){  
		console.log('Express server listening on port ' + app.get('port'));  
	});  
});


