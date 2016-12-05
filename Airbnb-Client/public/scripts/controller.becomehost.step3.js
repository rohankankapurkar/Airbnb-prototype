airbnbApp.controller('controllerBecomeHostStep3',function($scope,$state,$log,$http,$state){


    $scope.secondstep = $state.params.secondstep;
    $scope.price = "";
    $scope.currency = "";
    $scope.bidding = "";
    $scope.price_hide = true;
    $scope.becomeHost = function(){
        $state.go('home.becomeHost')
    }


    $scope.becomeHostDates = function () {
        $scope.secondstep.price = $scope.price;
        $scope.secondstep.currency = $scope.currency;
        if($scope.price == "")
        {
            $scope.price_hide = false;
        }
        else
        {
            if ($scope.bidding == "")
                $scope.secondstep.biddingavailable = $scope.bidding;
            else if ($scope.bidding == true) {
                $scope.secondstep.biddingavailable = $scope.bidding;
                $scope.secondstep.currentBid = $scope.price;
                $scope.secondstep.currentBidder = "";
                $scope.secondstep.bidFlag = "yes";
                $scope.secondstep.propertysold = "no";
                var bidRawStartDate = new Date();
                var bidRawEndDate = bidRawStartDate;
                $scope.secondstep.bidStartDate = bidRawStartDate;
                $scope.secondstep.bidEndDate = bidRawEndDate;
            }
            $state.go('home.becomeHostDates', {pricestep: $scope.secondstep});
        }
    };

})