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
				controller : 'controllerHome',
			})
		.state('home.becomeHost',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHost.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.becomeHostStep1',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostRoom.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.becomeHostStep2',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostImages.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.becomeHostDesc',
 			{
 				url:'becomeHost',
 				templateUrl : './templates/view.becomeHostDescription.html',
 				controller : 'controllerBecomeHost'
 			})
		.state('home.becomeHostStep3',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostPrice.html',
				controller : 'controllerBecomeHost'
			})
		.state('home.profile',
			{
				url:'profile',
				templateUrl : './templates/view.profile.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.profileUpdate',
			{
				url:'/update_profile',
				templateUrl : './templates/view.update_profile.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.listing',
			{
				url:'update_profile',
				templateUrl : './templates/view.listing.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.trips',
			{
				url:'update_profile',
				templateUrl : './templates/view.trips.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.dashboard',
			{
				url:'update_profile',
				templateUrl : './templates/view.dashboard.html',
				controller : 'controllerProfile'
			})
		.state('home.admin',
			{
				url:'admin',
				templateUrl : './templates/view.admin.html'
				//controller : 'controllerAdmin'
			})
})


