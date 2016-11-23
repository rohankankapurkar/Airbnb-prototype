airbnbApp.controller('controllerBecomeHostDates',function($scope,$state,$log,$http,$state){


    $scope.pricestep = $state.params.pricestep;
    $scope.from = "";
    $scope.till = "";

    $scope.invMessage = "";
    $scope.successMessage = "";


    $scope.startHosting3 = function () {
        $state.go('home.becomeHostStep3',{secondstep : $scope.pricestep});
    };

    $scope.finish = function(){

        $scope.successMessage = "";
        $scope.invMessage = "";
        
        $scope.pricestep.from = $scope.from;
        $scope.pricestep.till = $scope.till;

        var validDates = true;
        var selectedFromDate = new Date($scope.from);
        var selectedToDate = new Date($scope.till);
        var currentDate = new Date();

        if(selectedFromDate < currentDate)
        {
            validDates = false;
            $scope.invMessage = "Please select a Valid From Date";
        }
        if(selectedToDate < selectedFromDate)
        {
            validDates = false
            $scope.invMessage = "Please select a Valid To Date";
        }
        
        if(validDates)
        {
            $http({
                method : "POST",
                url : '/host/addproperty',
                data :{
                    propertydetails : $scope.pricestep
                }
            }).success(function(data) {
                if(data.statuscode == 0) 
                {
                    $scope.successMessage = data.message;
                    $state.go('home.becomeHost',{laststep : true});
                }
                else 
                {
                    $scope.invMessage = data.message;
                }
            }).error(function(error) {
                
                $state.go('home.becomeHost')
            });
            
        }
        
    }
})