var theme_padding = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5
};

$(document).ready(function () {
    let width = document.getElementById("themeBubble").offsetWidth - theme_padding.left - theme_padding.right;
    let height = document.getElementById("themeBubble").offsetHeight - theme_padding.top - theme_padding.bottom;
    let svg3 = d3.select("#themeBubble")
        .append("svg")
        .attr("id", "theme_svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("data/themeBubble.json", function (error, root) {
        // 定义布局方式
        let pack = d3.pack()
            .size([width, height])
            .padding(2);

        let data = d3.hierarchy(root)
            .sum(function (d) {
                return d.weight;
            });
        let nodes = pack(data).descendants();
        drawThemeBubble(nodes, pack);
    })
});


function drawThemeBubble(nodes, pack) {
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let bubbles = d3.select("#theme_svg").selectAll(".bubble")
        .data(nodes)
        .enter()
        .filter(function (d) {
            return !d.children;
        })
        .append("g")
        .attr("class", "bubble")
        .on("click",bubble_click);

    bubbles.append("circle")
        .style("fill", function (d, i) {
            return color(i);
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
        })
        .append("svg:title")
        .text(function(d){
            return d.data.name + ":" + d.data.weight;
        });

    bubbles.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .text(function (d) {
            return d.data.name.substring(0, d.r / 3);
        })
        .style("font-size",function(d){
            // 这里需要更一步的计算
            return d.r / 2.5;
        });
}

function bubble_click(d){
    
}