airbnbApp.controller('controllerAdmin',function($scope,$log,$http,$state,$stateParams){


	// TODO : make API call her to get all the data for ploting the graphs
	// and store it int the array. This is to be done after api is written.

	// This is bar chart

	$scope.pages = [];
	$scope.counts = [];

	$scope.props = [];
	$scope.propClicks = [];

	$scope.area = [];
	$scope.seen = [];

// Plot bar chart for property revenue
		$http({
			method : "POST",
			url : '/admin/top_properties'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var props = [];
			var propsCosts = [];
			var propsColors = []			

			
			for(counter = 0; counter < propData.length; counter++ ){
				props.push(propData[counter]['prop_id']);
				propsCosts.push(propData[counter]['total']);
				propsColors.push('rgba(54, 162, 235, 0.2)');
			}

			var barChartData = {
				labels: props,
				datasets: [{
					label: 'Revenue/Year ($)',
					data: propsCosts,
					backgroundColor: propsColors,
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

		}).error(function(error) {
			return false;
		});

// Pie chart for city revenue

	
		$http({
			method : "POST",
			url : '/admin/top_cities'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var city = [];
			var cityCosts = [];
			var allColors = ['#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FFCE56'];
			var cityColors = [];
			
			for(counter = 0; counter < propData.length; counter++ ){
				city.push(propData[counter]['city']);
				cityCosts.push(propData[counter]['total']);
				cityColors.push(allColors[counter]);
			}

			pieChartData = {
				labels: city,
				datasets: [
				{
					data: cityCosts,
					borderWidth	:[0,0,0],
					backgroundColor: cityColors,
					hoverBackgroundColor: cityColors
				}]
			};
			
			var pieChartElement = document.getElementById('admin-pie-chart');
			var myPieChart = new Chart(pieChartElement,{
				type: 'doughnut',
				animation:{
		        animateScale:true
		    	},
				data: pieChartData,
				options: {
		     	   elements: {
		        	    arc: {
		            	    borderColor: "#000000"
		            	}
		       		 }
		    	}
			});

		}).error(function(error) {
			return false;
		});


// Plot bar chart for top host revenu

		$http({
			method : "POST",
			url : '/admin/top_hosts'
		}).success(function(data) {
			console.log('Hey' + data.data[0]['prop_id']);

			var propData = data.data;
			var counter = 0;
			var hosts = [];
			var hostsCosts = [];
			var hostsColors = []			

			
			for(counter = 0; counter < propData.length; counter++ ){
				hosts.push(propData[counter]['host_id']);
				hostsCosts.push(propData[counter]['total']);
				hostsColors.push('rgba(54, 162, 235, 0.2)');
			}

			var barChartData = {
				labels: hosts,
				datasets: [{
					label: 'Revenue/Year ($)',
					data: hostsCosts,
					backgroundColor: hostsColors,
					borderWidth: 0
				}]
			};

			var barChartElement = document.getElementById("admin-bar-chart-1");
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

		}).error(function(error) {
			return false;
		});

	$scope.hostdetails=$state.params.Hostdetail;

	$scope.getStars = function(rating) {
		// Get the value
		var val = parseFloat(rating);
		// Turn value into number/100
		var size = val/5*100;
		return size + '%';
	}


	$http({
		method : "POST",
		url : "/admin/getclicksperpage",
		data : {}
	}).success(function(data){
		console.log("inside the clikcs per page"+data.result.data);
		var plotData = data.result.data;
		var pageColors = [];
		var counter = 0;
		for(counter = 0; counter < plotData.length; counter++){			
			if((plotData[counter]._id.split("#/"))[1] == ""){
				console.log('I am here for null');
				$scope.pages.push("home");
			}else{
				$scope.pages.push(plotData[counter]._id.split("#/")[1]);	
			}
			
			$scope.counts.push(plotData[counter].count);
			pageColors.push('#36A2EB');
		}

		//Plot the graph here
		var barChartData = {
				labels: $scope.pages,
				datasets: [{
					label: 'Page Clicks',
					data: $scope.counts,
					backgroundColor: pageColors,
					borderWidth: 0
				}]
			};


		var barChartElement = document.getElementById("admin-bar-chart-2");
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


// Area less seen

	$http({
		method : "POST",
		url : "/admin/getareaseen",
		data : {}
	}).success(function(data){
		var plotData = data.result.data;
		var pageColors = [];
		var counter = 0;
		var allColors =['#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56','#FF6384','#36A2EB','#FFCE56'];
		var areaColor = [];
		for(counter = 0; counter < plotData.length; counter++){			
			if(plotData[counter]._id == null){
				$scope.area.push("Anonymous");
			}else{
				$scope.area.push(plotData[counter]._id);	
			}
			areaColor.push(allColors[counter]);
			$scope.seen.push(plotData[counter].count);
			pageColors.push('#36A2EB');
		}

		//Plot the graph here

		pieChartData = {
				labels: $scope.area,
				datasets: [
				{
					data: $scope.seen,
					borderWidth	:[0,0,0],
					backgroundColor: areaColor,
					hoverBackgroundColor: areaColor
				}]
			};


		var pieChartElement = document.getElementById('admin-pie-chart-1');
		var myPieChart = new Chart(pieChartElement,{
			type: 'doughnut',
			animation:{
	        animateScale:true
	    	},
			data: pieChartData,
			options: {
	     	   elements: {
	        	    arc: {
	            	    borderColor: "#000000"
	            	}
	       		 }
	    	}
		});


	}).error(function(error){


	});
	
	
	

});