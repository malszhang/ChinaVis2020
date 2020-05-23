var theme_padding = {
    top: 5,
    left: 5,
    bottom: 5,
    right: 5
};

$(document).ready(function () {
    
});

function drawThemeBubble(root) {
	let width = document.getElementById("themeBubble").offsetWidth - theme_padding.left - theme_padding.right;
	let height = document.getElementById("themeBubble").offsetHeight - theme_padding.top - theme_padding.bottom;
	let svg3 = d3.select("#themeBubble")
	    .append("svg")
	    .attr("id", "theme_svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("transform", "translate(" + theme_padding.left + "," + theme_padding.top + ")");
	let pack = d3.pack()
	        .size([width, height])
	        .padding(5);
	let data = d3.hierarchy(root)
	    .sum(function (d) {
	        return d.weight;
	    });
	
	let nodes = pack(data).descendants();
    let color = d3.scaleOrdinal(d3.schemeCategory20);

    let bubbles = d3.select("#theme_svg").selectAll(".bubble")
        .data(nodes)
        .enter()
        .filter(function (d) {
            return !d.children;
        })
        .append("g")
        .attr("class", "bubble")
        .on("click", bubble_click);

    bubbles.append("circle")
        .style("fill", function (d, i) {
            return color(i);
        })
        .style("stroke", function (d, i) {
            return color(i);
        })
        .attr("cx", function (d) {
            return width / 2;
        })
        .attr("cy", function (d) {
            return height / 2;
        })
        .attr("r", 1e-6)
        .append("svg:title")
        .text(function (d) {
            return d.data.name + ":" + d.data.weight;
        });

    bubbles.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .attr("x", function (d) {
            return width / 2;
        })
        .attr("y", function (d) {
            return height / 2;
        })
        .text(function (d) {
            return d.data.name.substring(0, d.r / 3);
        })
        .attr("font-size", 0);

    bubbles.selectAll("circle")
        .transition()
        .duration(750)
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", function (d) {
            return d.r;
        });

    bubbles.select("text")
        .transition()
        .duration(750)
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("font-size", function (d) {
            return d.r / 2.5;
        });

}

function bubble_click(d) {
    console.log(d.data);
    // let divNum = 7 * Math.random() + 3;
    // $.getJSON("../tAnalyst/data/nodeData.json", function (data) {
    //     drawNodeMatrix(divNum, data);
    // });
}