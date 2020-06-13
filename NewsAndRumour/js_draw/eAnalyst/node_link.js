function drawNode(data) {
    let dom = document.getElementById("node_link");
    let myChart = echarts.init(dom);
	var legendData = divideCate(data.categories);
	option = {
		color:data.color,
        tooltip: {
    		formatter: function(obj) {
    			// console.log(obj)
				var str = "";
				if (obj.dataType == "node"){
					str = "时间: "+obj.data.time+"<br>"+				
				       "内容: "+obj.data.text+ "<br>"+
					   "类型: "+obj.data.category+ "<br>";
				}
    			return str
    		}
    	},
		legend:[
			{
				orient: 'vertical',
				left: "left",
				top: "center",
				data: legendData[0]
			},
			{
				orient: 'vertical',
				right: "right",
				top: "center",
				data: legendData[1]
			}
		],
        animation: false,
        series : [
            {
                // name: 'Les Miserables',
				// gridIndex: 0,
                type: 'graph',
                layout: 'force',
                data: data.nodes,
                links: data.links,
    			categories: data.categories_name,
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
					initLayout:"circular",
                    repulsion: 50
                },
    			focusNodeAdjacency: true,
            }
        ]
    };
    myChart.setOption(option);
	window.addEventListener('resize', function() {
		myChart.resize();
	})
}