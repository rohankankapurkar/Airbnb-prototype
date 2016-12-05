airbnbApp.controller('controllerBecomeHostDesc',function($scope,$state,$log,$http,$state){


    $scope.secondstep = $state.params.imagestep;
    $scope.description = "";
    $scope.title = "";
    $scope.desc_hide = true;
    $scope.title_hide = true;
    $scope.becomeHost = function(){


        if($scope.description == "" && $scope.title == "")
        {
            $scope.desc_hide = false;
            $scope.title_hide = false;
        }
        else if($scope.title == "") {
            $scope.title_hide = false;
            $scope.desc_hide = true;
        }
        else if($scope.description == "")
        {
            $scope.desc_hide = false;
            $scope.title_hide = true;
        }
        else
        {
            $scope.secondstep.description = $scope.description;
            $scope.secondstep.title = $scope.title;
            $state.go('home.becomeHost', {secondstep: $scope.secondstep});
        }
    }


    $scope.startHosting2 = function () {
        $state.go('home.becomeHostStep2');
    };

})