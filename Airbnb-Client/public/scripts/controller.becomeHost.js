/**
 * Created by Shruti Loya on 11/17/2016.
 */
/**
 * Created by Shruti Loya on 11/17/2016.
 */

airbnbApp.controller('controllerBecomeHost',function($scope,$state,$log,$http){

    $scope.startHosting1 = function () {
        $state.go('home.becomeHostStep1');
    };

    $scope.startHosting2 = function () {
        $state.go('home.becomeHostStep2');
    };

    $scope.becomeHostDesc = function () {
        $state.go('home.becomeHostDesc');
    };

    $scope.becomeHost = function () {
        $state.go('home.becomeHost');
    };

})
