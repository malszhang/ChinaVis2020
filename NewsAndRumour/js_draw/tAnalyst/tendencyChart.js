function splitData(rawData) {
	var categoryData = [];
	var values = [];
	for (var i = 0; i < rawData.length; i++) {
		categoryData.push(rawData[i].splice(0, 1)[0]);
		values.push(rawData[i])
	}
	return {
		categoryData: categoryData,
		values: values
	};
}

function randomDatas(data) {
	var newData = [];
	for (var i = 0; i < data.values.length; i++) {
		newData.push(Math.round(Math.random() * data.values[i][0]));
	}
	return newData;
}
/**
 *
 * @param dayCount
 * @returns {Array}
 */
function calculateMA(line,data) {
	var result = [];
	for (var i = 0; i < data.values.length; i++) {
		result.push(data.values[i][line]);
	}
	return result;
}

/**
 * 绘制趋势曲线
 */
function drawTendency() {
	var dom = document.getElementById('tendency');
	var myChart = echarts.init(dom);

	$.getJSON("data/news.json", function(rawData) {
		var data = splitData(rawData[0]);
		var datas = randomDatas(data);
		var links = datas.map(function(item, i) {
			return {
				source: i,
				target: i + 1
			};
		});
		links.pop();
		var option = {
			title: {
				text: 'demo',
				left: 0
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross'
				},
				formatter: function(obj){
					var str = "";
					var len = 3 > obj.length? obj.length: 3;
					for (var i = 0; i < len; i++){
						if (obj[i].seriesType == "line"){
							str += obj[i].seriesName + "：" +obj[i].value + "<br>"
						}
					}
					// console.log(obj[0])
					return str;
				}
			},
			legend: {
				data: ['Confirmed', 'Recovered', 'Deaths', 'News', 'Rumour']
			},
			grid: {
				left: '10%',
				right: '10%',
				bottom: '15%'
			},
			xAxis: {
				type: 'category',
				data: data.categoryData,
				scale: true,
				boundaryGap: false,
				axisLine: {
					onZero: false
				},
				splitLine: {
					show: false
				},
				splitNumber: 20,
				min: 'dataMin',
				max: 'dataMax'
			},
			yAxis: [{
				scale: true,
				splitArea: {
					show: true
				}
			},{
				scale: true,
				splitArea: {
					show: true
				}}],
			dataZoom: [{
					type: 'inside',
					start: 0,
					end: 50
				},
				{
					show: true,
					type: 'slider',
					top: '90%',
					start: 50,
					end: 100
				}
			],
			series: [{
					name: 'Confirmed',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(0, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: 'Recovered',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(1, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: 'Deaths',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(2, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
				}, {
					name: "News",
					type: 'scatter',
					yAxisIndex: 1,
					stack: '总量',
					data: rawData[1],
					label: {
						show: false
					}
				},
				{
					name: "Rumour",
					type: 'scatter',
					yAxisIndex: 1,
					stack: '总量',
					data: rawData[2],
					label: {
						show: false
					}
				}
				// {
				//     name:'demo',
				//     type: 'graph',
				//     layout: 'none',
				//     coordinateSystem: 'cartesian2d',
				//     symbolSize: 40,
				//     label: {
				//         show: true
				//     },
				//     edgeSymbol: ['circle', 'arrow'],
				//     edgeSymbolSize: [4, 10],
				//     data: datas,
				//     links: links,
				//     lineStyle: {
				//         color: '#2f4554'
				//     }
				// }
			]
		};
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
		window.addEventListener('resize', function() {
			myChart.resize();
		})
	})
}
