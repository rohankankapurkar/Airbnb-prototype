airbnbApp.controller('controllerBecomeHostDates',function($scope,$state,$log,$http,$state){


    $scope.pricestep = $state.params.pricestep;
    $scope.from = "";
    $scope.till = "";

    $scope.invMessage = "";
    $scope.successMessage = "";

    $scope.invDates = "";

    console.log($scope.pricestep);
    

    $scope.startHosting3 = function () {
        $state.go('home.becomeHostStep3',{secondstep : $scope.pricestep});
    };

    $scope.finish = function(){
        $scope.pricestep.from = $scope.from;
        $scope.pricestep.till = $scope.till;
        console.log($scope.pricestep);
        
        $http({
            method : "POST",
            url : '/host/addproperty',
            data :{
                propertydetails : $scope.pricestep
            }
        }).success(function(data) {
            console.log(data);
            if(data.statuscode == 0) 
            {
                $scope.successMessage = data.message;
                alert("$scope.successMessage");
            }
            else 
            {
                $scope.invMessage = data.message;
                alert(data.message);
            }
    }).error(function(error) {
            
            $state.go('home.becomeHost')
        });
    }

    //$state.go('home.becomeHost');

    
})