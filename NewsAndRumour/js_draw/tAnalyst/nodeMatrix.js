function splitDiv(divNum) {
    let html = '';
    let rowNum = Math.sqrt(divNum);
    console.log(rowNum);
    var height = document.getElementById("nodeMatrix").offsetHeight;
    let cellHeight = (height - 48) / rowNum;
    for (let i = 0; i < rowNum; ++i) {
        let row = '<el-row :gutter="16">';
        for (let j = 0; j < rowNum; ++j) {
            row += '<el-col :span="' + 24 / rowNum + '">';
            row += '<div class="grid-content-header grid-content3 bg-purple" style="height:' + cellHeight + '" id="' + i + '-' + j + '"></div>';
            row += '</el-col>';
        }
        row += '</el-row>';
        html += row;
    }
    $("#nodeMatrix").html(html);
    new Vue({
        el: "#nodeMatrix",
    });
}

function drawNodeMatrix() {
    let dom = document.getElementById('0-0');
    let myChart = echarts.init(dom);
    $.getJSON("../tAnalyst/data/nodeData.json", function (data) {
        drawNode(data, myChart);
    });

}

function drawNode(webkitDep, myChart) {
    let option = {
        legend: {
            data: ['网格关系'] //此处的数据必须和关系网类别中name相对应  
        },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                normal: {
                    show: true,
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