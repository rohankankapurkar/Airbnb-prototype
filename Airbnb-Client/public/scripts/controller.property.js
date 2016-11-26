airbnbApp.controller('controllerProperty',function($scope,$http,$state,$stateParams){

	$scope.selectedProperty = $state.params.selectedProperty;
	console.log($scope.selectedProperty);


	$scope.checkUserSession = function(){
			$http({
			method : "POST",
			url : '/getusersession'
		}).success(function(data) {
		
			if(data.statuscode == 0) 
			{
				if(data.credentials.isadmin == true)
				{
					return false;
				}
				else
				{
					if(data.credentials.ishost == true)
					{	
						return true;
					}
					else
					{	
						return true;
					}
				}
			}
			else 
			{
				return false
			}
		}).error(function(error) {
			return false;
		});
	}
	
	$scope.checkAvailability = function(){

		if(checkUserSession())
		{
			
		}
		else
		{
			alert("Please Sign up!!");
		}
	}
})