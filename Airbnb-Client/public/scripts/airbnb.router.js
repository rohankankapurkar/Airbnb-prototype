/**
 * http://usejsdoc.org/
 */

var eBayApp = angular.module('airbnbApp',['ui.router']);
//handles client side routing
eBayApp.config(function($stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.
		otherwise('/');
	
	$stateProvider
		.state('home',
				{
					url:'/',
					templateUrl : './templates/view.homepage.html'
					/*resolve : {
						userSession : function($http){
							 return $http({
									method : "POST",
									url : '/getSession'
									});
							}
					},*/
					/*controller : 'controllerHome'*/
				})
		/*.state('home.adv',
				{
					url:'sell',
					templateUrl : './templates/sellproduct.html',
					controller : 'controllerSellproduct'
				})
		.state('home.userinfo',
				{
					url : 'userinfo',
					templateUrl : './templates/userinfo.html',
					resolve : {
						user : function($http){
							 return $http({
									method : "POST",
									url : '/getSession'
									});
							}
					},
					controller : 'controllerUserinfo'
				})
		.state('home.profile',
				{
					url : 'profile',
					templateUrl : './templates/profile.html',
					controller : 'controllerProfile',
					resolve : {
						userSession : function($http){
							 return $http({
									method : "POST",
									url : '/getSession'
									});
							}
					}
				})
		.state('home.buyProduct',
				{
					url : 'buyproduct/:product_id',
					templateUrl : './templates/buyproduct.html',
					resolve : {
						userPrdpage : function($http){
								 return $http({
										method : "POST",
										url : '/getSession'
										});
								}
						},
					controller : 'controllerBuyproduct'
				})
		.state('home.bidProduct',
				{
					url : 'bidproduct/:product_id',
					templateUrl : './templates/bidproduct.html',
					resolve : {
						userSession : function($http){
							return $http({
									method : "POST",
									url : '/getSession'
							})
						}
					},
					controller : 'controllerBidproduct'
				})
		.state('home.cart',
				{
					url : 'cart',
					templateUrl : './templates/cart.html',
					controller : 'controllerCart',
					resolve : {
							userSession : function($http){
								 return $http({
										method : "POST",
										url : '/getSession'
										});
								}
						}
				})
		.state('home.checkout',
				{
					url : 'checkout',
					templateUrl : './templates/checkout.html',
					controller : 'controllerCheckout',
					params :{'cart' : null},
					resolve : {
							userSessionCheckout : function($http){
								 return $http({
										method : "POST",
										url : '/getSession'
										});
								},
							cart : function($http){
								 return $http({
										method : "POST",
										url : '/getcart'
										});
								}
					}
					
				})
		.state('home.checkoutbid',
				{
					url : 'bidcheckout/:product_id',
					templateUrl : './templates/bidcheckout.html',
					controller : 'controllerBidcheckout',
					resolve : {
						userSession : function($http){
							return $http({
								method : "POST",
								url : '/getSession'
								});
						}
					}
				})
		.state('signin',
				{
					url:'/signin',
					templateUrl : './templates/signin.html',
					controller : 'controllerSignin'
				})
		.state('register',
				{
					url:'/register',
					templateUrl : './templates/register.html',
					controller : 'controllerRegister'
				})
		*/
})
.controller('mainCntrl',function(){})

