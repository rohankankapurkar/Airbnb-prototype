airbnbApp.controller('controllerAdminApproval',function($scope,$state,$log,$http,$state){

	$scope.pendingHosts = [];

    $http({
        method : "GET",
        url : '/admin/getadminapprovals'
    }).success(function(data){
    	console.log(data);
        $scope.pendingHosts = data.data;
        console.log($scope.pendingHosts[0].username);
    })

    $scope.approveRequest =function(hostUsername){

    	$http({
    		method : "POST",
    		url : '/admin/approve',
    		data : {
    			username : hostUsername
    		}
    	}).success(function(data){
    		console.log(data);
    		if(data.statuscode == 0)
    		{
    			for(var i=0; i<$scope.pendingHosts.length; i++)
    			{
    				if($scope.pendingHosts[i].username == hostUsername)
    				{
    					$scope.pendingHosts.splice(i,1);
    				}
    			}
    		}

    	})
    }


})