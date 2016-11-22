airbnbApp.controller('controllerAdmin',function($scope,$log,$http,$state,$stateParams){


	// TODO : make API call her to get all the data for ploting the graphs
	// and store it int the array. This is to be done after api is written.

	// This is bar chart

	var barChartData = {
		labels: ["Property1", "Property2", "Property3", "Property4", "Property5", "Property6"],
		datasets: [{
			label: 'Revenue/Year ($)',
			data: [12, 19, 3, 5, 2, 3],
			backgroundColor: [
			'rgba(255, 99, 132, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(255, 206, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(255, 159, 64, 0.2)'
			],

			borderWidth: 0
		}]
	}; 

	//bar chart 1
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

	//bar chart 2
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


	//This is pie chart

	pieChartData = {
		labels: [
		"San Jose",
		"New York",
		"Pune"
		],
		datasets: [
		{
			data: [100, 250, 400],
			borderWidth	:[0,0,0],
			backgroundColor: [
			"#FF6384",
			"#36A2EB",
			"#FFCE56"
			],
			hoverBackgroundColor: [
			"#FF6384",
			"#36A2EB",
			"#FFCE56"
			]
		}]
	};

	//pie chart 1
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


	//pie chart 1
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

});