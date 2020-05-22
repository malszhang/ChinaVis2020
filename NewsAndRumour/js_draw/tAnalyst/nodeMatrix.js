function splitDiv(divNum) {
    let html = '';
    let rowNum = Math.ceil(divNum / 2);
    let height = document.getElementById("nodeMatrix").offsetHeight;
    $("#nodeMatrix").css({"height":height});
    let cellHeight = (height - 20) / 2;
    if(rowNum == 1) cellHeight = height - 20;
    index = 0;
    for (let i = 0; i < rowNum; ++i) {
        let row = '<el-row :gutter="8" style="margin:5px">';
        for (let j = 0; j < 2; ++j) {
            if(rowNum == 1){
                row += '<el-col :span="24" style="">';
            }
            else row += '<el-col :span="12" style="">';
            row += '<div class="grid-content-header grid-content3 bg-purple" style="border:0px;height:' + cellHeight + '" id="node-' + index + '"></div>';
            row += '</el-col>';
            index++;
            if(index >= divNum) break;
        }
        row += '</el-row>';
        html += row;
        if(index >= divNum) break;
    }
    $("#nodeMatrix").html(html);
    new Vue({
        el: "#nodeMatrix",
    });
}

function drawNodeMatrix(dataNum, data) {
    // splitDiv(dataNum);
    for(let i = 0;i<dataNum;++i){
        let dom = document.getElementById("nodeMatrix");
        let myChart = echarts.init(dom);
        drawNode(data, myChart);
    }
}

function drawNode(webkitDep, myChart) {
    var nColors = ['#74add1', '#313695', '#4575b4', '#abd9e9','#fee090','#d73027', '#fdae61', '#f46d43'];
    option = {
		color:webkitDep.color,
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {
    		formatter: function(obj) {
    			// console.log(obj)
    			return obj.data.text
    		}
    	},
		legend:[
			{
				data: webkitDep.categories
			}
		],
        animation: false,
        series : [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: webkitDep.nodes,
                links: webkitDep.links,
    			categories: webkitDep.categories_name,
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
                    repulsion: 50
                },
    			focusNodeAdjacency: true,
            }
        ]
    };
    myChart.setOption(option);
}