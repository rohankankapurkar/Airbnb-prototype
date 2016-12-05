
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
var register = require("./routes/user/user.register"); //contains function related to sign up of an user
var profile = require("./routes/user/user.profile"); //contains function related user profile
var bookproperty = require("./routes/user/user.bookproperty");
var host = require("./routes/host/host.property"); //contains all function related to adding and deleting of properties
var validator = require("./routes/misc/validator"); //contains all functions related to validation
var admin = require("./routes/admin/admin.approvals"); //contains all functions related to admin approvals
var adminSearch = require("./routes/admin/admin.search"); //contains all functions related to admin searching hosts
var property = require("./routes/properties/properties.getproperties"); //contains function related get city properties
var userGetTrips = require("./routes/user/user.getTrips"); //contains function related get city properties
var bidding = require("./routes/bidding/bidding.bidfunctions"); //has bidding functions



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

app.post('/properties', property.getproperties);

app.post('/getusersession',usersession.getSession);
/*app.post('/analytics', analytics.logdata);*/
app.post('/user/register', register.signup);
app.post('/user/signin',function(req, res, next)
		{
			passport.authenticate('signin', function(err, user)
			{
				console.log("after auth")
				if(err)
				{
					res.send({"statuscode" : 1, "username":null});
				}
				else if(user == false)
				{
					res.send({"statuscode" : 1, "username":null});
				}
				else
				{
					usersession.setSession(req, user.username);
					var response = {
						statuscode : 0,
						user : user
					}
					res.send(response);
				}
			})(req, res, next);
		});
app.post('/user/logout',usersession.sessionDestroy);
app.post('/user/update_profile',profile.update_profile);
app.get('/user/update_profile',profile.show_profile);
app.post('/user/bookproperty', bookproperty.bookproperty);
app.post('/host/addproperty',host.addproperty); //equivalent to /host/addadvertisement - in api doc
app.post('/host/getmyproperties', host.getmyproperties);  //To get all host's listed properties for viewing/editing
app.post('/host/getavailabledates', host.getavailabledates);
app.post('/host/getpropertyavailable', host.getpropertyavailable);
app.post('/host/validateaddress',validator.validateaddress);
app.post('/host/approveuserrequest', host.approveuserrequest);
app.post('/host/getpendingpropertyrequests', host.getpendingpropertyrequests);
app.post('/host/getuserpropdata', host.getuserpropdata);
app.post('/host/disapproverequest', host.disapproverequest);
app.post('/host/getPropertyHistory', host.propertyHistory);
app.post('/host/userReview', host.saveUserReview);
app.post('/host/getclicksperproperty', host.getclicksperproperty);
app.post('/host/updateThisListing', host.updateThisListing);

app.post('/host/getReviewCount', host.getreviewcount);
app.get('/host/getReviewForHost', host.getReviewForHost);
app.get('/host/getHostProperties', host.getHostPropertyNames);
app.post('/host/getBidsForProperty', host.getBidsForProperty);


app.post('/host/uploadVideo',profile.uploadVideo);

app.post('/admin/getareaseen', adminSearch.getareaseen);
app.post('/admin/getclicksperpage', adminSearch.getclickperpage);

app.get('/admin/getadminapprovals',admin.getadminapprovals);
app.post('/admin/approve',admin.approveHostRequest);
app.post('/admin/searchHosts',adminSearch.searchHosts);
app.post('/bid',bidding.placebid);
app.post('/trips/acceptbid', bidding.checkout);
app.post('/admin/top_properties', adminSearch.gettopprops);
app.post('/admin/top_hosts', adminSearch.gettophosts);
app.post('/admin/top_cities', adminSearch.gettopcities);

//analytics -- here
app.post('/analytics/clicks',analytics.logClickData);
app.post('/analytics/property/clicks',analytics.logPropertyClicks);
app.post('/analytics/pagetime',analytics.logPagetimes);
app.get('/analytics/getuserid',analytics.getUserIds);
app.post('/analytics/userjourney', analytics.getuserjourney);


//trips section
app.post('/getUserTrips', userGetTrips.getTrips);
app.post('/getPropertiesForUserTrips', userGetTrips.getPropertiesForUserTrips);
app.post('/getUserAndProperty', userGetTrips.getUserAndProperty);
app.post('/updateTrip', userGetTrips.updateTrip);
app.post('/deleteTrip', userGetTrips.deleteTrip);

//bidding
app.post('/getPropertiesForBidding', userGetTrips.getPropertiesForBidding);
app.post('/user/hostReview', userGetTrips.saveHostReview);

/*app.post('/trips/acceptBid', userGetTrips.getPropertiesForBidding);*/


app.post('/user/deleteUser', profile.deleteUser);

mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});
});

module.exports = app;
