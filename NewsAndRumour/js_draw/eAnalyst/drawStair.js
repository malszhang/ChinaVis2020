function drawStair(idName, title, data) {
	var dom = document.getElementById(idName);
	var myChart = echarts.init(dom);
	var time = [];
	data[2].data.forEach(function(d){
		time.push(d[0]);
	})
	option = {
		// color:["red"],
		title: {
			text: title
		},
		legend: {
			data: ["每日新增", "每日舆情"]
		},
		tooltip: {
			trigger: 'axis',
			// axisPointer: {
			// 	type: 'cross'
			// },
			formatter: function(obj) {
				var str = "";
				obj.forEach(function(d) {
					if (d.seriesType != "line") {
						str += d.data.value[0] + "<br>";
						str += d.data.text + "<br>";
					}
					if (d.seriesType == "line") {
						str += d.seriesName + d.data[1] + "<br>"
					}

				})
				return str;
				// return str;
			}
		},
		xAxis: {
			data: time,
			// splitLine: {
			// 	show: false
			// },
			// show: false
		},
		// angleAxis: {
		// 	type: 'category',
		// 	data: time
		// },
		// grid: {
		// 	top: 100
		// },
		// polar: {
		// 	min: -1
		// },
		yAxis: [{
			// min:-15148,
			// max: 15148,
			show: false
		},{
			// min: -2,
			// max: 2,
			show: false
		}],

		series: [{
				name: "每日湖北新增",
				type: "line",
				smooth: true,
				data: data[2].data,
				yAxisIndex: 0,
				animationDelay: function(idx) {
					return idx * 10 + 100;
				}
			},{
				
			}],
		animationEasing: 'elasticOut',
		animationDelayUpdate: function(idx) {
			return idx * 5;
		}
	};
	var textData = [data[0], data[1]];
	textData.forEach(function(d) {
		option.legend.data.push(d.name);
		// d.forEach(function(t){
		option.series.push({
			name: d.name,
			type: 'bar',
			data: d.data,
			stack: 'a',
			// coordinateSystem: 'polar',
			yAxisIndex: 1,
			// barGap: 0,
			// barWidth: 10,
			animationDelay: function(idx) {
				return idx * 10 + 100;
			}
		})
	})
	if (option && typeof option === "object") {
		myChart.setOption(option, true);
	}
	window.addEventListener('resize', function() {
		myChart.resize();
	})
}
