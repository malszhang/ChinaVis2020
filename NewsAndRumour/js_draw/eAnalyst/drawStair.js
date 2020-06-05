function drawStair(idName, title, data, time, line) {
	var dom = document.getElementById(idName);
	var myChart = echarts.init(dom);
	// var xAxisData = [];
	// var data1 = [];
	// var data2 = [];
	// for (var i = 0; i < 100; i++) {
	//     xAxisData.push('类目' + i);
	//     data1.push({name:i, value:['类目' + i, (Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5]});
	//     data2.push({name:i, value:['类目' + i, (Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5]});
	// }
	// for (var i = 0; i < 100; i++) {
	//     xAxisData.push('类目' + i);
	//     data1.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
	//     data2.push((Math.sin(i / 5) * (i / 5 -10) + i / 6) * 5);
	// }
	option = {
		// color:["red"],
		title: {
			text: title
		},
		legend: {
			data: ["每日新增"]
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
						str += "新增人数：" + d.data[1] + "<br>"
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
			min:-15148,
			max: 15148,
			show: false
		},{
			min: -2,
			max: 2,
			show: false
		}],

		series: [
				{
				name: "每日新增",
				type: "line",
				smooth: true,
				data: line,
				yAxisIndex: 0,
				animationDelay: function(idx) {
					return idx * 10 + 100;
				}
			},
		],
		animationEasing: 'elasticOut',
		animationDelayUpdate: function(idx) {
			return idx * 5;
		}
	};
	data.forEach(function(d) {
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
		// })
		// option.series.push({
		// 	name: d.name,
		// 	type: 'scatter',
		// 	data: d.data,
		// 	symbol: 'circle',

		// 	itemStyle: {
		// 		color: '#fff',
		// 		borderWidth: 2,
		// 		borderColor: '#f00'
		// 	},
		// 	// symbolSize: 10,
		// 	animationDelay: function(idx) {
		// 		return idx * 10 + 100;
		// 	}
		// })
	})
	if (option && typeof option === "object") {
		myChart.setOption(option, true);
	}
	window.addEventListener('resize', function() {
		myChart.resize();
	})
}
