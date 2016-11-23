airbnbApp.controller('controllerBecomeHostLocation',function($scope,$state,$log,$http,$state){

    $scope.step2det = $state.params.step2det;
    $scope.country = "";
    $scope.street = "";
    $scope.apt = "";
    $scope.city = "";
    $scope.state = "";
    $scope.zip = "";


    $scope.invAddress = ""
    $scope.guessedAddMessage = "";
    $scope.matchedAddMessage = "";    
    $scope.confirmedAddress = false;

    $scope.validateAddress  = function() {

        $scope.invAddress = "";
        $scope.successMessage = "";

        var address = $scope.street+", "+$scope.city+", "+$scope.state+", "+$scope.zip+", "+$scope.country;
        $scope.step2det.street = $scope.street;
        $scope.step2det.apt = $scope.apt;
        $scope.step2det.city = $scope.city;
        $scope.step2det.state = $scope.state;
        $scope.step2det.zip = $scope.zip;
        $scope.step2det.country = $scope.country;
        
         $http({
                method : "POST",
                url : '/host/validateaddress',
                data :{
                    address : address
                }
            }).success(function(data) {
                if(data.statuscode == 0) 
                {
                    if(data.data.matchedAddress == "" && data.data.guessedAddress == "")
                    {
                        $scope.invAddress = "Address you provided is Invalid";
                    }
                    else if(data.data.matchedAddress != "" && data.data.guessedAddress == "")
                    {
                        var addrArray = data.data.matchedAddress.split(",");
                        $scope.step2det.street = addrArray[0].trim();
                        $scope.step2det.apt = $scope.apt;
                        $scope.step2det.city = addrArray[1].trim();
                        $scope.step2det.state = addrArray[2].trim();
                        $scope.step2det.zip = $scope.zip;
                        $scope.step2det.country = addrArray[3].trim();   
                        

                        //Auto Populate
                        $scope.street =  $scope.step2det.street ;
                        $scope.apt = $scope.step2det.apt ;
                        $scope.city = $scope.step2det.city;
                        $scope.state = $scope.step2det.state;
                        $scope.zip = $scope.step2det.zip;
                        $scope.country = $scope.step2det.country;
                        $scope.guessedAddMessage = "Did You Mean"
                        $scope.confirmedAddress = true;
                    }
                    else if(data.data.matchedAddress == "" && data.data.guessedAddress != "")
                    {
                        var addrArray = data.data.guessedAddress.split(",");
                        $scope.step2det.street = addrArray[0].trim();
                        $scope.step2det.apt = $scope.apt;
                        $scope.step2det.city = addrArray[1].trim();
                        $scope.step2det.state = addrArray[2].trim();
                        $scope.step2det.zip = $scope.zip;
                        $scope.step2det.country = addrArray[3].trim();


                        //Auto Populate
                        $scope.street =  $scope.step2det.street ;
                        $scope.apt = $scope.step2det.apt ;
                        $scope.city = $scope.step2det.city;
                        $scope.state = $scope.step2det.state;
                        $scope.zip = $scope.step2det.zip;
                        $scope.country = $scope.step2det.country;
                        $scope.guessedAddMessage = "Did You Mean";
                        $scope.confirmedAddress = true;
                    }
                }
                else 
                {
                    $scope.invMessage = data.message;
                }
            }).error(function(error) {
                
                $state.go('home.becomeHost')
            });        
    };


    $scope.becomeHost = function(){
        if($scope.confirmedAddress)
            $state.go('home.becomeHost',{firstStep : $scope.step2det});
        else
            $scope.invAddress = "Please Validate Your Address First";
    }
   $scope.becomeHostBeds = function () {
        $state.go('home.becomeHostBeds');
    
    };

})