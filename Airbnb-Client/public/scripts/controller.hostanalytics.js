airbnbApp.controller('controllerHostAnalytics',function($log, $scope,$http,$state,$stateParams){

	$scope.pages = [];
	$scope.counts = [];

	$scope.props = [];
	$scope.propClicks = [];

	$scope.area = [];
	$scope.seen = [];

// Clicks per property here:

	$http({
		method : "POST",
		url : "/host/getclicksperproperty",
		data : {}
	}).success(function(data){
		console.log(data.result.data);
		var plotData = data.result.data;
		var pageColors = [];
		var counter = 0;
		for(counter = 0; counter < plotData.length; counter++){			
			$scope.props.push(plotData[counter]._id);	
			$scope.propClicks.push(plotData[counter].count);
			pageColors.push('#4BC0C0');
		}

		//Plot the graph here
		var barChartData = {
				labels: $scope.props,
				datasets: [{
					label: 'Property Clicks',
					data: $scope.propClicks,
					backgroundColor: pageColors,
					borderWidth: 0
				}]
			};


		var barChartElement = document.getElementById("admin-bar-chart");
		var barChart = new Chart(barChartElement, {
			type: 'bar',
			data: barChartData,
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});	

	}).error(function(error){

	});
})