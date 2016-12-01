/**
 * http://usejsdoc.org/
 */

var airbnbApp = angular.module('airbnbApp',['ui.router','uiSlider','ngMaterial', 'ngMessages', 'material.svgAssetsCache','ngAutocomplete']);
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
				controller : 'controllerYourTrips'
			})
		.state('home.profile.trips.editTrip',
			{
				url:'/editTrip',
				templateUrl : './templates/view.editTrip.html',
				controller : 'controllerEditTrip',
				params : {
					trip : null
				}
			})
		.state('home.profile.hostAnalytics',
			{
				url:'/host/analytics',
				templateUrl : './templates/view.hostAnalytics.html',
				controller : 'controllerHostAnalytics'
			})
		.state('home.profile.trips.pendingApprovalTrips',
		  {
		    url:'/pendingApprovalTrips',
		    templateUrl : './templates/view.trips.pendingApprovalTrips.html',
		    controller : 'controllerYourTrips'
		  })
		.state('home.profile.trips.upcomingTrips',
		  {
		    url:'/upcomingTrips',
		    templateUrl : './templates/view.trips.upcoming.html',
		    controller : 'controllerYourTrips'
		  })
		.state('home.profile.trips.compeletedTrips',
		  {
		    url:'/completedTrips',
		    templateUrl : './templates/view.trips.completed.html',
		    controller : 'controllerYourTrips'
		  })
		.state('home.profile.trips.pendingBids',
			{
				url:'/pendingBids',
				templateUrl : './templates/view.trips.pendingBids.html',
				controller : 'controllerTripsBids'
			})
		.state('home.profile.trips.approvedBids',
			{
				url:'/approvedBids',
				templateUrl : './templates/view.trips.approvedBids.html',
				controller : 'controllerTripsBids'
			})
		.state('home.profile.dashboard',
		  {
		    url:'/dashboard',
		    templateUrl : './templates/view.dashboard.html',
		    controller : 'controllerProfile'
		  })
		.state('home.profile.approvals',
		  {
		    url:'/approvals',
		    templateUrl : './templates/view.approvals.html',
		    controller : 'controllerApprovals'
		  })
		.state('home.profile.history',
			{
				url:'/history',
				templateUrl : './templates/view.history.html',
				controller : 'controllerProfile'
			})
		.state('home.profile.viewBill',
			{
				url:'/bill',
				templateUrl : './templates/view.getBill.html',
				controller : 'controllerReview',
				params :{
					bookings : null
				}
			})
		.state('home.profile.reviewUser',
			{
				url:'/reviewUser',
				templateUrl : './templates/view.host.reviewUser.html',
				controller : 'controllerReview',
				params :{
					bookings : null
				}
			})
		.state('home.profile.reviewTrip',
			{
				url:'/reviewTrip',
				templateUrl : './templates/view.reviewProperty.html',
				controller : 'controllerReview',
				params :{
					bookings : null
				}
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
		.state('home.billing',
			{
				url:'admin/billing',
				templateUrl : './templates/view.adminBilling.html',
				controller : 'controllerAdminBilling'
			})
		.state('home.pendingApprovals',
			{
				url:'admin/hostapprovals',
				templateUrl : './templates/view.admin.approvals.html',
				controller : 'controllerAdminApproval',
			})
		.state('home.getHosts',
			{
				url:'admin/getHosts',
				templateUrl : './templates/view.admin.getHosts.html',
				controller : 'controllerHome',
				params : {
					Hosts : null
				}
			})
		.state('home.hostdetails',
			{
				url:'admin/getHosts',
				templateUrl : './templates/view.admin.hostdetails.html',
				controller : 'controllerAdmin',
				params : {
					Hostdetail : null
				}
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
				controller : 'controllerProperty',
				params : {
					selectedProperty : null
				}
			})
		.state('home.finalPayment',
			{
				url:'checkout',
				templateUrl : './templates/view.checkout.html',
				controller : 'controllerCheckout',
				params : {
					fromdate : null,
					tilldate : null,
					numberOfDays : null,
					property : null,
					username : null,
					userid : null
				}
			})

})
