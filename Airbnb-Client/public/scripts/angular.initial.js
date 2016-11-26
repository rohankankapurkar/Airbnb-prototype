/**
 * http://usejsdoc.org/
 */

var airbnbApp = angular.module('airbnbApp',['ui.router','uiSlider','ngMaterial', 'ngMessages', 'material.svgAssetsCache']);
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
				controller : 'controllerBecomeHost',
				params : {
					firstStep : null,
					secondstep : null,
					laststep : false,
				}
			})
		.state('home.becomeHostStep1',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostRoom.html',
				controller : 'controllerBecomeHostStep1'
			})
		.state('home.becomeHostBeds',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostBeds.html',
				controller : 'controllerBecomeHostBeds',
				params : {step1det : null}
			})

		.state('home.becomeHostLocation',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostLocation.html',
				controller : 'controllerBecomeHostLocation',
				params : {
					step2det : null
				}
			})
		.state('home.becomeHostStep2',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostImages.html',
				controller : 'controllerBecomeHostStep2',
				params : {
					firstStep : null
				}
			})
		.state('home.becomeHostDesc',
 			{
 				url:'becomeHost',
 				templateUrl : './templates/view.becomeHostDescription.html',
 				controller : 'controllerBecomeHostDesc',
 				params : {
 					imagestep : null
 				}
 			})
		.state('home.becomeHostStep3',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostPrice.html',
				controller : 'controllerBecomeHostStep3',
				params :{
					secondstep : null
				}
			})
		.state('home.becomeHostDates',
			{
				url:'becomeHost',
				templateUrl : './templates/view.becomeHostCalender.html',
				controller : 'controllerBecomeHostDates',
				params :{
					pricestep : null
				}
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
				url:'/update_listing',
				templateUrl : './templates/view.listing.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.trips',
			{
				url:'/trips',
				templateUrl : './templates/view.trips.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.dashboard',
			{
				url:'/dashboard',
				templateUrl : './templates/view.dashboard.html',
				controller : 'controllerProfile'
			})
				/*
		|-----------------------------------------------------------
		| Admin States
		|-----------------------------------------------------------
		*/			
		.state('home.admin',
			{
				url:'admin',
				templateUrl : './templates/view.admin.html',
				controller : 'controllerAdmin'
			})
		.state('home.pendingApprovals',
			{
				url:'admin/hostapprovals',
				templateUrl : './templates/view.admin.approvals.html',
				controller : 'controllerAdminApproval',
			})
		/*
		|-----------------------------------------------------------
		| Get properties
		|-----------------------------------------------------------
		*/
		.state('home.properties',
			{
				url:'properties',
				templateUrl : './templates/view.properties.html',
				controller : 'controllerProperties',
				params : {
					city : null
				}
			})
		.state('home.property',
			{
				url:'property/:propertyId',
				templateUrl : './templates/view.property.html',
				controller : 'controllerProperties',
				params : {
					selectedProperty : null
				}
			})

})
