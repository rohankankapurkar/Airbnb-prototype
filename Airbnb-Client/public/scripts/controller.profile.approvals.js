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
                    }).success(function(data){


                        console.log("------------getUserAndProperty success---------");
                        console.log(data.result);

                        var pendingApprovals = property.result.data,
                            pendingApprovalsToMerge = data.result,
                            updatedPendingApprovalsClient = {};


                        //mergin properties and user data to ids
                        for(var i=0; i<pendingApprovals.length; i++) {
                            for(var j=0; j<pendingApprovalsToMerge.updatedProperties.length; j++) {
                                if(pendingApprovals[i].prop_id == pendingApprovalsToMerge.updatedProperties[j].id) {
                                    pendingApprovals[i].propertyDetails = pendingApprovalsToMerge.updatedProperties[j];
                                    pendingApprovals[i].from_date = moment(pendingApprovals[i].from_date).format("YYYY-MM-DD");
                                    pendingApprovals[i].till_date = moment(pendingApprovals[i].till_date).format("YYYY-MM-DD");
                                }
                            }
                            for(var j=0; j<pendingApprovalsToMerge.updatedUser.length; j++) {
                                if(pendingApprovals[i].user_id == pendingApprovalsToMerge.updatedUser[j].id) {
                                    pendingApprovals[i].userDetails = pendingApprovalsToMerge.updatedUser[j];
                                }
                            }
                        }

                        console.log(pendingApprovals);

                        $scope.allPendingApprovals = pendingApprovals;

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



    $scope.checkPropertyAvailability = function(propertyId, userId, from, till, index){
      $http({
        method : "POST",
        url : '/host/getpropertyavailable',
        data : {
          propid: propertyId,
          userid: userId,
          fromdate: from,
          tilldate: till
        }
      }).success(function(property){
        console.log("------------checkPropertyAvailability--------------");
        console.log(property);
        console.log(index);
        console.log(property.result.data.avaiable);

        if (property.statuscode == 0)
        {
          if(property.result.data.avaiable == true) {
            $scope.allPendingApprovals[index].checkAvailabilityStatus = true;
            $scope.allPendingApprovals[index].approveBooking = true;
          }
          else {
            $scope.allPendingApprovals[index].checkAvailabilityStatus = false;
          }
        }
        else
        {
          $scope.notAvailableMsg = true;
        }
        console.log($scope.allPendingApprovals);

      }).error(function(error) {
        console.log("error");
      });
    }

    $scope.ApproveBooking = function(propertyId, userId, from, till, index){
      console.log("------------ApproveBooking--------------");
      console.log(propertyId);
      $http({
        method : "POST",
        url : '/host/approveuserrequest',
        data : {
          propid: propertyId,
          userid: userId,
          fromdate: from,
          tilldate: till
        }
      }).success(function(approveBooking){
        console.log("------------ApproveBooking--------------");
        console.log(approveBooking);
        if (approveBooking.statuscode == 0)
        {
            $scope.allPendingApprovals[index].approveBooking = false;
            $scope.allPendingApprovals[index].generateBill = true;
        }
        else
        {
          // $scope.notAvailableMsg = true;
        }
      }).error(function(error) {
        console.log("error");
      });
    }



    $scope.disapproveBooking = function(propertyId, userId, from, till, index){
      console.log("------------ApproveBooking--------------");
      console.log(propertyId);
      $http({
        method : "POST",
        url : '/host/disapproverequest',
        data : {
          propid: propertyId,
          userid: userId,
          fromdate: from,
          tilldate: till
        }
      }).success(function(disapproveBooking){
        console.log("------------DisapproveBooking--------------");
        console.log(disapproveBooking);
        if (disapproveBooking.statuscode == 0)
        {
            $scope.allPendingApprovals[index].approveBooking = false;
            $state.go('home.profile.trips.pendingApprovalTrips');
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
