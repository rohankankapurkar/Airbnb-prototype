/**
 * http://usejsdoc.org/
 */

var airbnbApp = angular.module('airbnbApp',['ui.router']);
//handles client side routing
airbnbApp.config(function($stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.
		otherwise('/');
	
	$stateProvider
		.state('home',
			{
				url:'/',
				templateUrl : './templates/view.homepage.html',
				controller : 'controllerHome'
			})
		.state('home.becomeHost',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHost.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.becomeHostRoom',
			{
				url:'becomeHost/room',
				templateUrl : './templates/view.becomeHostRoom.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.profile',
			{
				url:'profile',
				templateUrl : './templates/view.profile.html',
				controller : 'controllerProfile'
			})
})


