function textLayout(text){
	var result = "";
	if (text){
		for (var i = 0; i < text.length; i++){
			if (i % 40 == 0){
				result += "<br>"
			}
			result += text[i];
		}
	}
	return result
}
function pullByDepth(depth, data, num){
	var resultData = data;
	for (var i = 0; i < num; i++){
		resultData.unshift({
			name: "k"+depth+"_"+i,
			depth: depth,
			itemStyle: {
				opacity: 0
			}
		});
	}
	return resultData
}
function drawStair(idName, data) {
	var dom = document.getElementById(idName);
	var myChart = echarts.init(dom);
	
	// console.log(data.nodes)
	// data.nodes = pullByDepth(0, data.nodes, 100);
	// data.nodes = pullByDepth(2, data.nodes, 280);
	// console.log(data.nodes)
	// ['#74add1', '#313695', '#4575b4', '#abd9e9', 
	// '#fee090', '#d73027', '#fdae61', '#f46d43'];
	option = {
		// title:{
		// 	text: "特定主题分析"
		// },
		tooltip: {
			trigger: 'item',
			triggerOn: 'mousemove',
			 position: ['50%', '50%'],
			formatter:function(params){
				if (params.dataType != "edge"){
					if (params.data.name[0] == 'k'){
						return;
					}
					return params.data.time+" "+textLayout(params.data.text);
				}else{
					// console.log(params)
					
					return params.data.source
				}
			}
		},
		animation: false,
		series: [{
			type: 'sankey',
			right: '1%',
			left: '1%',
			// focusNodeAdjacency: 'allEdges',
			data: data.nodes,
			links: data.links,
			nodeGap: 2,
			// nodeAlign: "left",
			orient: 'vertical',
			levels: [{
				depth: 0,
				itemStyle: {
					color: '#4575b4'
				},
				lineStyle: {
					color: 'target',
					// opacity: 0.6
				}
			}, {
				depth: 1,
				itemStyle: {
					color: '#abd9e9'
				},
				lineStyle: {
					color: 'target',
					// opacity: 0.6
				}
			}, {
				depth: 2,
				// itemStyle: {
				// 	color: '#d73027'
				// },
				lineStyle: {
					color: 'target',
					opacity: 0.6
				}
			}],
			label: {
				position: 'top',
				show: false
			}
		}]
	}
	if (option && typeof option === "object") {
		myChart.setOption(option, true);
	}
	window.addEventListener('resize', function() {
		myChart.resize();
	})
}
