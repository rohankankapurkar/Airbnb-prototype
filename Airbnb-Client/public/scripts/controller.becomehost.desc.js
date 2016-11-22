airbnbApp.controller('controllerBecomeHostDesc',function($scope,$state,$log,$http,$state){


    $scope.secondstep = $state.params.imagestep;
    $scope.description = "";
    $scope.title = "";
    
    $scope.becomeHost = function(){

        $scope.secondstep.description = $scope.description;
        $scope.secondstep.title = $scope.title
        console.log($scope.secondstep);
        $state.go('home.becomeHost',{secondstep : $scope.secondstep })
    }


    $scope.startHosting2 = function () {
        $state.go('home.becomeHostStep2');
    };

})