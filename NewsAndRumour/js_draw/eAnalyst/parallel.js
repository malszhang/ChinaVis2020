var para_padding = {
    left: 40,
    top: 20,
    bottom: 5,
    right: 5
};
var yScale = {};
var xScale;
/**
 * 平行坐标绘制
 * @param {*} data 
 */
function drawParallel(data) {
    // console.log(data);
    let para_height = document.getElementById('parallelChart').offsetHeight - para_padding.top - para_padding.bottom;
    let para_width = document.getElementById('parallelChart').offsetWidth - para_padding.left - para_padding.right;
    // 设置svg
    let svg = d3.select('#parallelChart')
        .append('svg')
        .attr('class', 'para_svg')
        .attr('width', para_width + para_padding.left + para_padding.right)
        .attr('height', para_height + para_padding.top + para_padding.bottom);

    var line = d3.line();

    let xDomain = Object.keys(data[0]);
    xDomain.splice(0, 3);

    xScale = d3.scalePoint()
        .domain(xDomain)
        .range([para_padding.left, para_width - para_padding.right], 1);

    xDomain.forEach(d => {
        yScale[d] = d3.scaleLinear()
            .domain(d3.extent(data, p => {
                return +p[d];
            }))
            .range([para_height, para_padding.top]);
    });

    let labels = svg.selectAll('.label')
        .data(xDomain)
        .enter()
        .append('text')
        .attr('transform', d => {
            return 'translate('+ xScale(d) + ',' + para_padding.top +')';
        })
        .attr('dx', -10)
        .attr('dy', -8)
        .style("text-anchor", "middle")
        .style('font-size', 10)
        .text(d => {
            return d;
        });

    let backgroud = svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'backgroud')
        .attr('d', path)
        .style("stroke", function (d, i) {
            return "#ccc";
        })
        .style("opacity", 0.5)
        .style("fill", "none");

    let foreground = svg.append('g')
        .selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('class', 'foreground')
        .attr('d', path)
        .style("stroke", function (d, i) {
            // console.log(d);
            return getColor(d);
        })
        .style("opacity", 0.5)
        .style("fill", "none");

    let gaxis = svg.selectAll('.dimensions')
        .data(xDomain)
        .enter()
        .append('g')
        .attr('class', 'dimensions')
        .attr('d', 'dimension')
        .attr('transform', d => {
            return 'translate(' + xScale(d) + ', 0)';
        });

    gaxis.append('g')
        .each(function (d) {
            d3.select(this).call(d3.axisLeft(yScale[d]).ticks(5));
        });

    gaxis.append('g')
        .attr('class', d => {
            return 'brush-' + d;
        })
        .attr('id', 'brush')
        .each(function (d) {
            d3.select(this).call(
                d3.brushY()
                .extent([
                    [-10, 0],
                    [10, para_height]
                ])
                .on('end', brushEnd)
            )
        });

    function path(d) {
        return line(xDomain.map(function (p) {
            return [xScale(p), yScale[p](d[p])];
        }));
    }
}

function brushEnd() {
    var brushs = d3.selectAll("#brush")._groups[0];
    var extents = [];
    var selectName = [];
    for (var i = 0; i < brushs.length; ++i) {
        extents.push(d3.brushSelection(brushs[i]))
    }
    d3.selectAll(".foreground")
        .style("display", function (d) {
            var flag = true;
            brushs.forEach(function (p, i) {
                var name = p.getAttribute("class").split("-")[1];
                if (extents[i] == null) {
                    flag = flag && true;
                } else if (extents[i][0] <= yScale[name](d[name]) && yScale[name](d[name]) <= extents[i][1]) {
                    flag = flag && true;
                } else flag = flag && false;
            });
            if (flag == true) {
                selectName.push(d.title);
                return null;
            } else return "none";
        });
    para_brush(selectName);
}