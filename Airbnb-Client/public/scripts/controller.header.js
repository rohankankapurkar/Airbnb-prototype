/**
 * Created by Shruti Loya on 11/17/2016.
 */

airbnbApp.controller('controllerHeader',function($scope,$state,$log,$http){

    $scope.becomeHost = function () {
        $state.go('home.becomeHost');
    };

})
