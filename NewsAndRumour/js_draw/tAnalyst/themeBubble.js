var theme_padding = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5
};
var themeWidth;
var themeHeight;

var thisColor = ['#74add1', '#313695', '#4575b4', '#abd9e9', '#fee090', '#d73027', '#fdae61', '#f46d43'];
var cate = ['行业战疫', '境内疫情', '境外疫情', '政府行动', '辟谣', '事实', '误区', '谣言'];
//颜色比例尺
var themeColor = d3.scaleOrdinal()
    .domain(cate)
    .range(thisColor);
/**
 * 定义大的布局即每个气泡的位置、数据转换及绘制
 * @param {*} root 原始数据
 */
function drawThemeBubble(root) {
    themeWidth = document.getElementById("themeBubble").offsetWidth - theme_padding.left - theme_padding.right;
    themeHeight = document.getElementById("themeBubble").offsetHeight - theme_padding.top - theme_padding.bottom;
    d3.select('#theme_svg').remove();

    let svg3 = d3.select("#themeBubble")
        .append("svg")
        .attr("id", "theme_svg")
        .attr("width", themeWidth)
        .attr("height", themeHeight)
        .attr("transform", "translate(" + theme_padding.left + "," + theme_padding.top + ")");

    let pack = d3.pack()
        .size([themeWidth, themeHeight])
        .padding(5);

    root.children.forEach(function (d) {
        d.sum = d3.sum(d.weight, function (p) {
            return +p.num;
        });

    });

    let data = d3.hierarchy(root)
        .sum(function (d) {
            return d.sum;
        });

    let nodes = pack(data).descendants();

    d3.select("#theme_svg").append('g')
        .attr('class', 'allBubble')
        .attr('transform', 'translate(' + theme_padding.left + ',' + theme_padding.top + ')');

    for (let i = 1; i < nodes.length; ++i) {
        drawBubblePie(nodes[i]);
    }
}
/**
 * 绘制每一个气泡
 * @param {*} data 
 */
function drawBubblePie(data) {
    // 定义饼图布局
    let arc = d3.arc()
        .outerRadius(data.r)
        .innerRadius(0);

    let pie = d3.pie().value(function (p) {
        return p.num;
    });
    
    let bubble = d3.select('.allBubble')
        .append('g')
        .attr('class', 'bubble-' + data.data.name)
        .attr('transform', 'translate(' + data.x + ',' + data.y + ')');

    bubble.append('svg:title')
        .text(function () {
            return data.data.name + ':' + data.data.sum;
        });

    let pies = bubble.selectAll('.arc')
        .data(pie(data.data.weight))
        .enter()
        .append('path')
        .style('fill', function (d) {
            return themeColor(d.data.cate);
        })
        .attr("d", function (d) {
            return arc(d);
        })
        .transition()
        .duration(750)
        .attrTween('d', function (d, i) {
            let fn = d3.interpolateObject({
                endAngle: d.startAngle
            }, d)
            return function (i) {
                return arc(fn(i))
            }
        })
        .style('fill', function (d) {
            return themeColor(d.data.cate);
        });

    bubble.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function () {
            let strLen = data.data.name.length;
            return data.data.name.substring(0, data.r / strLen);
        })
        .style("font-size", function () {
            let strLen = data.data.name.length;
            return parseInt(data.r / strLen) * 1.3;
        })
        .style('fill-opacity',0)
        .transition()
        .duration(750)
        .style('fill-opacity',1);
}


function bubble_click(d) {
    console.log(d.data);
}