/**
 * http://usejsdoc.org/
 */
airbnbApp.controller('controllerHome', function($scope,$http, $log, $state,$model){
	
	$scope.checkvar = "";
	
console.log($scope.emailmain);

$scope.emailmain = "";
	
	$scope.register = function(){
		
		
		console.log($scope.checkvar);

		var r = $scope.regfname;
		console.log(r);
		console.log($scope.reglname);
		console.log("BC");
		console.log($scope.emailmain);
	}
	
	$scope.check = function(){
		$log.info($scope.checkvar);
	}
	

	
	
});