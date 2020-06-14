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
	var colors = new Map();
	$.getJSON("data/news.json", function(rawData) {
		var data = splitData(rawData[0]);
		var option = {
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
				data: ['累计确诊', '累计治愈', '累计死亡']
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
				// name:"时间",
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
				
			},
			yAxis: [{
				name:"累计人数",
				scale: true,
				splitNumber: 4,
                splitArea: {
                    show: false
                },
                splitLine:{
                    show:false
                }
			}, {
				name:"舆情数量",
				scale: true,
                splitArea: {
                    show: false
                },
                splitLine:{
                    show:false
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
					name: '累计确诊',
					type: 'line',
					yAxisIndex: 0,
					data: calculateMA(0, data),
					showSymbol: false,
					smooth: true,
					z:999
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: '累计治愈',
					type: 'line',
					yAxisIndex: 0,
					showSymbol: false,
					data: calculateMA(1, data),
					smooth: true,
					z:999
					// lineStyle: {
					// 	opacity: 0.3
					// }
				},
				{
					name: '累计死亡',
					type: 'line',
					yAxisIndex: 0,
					showSymbol: false,
					data: calculateMA(2, data),
					smooth: true,
					z:999
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
			colors.set(rawData[1][i].name, nColors[i]);
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
			colors.set(rawData[2][i].name, rColors[i]);
			option.legend[1].data.push(rawData[2][i].name);
		}
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
		window.addEventListener('resize', function() {
			myChart.resize();
		})
		myChart.on('click', function(params){
			var time = params.data.time;
			var nodes = [];
			for (var k = 1; k <= 2; k++){
				for (var i = 0; i < rawData[k].length; i++){
					for (var j = 0; j < rawData[k][i].data.length; j++){
						var r = rawData[k][i].data[j];
						if (r.time == time){
							nodes.push(r);
						}
					}
				}
			}
			var keyWords = [];
			keyWords = findComWords(nodes);	
			var comWords = [];
			comWords =findComByNum(keyWords, nodes.length)
			// console.log(comWords)
			creatKnTable(nodes, comWords);
			
		})
		myChart.on('datazoom', function(params) {
				startValue = myChart.getOption().dataZoom[0].startValue;
				endValue = myChart.getOption().dataZoom[0].endValue;
				var timeData = []
				for (var i = startValue; i <= endValue; i++){
					timeData.push(data.categoryData[i]);
				}
				var runumounsData = []
				for (var i = 0; i < rawData[2].length; i++){
					for (var j = 0; j < rawData[2][i].data.length; j++){
						var r = rawData[2][i].data[j];
						if (timeData.indexOf(r.time) != -1){
							runumounsData.push(r.name);
						}
					}
				}
				$.get('data/similarity.json', function (d) {
					// var newsData = [];
					var nodeName = [];
					var links = [];
					var forbidSource = ["r_296", "r_252", "r_349", "r_153", "r_119", "r_54", "r_206"]
					d.links.forEach(function(link){
						if (link.value > 0.7 &&  link.value < 0.95 
						&& forbidSource.indexOf(link.source) == -1){
							links.push(link);
						}
					})
					links.forEach(function(link){
						if (runumounsData.indexOf(link.source) != -1 &&
						runumounsData.indexOf(link.target) == -1){
							runumounsData.push(link.target);
							nodeName.push(link.target)
						}
						nodeName.push(link.source)
					});
					var nodes = [];
					var categories = [];
					var categories_name = [];
					var reColor = []
					var nodes_name = [];
					d.nodes.forEach(function(node){
						if (runumounsData.indexOf(node.name) != -1
						&& nodeName.indexOf(node.name) != -1){
							node.symbolSize = 10
							node.draggable = true;
							if (node.name[0] != 'n'){
								links.forEach(function(link){
									if (node.name == link.source ||
									node.name == link.target){
										if (node.symbolSize <= 80){
											node.symbolSize += 5;
										}
									}
								});
							}
							
							nodes.push(node);
							nodes_name.push(node.name);
							
							if (categories.indexOf(node.category) == -1){
								// if (node.name[0] == 'n'){
								// 	categories[0].push(node.category);
								// }else{
								// 	categories[1].push(node.category);
								// }
								categories.push(node.category);
								categories_name.push({
									name: node.category
								})
								reColor.push(colors.get(node.category))
							}
						}
					});
					var rData = {
						categories: categories,
						categories_name: categories_name,
						links: links,
						nodes: nodes,
						color: reColor,
						nodes_name: nodes_name
					}
					// console.log(rData)
					drawNodeMatrix(1, rData);
				});
				
		});
	})
}
