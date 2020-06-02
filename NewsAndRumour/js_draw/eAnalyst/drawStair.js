function drawStair(idName, title, data, time) {
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
			data: []
		},
		toolbox: {
			// y: 'bottom',
			feature: {
				magicType: {
					type: ['stack', 'tiled']
				},
				dataView: {},
				saveAsImage: {
					pixelRatio: 2
				}
			}
		},
		tooltip: {},
		xAxis: {
			data: time,
			splitLine: {
				show: false
			}
		},
		yAxis: {},
		series: [],
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
			barGap: 0,
			barWidth: 10,
			animationDelay: function(idx) {
				return idx * 10 + 100;
			}
		})
		// })
		option.series.push({
			name: d.name,
			type: 'scatter',
			data: d.data,
			symbol: 'circle',

			itemStyle: {
				color: '#fff',
				borderWidth: 2,
				borderColor: '#f00'
			},
			// symbolSize: 10,
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
