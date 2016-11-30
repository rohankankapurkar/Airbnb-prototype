airbnbApp.controller('controllerAdminBilling',function($scope,$state,$log,$http,$state){


    console.log("--------------controllerAdminBilling-----------");
    console.log();
    $scope.noBillingFoundMsg = false;





      $scope.searchBills = function() {

        console.log($scope.fromdate);
        console.log(moment($scope.fromdate).add(30, 'days').format('MM-YYY-DD')._d);

        //check if month OR fromdate Or tilldate OR both are selected
        if($scope.fromdate && $scope.tilldate) {
            var dynamicDate = {
                from_date: moment($scope.fromdate).format('YYYY-MM-DD'),
                till_date: moment($scope.tilldate).format('YYYY-MM-DD')
            }
        }else if($scope.fromdate) {
            var dynamicDate = {
                from_date: moment($scope.fromdate).format('YYYY-MM-DD'),
                till_date: moment($scope.fromdate).add(30, 'days').format('YYYY-MM-DD')
            }
        }else if ($scope.tilldate) {
            var dynamicDate = {
                from_date: moment($scope.tilldate).add(30, 'days')._d,
                till_date: moment($scope.tilldate).format('YYYY-MM-DD')
            }
        }else if($scope.month) {
            var dynamicDate = {
                from_date : moment('2016/01/01', ["YYYY", moment.ISO_8601]).add($scope.month, 'month').format('YYYY-MM-DD'),
                till_date : moment(moment('2016/01/01', ["YYYY", moment.ISO_8601]).add($scope.month, 'month')._d).add(1, 'month').format('YYYY-MM-DD')
            }
        }else {
            dynamicDate = null;
        }

        console.log(dynamicDate);

        $http({
          method : "POST",
          url : '/getUserTrips',
          data: {
            userId: null,
            date: dynamicDate
          }
        }).success(function(userTrips){
            console.log("-----------------controllerAdminBilling user trips----------");
            console.log(userTrips);

            if(userTrips.data.length > 0) {

              //populate billings with trips and user data
              $http({
                method : "POST",
                url : '/getUserAndProperty',
                data : {
                  pendingApprovalsData: userTrips.data
                }
              }).success(function(getUserAndProperty){

                  console.log("--------getUserAndProperty-------");
                  console.log(getUserAndProperty);

                  var userAndPropertyDetails = getUserAndProperty.result,
                      userTripsPopulated = userTrips.data;

                  //mergin properties and user data to ids
      						for(var i=0; i<userTripsPopulated.length; i++) {
      							for(var j=0; j<userAndPropertyDetails.updatedProperties.length; j++) {
      								if(userTripsPopulated[i].prop_id == userAndPropertyDetails.updatedProperties[j].id) {
      									userTripsPopulated[i].propertyDetails = userAndPropertyDetails.updatedProperties[j];
      									userTripsPopulated[i].from_date = moment(userTripsPopulated[i].from_date).format("YYYY-MM-DD");
      									userTripsPopulated[i].till_date = moment(userTripsPopulated[i].till_date).format("YYYY-MM-DD");
      								}
      							}
      							for(var k=0; k<userAndPropertyDetails.updatedUser.length; k++) {
      								if(userTripsPopulated[i].user_id == userAndPropertyDetails.updatedUser[k].id) {
      									userTripsPopulated[i].userDetails = userAndPropertyDetails.updatedUser[k];
      								}
                      if(userTripsPopulated[i].host_id == userAndPropertyDetails.updatedUser[k].id) {
      									userTripsPopulated[i].hostDetails = userAndPropertyDetails.updatedUser[k];
      								}
      							}
      						}

                  console.log(userTripsPopulated);
                  $scope.adminBillings = userTripsPopulated;

                  //ng table
                  // var self = this;
                  // var dataset = userTripsPopulated;
                  // self.tableParams = new NgTableParams({}, { data: dataset});


                }).error(function(error) {
                  console.log("error");
                })

            }else {
                $scope.adminBillings = null;
                $scope.noBillingFoundMsg = true;
            }

        }).error(function(err){
            console.log(err);
        });

      }

      $scope.viewBill = function (bookingId)
    	{

    		for(var i=0; i<$scope.adminBillings.length; i++)
    		{
    			if($scope.adminBillings[i].id == bookingId)
    			{
    				$scope.booking = $scope.adminBillings[i];

    			}
    		}

    		$state.go('home.profile.viewBill',{bookings : $scope.booking});

    	};





});
