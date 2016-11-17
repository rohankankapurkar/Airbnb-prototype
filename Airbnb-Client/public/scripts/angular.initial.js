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
					resolve : {
						session : function($http){
							 return $http({
									method : "POST",
									url : '/getusersession'
									});
							}
					},
					controller : 'controllerHome'
				})
		.state('home.becomeHost',
			{
				url:'/becomeHost',
				templateUrl : './templates/view.becomeHost.html',
				/*resolve : {
					session : function($http){
						return $http({
							method : "POST",
							url : '/getusersession'
						});
					}
				},*/
				controller : 'controllerBecomeHost'
			})
})


