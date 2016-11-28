airbnbApp.controller('controllerYourTrips',function($scope,$state,$log,$http,$state){



  console.log("--------------in controllerYourTrips-----------");

    /*
     |-----------------------------------------------------------
     | User trips section
     |-----------------------------------------------------------
    */
    $scope.noupcomingTripsFoundMsg = false;
    $scope.noupcomingTripsFoundMsg = false;

    $http({
      method : "POST",
      url : '/getusersession',
      data : {}
    }).success(function(user){

      if (user.statuscode == 0)
      {
          console.log("before get trips");
          console.log(user.credentials.id);
          $http({
            method : "POST",
            url : '/getUserTrips',
            data: {
              userId: user.credentials.id
            }
          }).success(function(userTrips){
              console.log("-----------------getUserTrips----------");
              console.log(userTrips);
              if (userTrips.statuscode == 0)
              {
                  console.log("-----------------userTrips.statuscode = 0----------");
                  if(userTrips.data.length > 0) {

                      $http({
                        method : "POST",
                        url : '/getPropertiesForUserTrips',
                        data: {
                          properties: userTrips.data
                        }
                      }).success(function(tripProperties){

                            console.log("-----------------getPropertiesForUserTrips----------");
                            console.log(tripProperties);

                            //get todays date
                            var today = new Date(),
                                dd = today.getDate(),
                                mm = today.getMonth()+1,
                                yyyy = today.getFullYear();

                            if(dd<10) {
                                dd='0'+dd
                            }

                            if(mm<10) {
                                mm='0'+mm
                            }
                            today = yyyy+'/'+mm+'/'+dd;

                            var allUserTrips = tripProperties.data,
                                upcomingTrips = [],
                                completedTrips = [];

                            //upcoming bookings
                            for(var i=0; i<allUserTrips.length; i++)
                            {
                              if(moment(allUserTrips[i].till).format('YYYY-MM-DD') > today) {
                                allUserTrips[i].from = moment(allUserTrips[i].from).format('YYYY-MM-DD');
                                allUserTrips[i].till = moment(allUserTrips[i].till).format('YYYY-MM-DD');
                                upcomingTrips.push(allUserTrips[i]);
                              }
                              else {
                                allUserTrips[i].from = moment(allUserTrips[i].from).format('YYYY-MM-DD');
                                allUserTrips[i].till = moment(allUserTrips[i].till).format('YYYY-MM-DD');
                                completedTrips.push(allUserTrips[i]);
                              }
                            }
                            console.log(upcomingTrips);
                            console.log(completedTrips);
                            //update scope values
                            if(upcomingTrips.length == 0)
                              $scope.noupcomingTripsFoundMsg = true;
                            if(completedTrips.length == 0)
                              $scope.nocompletedTripsFoundMsg = true;
                            $scope.upcomingTrips = upcomingTrips;
                            $scope.completedTrips = completedTrips;


                      }).error(function(error) {
                        console.log("error");
                      });


                }else {
                	$scope.noupcomingTripsFoundMsg = true;
                  $scope.nocompletedTripsFoundMsg = true;
                }

              }
              else
              {
                console.log("--------------userTrips.statuscode = 1----------");
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

})
