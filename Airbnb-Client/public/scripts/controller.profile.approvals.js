airbnbApp.controller('controllerApprovals',function($scope,$state,$log,$http,$state){



  console.log("--------------in controllerApprovals------------");
    /*
     |-----------------------------------------------------------
     | Host approval
     |-----------------------------------------------------------
    */
    $scope.notAvailableMsg = false;
    $scope.userrequestapproved = false;
    $scope.checkAvailabilityStatus = false;

    console.log("--------------before get usersesssion------------");
    $http({
      method : "POST",
      url : '/getusersession',
      data : {}
    }).success(function(user){
      console.log("user session");
      if (user.statuscode == 0)
      {
        console.log(user);
        $http({
          method : "POST",
          url : '/host/getpendingpropertyrequests',
          data : {
            hostid: user.credentials.id
          }
        }).success(function(property){


              console.log("------------getpendingpropertyrequests--------------");
              console.log(property.result.data);

              if (property.statuscode == 0)
              {

                    $http({
                      method : "POST",
                      url : '/getUserAndProperty',
                      data : {
                        pendingApprovalsData: property.result.data
                      }
                    }).success(function(updatedProperties){
                      console.log("------------getUserAndProperty success---------");

                      $scope.updatedProperties = updatedProperties;

                    }).error(function(error){
                      console.log("error in getpendingpropertyrequests");
                    })

              }
              else
              {

              }




        }).error(function(error) {
          console.log("error");
        });

      }
      else
      {

      }
    }).error(function(error) {
      console.log("error");
    });



    $scope.checkPropertyAvailability = function(propertyId){
      $http({
        method : "POST",
        url : '/host/getpropertyavailable',
        data : {
          propid: propertyId,
          userid: user
          // formdate: ,
          // tilldate:
        }
      }).success(function(property){
        if (property.statuscode == 0)
        {
          if(property.data.available == true)
            $scope.checkAvailabilityStatus = true;
          else
            $scope.checkAvailabilityStatus = false;
        }
        else
        {
          $scope.notAvailableMsg = true;
        }
      }).error(function(error) {
        console.log("error");
      });
    }

    $scope.ApproveBooking = function(propertyId){
      $http({
        method : "POST",
        url : '/host/approveuserrequest',
        data : {
          propid: propertyId
        }
      }).success(function(property){
        if (property.statuscode == 0)
        {
          $scope.userrequestapproved = true;
        }
        else
        {
          // $scope.notAvailableMsg = true;
        }
      }).error(function(error) {
        console.log("error");
      });
    }

})
