airbnbApp.controller('controllerCheckout',function($scope,$http,$state,$stateParams){

	if (typeof(Storage) !== "undefined") {
    	if($state.params.numberOfDays != null && $state.params.numberOfDays != "" && $state.params.numberOfDays != undefined)
    	{
      		localStorage.setItem('numberOfDays',JSON.stringify($state.params.numberOfDays));
    	}
    	if($state.params.property != null && $state.params.property != "" && $state.params.property != undefined)
    	{
    		localStorage.setItem('property',JSON.stringify($state.params.property));
    	}
    	if($state.params.fromdate != null && $state.params.fromdate != "" && $state.params.fromdate != undefined)
    	{
    		localStorage.setItem('fromdate',JSON.stringify($state.params.fromdate));
    	}
    	if($state.params.tilldate != null && $state.params.tilldate != "" && $state.params.tilldate != undefined)
    	{
    		localStorage.setItem('tilldate',JSON.stringify($state.params.tilldate));
    	}
    	if($state.params.username != null && $state.params.username != "" && $state.params.username != undefined)
    	{
    		localStorage.setItem('username',JSON.stringify($state.params.username));
    	}
    	if($state.params.userid != null && $state.params.userid != "" && $state.params.userid != undefined)
    	{
    		localStorage.setItem('userid',JSON.stringify($state.params.userid));
    	}
  	}

	$scope.numberOfDays = JSON.parse(localStorage.getItem('numberOfDays'));
	$scope.property = JSON.parse(localStorage.getItem('property'));
//	$scope.fromdate = JSON.parse(localStorage.getItem('fromdate'));
//	$scope.tilldate = JSON.parse(localStorage.getItem('tilldate'));
	$scope.username = JSON.parse(localStorage.getItem('username'));
	$scope.userid = JSON.parse(localStorage.getItem('userid'));
	
	
	
	
	
	var from = moment(JSON.parse(localStorage.getItem('fromdate'))).format('YYYY-MM-DD');
var till = moment(JSON.parse(localStorage.getItem('tilldate'))).format('YYYY-MM-DD');

$scope.tilldate = till;
$scope.fromdate = from;
	
	

	$scope.invCreditCardNumber = "";
	$scope.invCreditCardCVV = "";
	$scope.invExpDate = "";
	$scope.invName =  "";

	var price = parseInt($scope.numberOfDays * parseInt($scope.property.price));
	//This function should be called after all validations.
	//Either call all the validaion functions from this function or call this from the validation funcitons in if-else
	//But should be called at the end
	$scope.finalCheckout = function(){

		if($scope.applyCreditCardValidations())
		{
			$http({
				method : "POST",
				url : '/user/bookproperty',
				data :{
					propid : $scope.property.id,
					fromdate : $scope.fromdate,
					todate: $scope.tilldate,
					userid: $scope.userid,
					hostid: $scope.property.hostdata[0].id,
					city : $scope.property.city,
					price : price
					//hostdata:$scope.property.hostdata[0]
				}
			}).success(function(data) {
				console.log("Success");
		        $state.go('home.profile.trips');
			})
			.error(function(data){
				console.log("Error")
			})
		}

	}


	$scope.applyCreditCardValidations = function(){

		var validFlag = true;

		if($scope.creditCard != null && $scope.creditCard != undefined && $scope.creditCard != "")
		{
			if($scope.creditCard.length != 16)
			{
				$scope.invCreditCardNumber = "Invalid Credit Card Number";
				validFlag = false;
				alert($scope.invCreditCardNumber);
			}
			else
			{
				if(/^\d+$/.test($scope.creditCard))
				{
					$scope.invCreditCardNumber = "";
				}
				else
				{
					$scope.invCreditCardNumber = "Credit Card number should only contain digits";
					validFlag = false;
				}
			}
		}
		else
		{
			$scope.invCreditCardNumber = "Credit Card Number can't be Empty"
		}

		if($scope.creditCardCVV != null && $scope.creditCardCVV != undefined && $scope.creditCardCVV != "" )
		{
			console.log($scope.creditCardCVV);
			if(!(/^\d+$/.test($scope.creditCardCVV)) || $scope.creditCardCVV.length !=3)
			{
				$scope.invCreditCardCVV = "Invalid Credit Card Security Code"
				validFlag = false;
			}
		}
		else
		{
			$scope.invCreditCardCVV = "Credit Card Security Code can't be Empty"
			validFlag = false;
		}


		if($scope.creditCardExp != null && $scope.creditCardExp != undefined && $scope.creditCardExp != "")
		{
			var expDate = new Date($scope.creditCardExp);
			var today = new Date();
			if(expDate < today)
			{
				$scope.invExpDate = "Invalid Expiry Date";
				validFlag = false;
			}
		}
		else
		{
			$scope.invExpDate = "Expiry Date can't be Empty";
			validFlag = false;
		}

		if($scope.creditCardName != null && $scope.creditCardName != undefined && $scope.creditCardName != "")
		{
			console.log("true");
		}
		else
		{
			$scope.$scope.invNameinvCreditCardNumber
			$scope.invCreditCardCVV
			$scope.invExpDate
			$scope.invName = "Name Cannot be empty";
			validFlag = false;
		}

		return validFlag;
	}

	$http({
		method: "GET",
		url : '/user/update_profile'
	}).success(function(data){
		$scope.creditCard = data.credit_card;
		$scope.creditCardName = data.firstname+" "+data.lastname;
	}).error(function(data){
		console.log("Error while fetching user data");
	})


})
