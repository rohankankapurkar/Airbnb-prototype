airbnbApp.controller('controllerHostAnalytics',function($log, $scope,$http,$state,$stateParams){


	console.log("I am here in controller");

	$http({
		method : "POST",
		url : "/host/getclicksperpage",
		data : {}
	}).success(function(data){
		console.log(data.result.data);

	}).error(function(error){


	});


})