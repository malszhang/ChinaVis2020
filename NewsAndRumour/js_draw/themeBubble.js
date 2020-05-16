var theme_padding = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5
};
$(document).ready(function () {
    var width = document.getElementById("themeBubble").offsetWidth - theme_padding.left - theme_padding.right;
    var height = document.getElementById("themeBubble").offsetHeight - theme_padding.top - theme_padding.bottom;
    var svg3 = d3.select("#themeBubble")
        .append("svg")
        .attr("id", "theme_svg")
        .attr("width", width)
        .attr("height", height);
    var pack = d3.layout.pack()
        .size([width, height])
        .sort(null)
        .value(function (d) {
            return d.weight;
        })
        .padding(2);
    d3.json("../../data/themeBubble.json", function (error, root) {
        drawThemeBubble(root, pack);
    })
});


function drawThemeBubble(root, pack) {
    var nodes = pack.nodes(root);
    var color = d3.scale.category20c();
    var bubbles = d3.select("#theme_svg").selectAll(".bubble")
        .data(nodes.filter(function (d) {
            return !d.children;
        }))
        .enter()
        .append("g")
        .attr("class", "bubble");

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
        });

    bubbles.append("text")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .text(function (d) {
            return d.name;
        });
}