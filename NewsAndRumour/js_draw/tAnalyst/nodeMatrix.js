function splitDiv(divNum) {
    let html = '';
    let rowNum = Math.ceil(divNum / 2);
    let height = document.getElementById("nodeMatrix").offsetHeight;
    $("#nodeMatrix").css({"height":height});
    let cellHeight = (height - 20) / 2;
    index = 0;
    for (let i = 0; i < rowNum; ++i) {
        let row = '<el-row :gutter="8" style="margin:5px">';
        for (let j = 0; j < 2; ++j) {
            row += '<el-col :span="12" style="">';
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
    splitDiv(dataNum);
    for(let i = 0;i<dataNum;++i){
        let dom = document.getElementById('node-' + i);
        let myChart = echarts.init(dom);
        drawNode(data, myChart);
    }
}

function drawNode(webkitDep, myChart) {
    let option = {
        legend: {
            left: 5,
            data: ['网格关系',"关系1", "关系2", "关系3",] //此处的数据必须和关系网类别中name相对应  
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                normal: {
                    show: false,
                    position: 'right'
                }
            },
            draggable: true,
            data: webkitDep.nodes.map(function (node, idx) {
                node.id = idx;
                return node;
            }),
            categories: webkitDep.categories,
            force: {
                edgeLength: 25, //连线的长度  
                repulsion: 20 //子节点之间的间距  
            },
            edges: webkitDep.links
        }]
    };
    myChart.setOption(option);
}