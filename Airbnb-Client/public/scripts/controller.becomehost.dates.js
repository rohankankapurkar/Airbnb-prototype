airbnbApp.controller('controllerBecomeHostDates',function($scope,$state,$log,$http,$state){


    $scope.pricestep = $state.params.pricestep;
    $scope.from = "";
    $scope.till = "";

    console.log($scope.pricestep);
    

    $scope.startHosting3 = function () {
        $state.go('home.becomeHostStep3',{secondstep : $scope.pricestep});
    };

/*    $scope.finish = function(){
        $scope.pricestep.from = $scope.from;
        $scope.pricestep.till = $scope.till;
        console.log($scope.pricestep);
        
        $http({
            method : "POST",
            url : '/getusersession'
        }).success(function(data) {
            if(data.statuscode == 0) 
            {
                console.log("success");
            }
            else 
            {
                console.log("error");
            }
    }).error(function(error) {
            

        $state.go('home.becomeHost')
    }*/

    $state.go('home.becomeHost');

    }
})