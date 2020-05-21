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
function calculateMA(line, data) {
	var result = [];
	for (var i = 0; i < data.values.length; i++) {
		result.push(data.values[i][line]);
	}
	return result;
}
//获取长度
function getLength(obj){
　　return obj.size　
}
/**
 * 绘制趋势曲线
 */
function drawTendency() {
	var dom = document.getElementById('tendency');
	var myChart = echarts.init(dom);
	var newsColors = new Map();
	var renumousColors = new Map();
	// var nColors = ["#AEADCD", "#A5C0D0", "#ADCAC8", "#B5D4C2"];
	var nColors = ['#74add1', '#313695', '#4575b4', '#abd9e9']
	// var rColors = ["#E9B9A7", "#E99E9A", "#A9272C", "#DCB1B8"];
	var rColors = ['#fee090','#d73027', '#fdae61', '#f46d43'];
	$.getJSON("data/news.json", function(rawData) {
		var data = splitData(rawData[0]);
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
				formatter: function(obj) {
					var str = "";
					var len = 3 > obj.length ? obj.length : 3;
					for (var i = 0; i < len; i++) {
						if (obj[i].seriesType == "line") {
							str += obj[i].seriesName + "：" + obj[i].value + "<br>"
						}
					}
					// console.log(obj[0])
					return str;
				}
			},
			legend: [{
				data: ['新增确诊', '新增治愈', '新增死亡']
			},
			{
				orient: 'vertical',
				left: "right",
				top: "center",
				data: []
			}],
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
				splitNumber: 20
			},
			yAxis: [{
				scale: true,
				splitArea: {
					show: true
				}
			}, {
				scale: true,
				splitArea: {
					show: true
				}
			}],
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
					name: '新增确诊',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(0, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: '新增治愈',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(1, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: '新增死亡',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(2, data),
					smooth: true,
					// lineStyle: {
					// 	opacity: 0.3
					// }
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
		for (var i = 0; i < rawData[1].length; i++){
			option.series.push({
				name: rawData[1][i].name,
				type: 'scatter',
				yAxisIndex: 1,
				stack: '总量',
				data: rawData[1][i].data,
				label: {
					show: false
				},
				color: nColors[i]
			})
			option.legend[1].data.push(rawData[1][i].name);
		}
		for (var i = 0; i < rawData[2].length; i++){
			option.series.push({
				name: rawData[2][i].name,
				type: 'scatter',
				yAxisIndex: 1,
				stack: '总量',
				data: rawData[2][i].data,
				label: {
					show: false
				},
				color: rColors[i]
			})
			option.legend[1].data.push(rawData[2][i].name);
		}
		console.log(rawData[1].length)
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
		window.addEventListener('resize', function() {
			myChart.resize();
		})
	})
}
