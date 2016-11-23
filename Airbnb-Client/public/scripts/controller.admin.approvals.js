airbnbApp.controller('controllerAdminApproval',function($scope,$state,$log,$http,$state){

    $http({
        method : "GET",
        url : '/admin/getadminapprovals'
    }).success(function(data){
        console.log(data);
    })

})