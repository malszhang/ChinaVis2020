var heat_padding = {
    left: 40,
    top: 5,
    bottom: 5,
    right: 5
};
var i = 0;
var rootData;
var yRange = [];
var yDomain = [];
$(document).ready(function () {
    let width = document.getElementById("heatMap").offsetWidth - heat_padding.left - heat_padding.right;
    let height = document.getElementById("heatMap").offsetHeight - heat_padding.top - heat_padding.bottom;
    let svg = d3.select("#heatMap")
        .append("svg")
        .attr("height", height + heat_padding.top + heat_padding.bottom)
        .attr("width", width + heat_padding.left + heat_padding.right)
        .attr('class', 'heat_svg')
        .attr('id', 'heat_svg')
        .append("g")
        .attr("transform", "translate(" + heat_padding.left + "," + heat_padding.top + ")")
        .attr("id", "tree_g");
    d3.json("data/province.json", function (error, treeData) {
        drawHeatMap_tree(treeData, width, height);
    });
});
// 绘制省份树图
function drawHeatMap_tree(treeData, width, height) {
    let tree = d3.tree()
        .size([height, width]);

    let root = d3.hierarchy(treeData, function (d) {
        return d.children;
    });
    rootData = tree(root);
    root._x = height / 2;
    root._y = heat_padding.left;
    update_tree(root);
}
// 绘制、更新树图
function update_tree(source) {
    let svg = d3.select("#tree_g");

    let nodes = rootData.descendants(),
        links = rootData.descendants().slice(1);

    nodes.forEach(function (d) {
        d.y = d.depth * 100;
    });

    //  ***********节点绘制*********   
    let node = svg.selectAll("g.node")
        .data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });
    // ********新增加的节点*********
    let nodeEnter = node.enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + source._y + "," + source._x + ")";
        })
        .on("click", click);

    nodeEnter.append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            if (!d.children) {
                yRange.push(d.x);
                yDomain.push(d.data.name);
                return 3;
            }
            return 5;
        })
        .style("fill", "#fff");

    nodeEnter.append("text")
        // .attr("y", function (d) {
        //     return d.y;
        //     // return d.children || d._children ? -18 : 18;
        // })
        .attr("dy", ".35em")
        .attr("dx", function (d) {
            if (!d.children) return "1em";
            return "-1em";
        })
        .attr("text-anchor", function (d) {
            if (!d.children) return "start";
            return "end";
        })
        .text(function (d) {
            return d.data.name;
        })
        .style("fill-opacity", 1);

    // ************新增节点动画过渡*********
    let nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
        .duration(750)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("node.circle")
        .style("fill", "#fff")
        .attr("r", function (d) {
            if (!d.children) return 3;
            return 5;
        });

    // ***********删除的节点********
    let nodeExit = node.exit().transition()
        .duration(750)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.selectAll("node.circle")
        .attr("r", 1e-6);

    nodeExit.selectAll("node.text")
        .style("fill-opacity", 1e-6);

    //  ***********连线绘制*********
    let link = svg.selectAll('path.link')
        .data(links, function (d) {
            return d.id;
        });
    // **************新增的连线************
    let linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function (d) {
            var o = {
                x: source._x,
                y: source._y
            };
            return diagonal(o, o);
        });

    var linkUpdate = linkEnter.merge(link);
    // ***********连线动画过渡*******
    linkUpdate.transition()
        .duration(750)
        .attr('d', function (d) {
            return diagonal(d, d.parent);
        });
    // ************删除的连线************
    var linkExit = link.exit().transition()
        .duration(750)
        .attr('d', function (d) {
            var o = {
                x: source.x,
                y: source.y
            }
            return diagonal(o, o);
        })
        .remove();
    // ************保存当前节点的坐标***********
    nodes.forEach(function (d) {
        d._x = d.x;
        d._y = d.y;
    });
    let heat_g = document.getElementById('heat_g');
    if (!heat_g) {
        drawHeatMap_heat('1');
    }
}
// 树图连线
function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path;
}
// 树图点击进行收放
function click(d) {
    let flag; //false 合并 true 分开
    let heatData = [];
    if (d.children) {
        flag = false;
        copyData(d.children, heatData)
        d._children = d.children;
        d.children = null;
    } else {
        flag = true;
        d.children = d._children;
        d._children = null;
        copyData(d.children, heatData)
    }
    update_tree(d);
    update_heat(heatData, flag);
}

var testHeatDate = [];
getTestData();
async function getTestData() {
    await $.getJSON('data/province.json', function (data) {
        let province = data.children;
        for (let i = 0; i < province.length; ++i) {
            for (let j = 0; j < province[i].children.length; ++j) {
                let dateData = [];
                for (let index = 1; index <= 30; ++index) {
                    dateData.push({
                        date: '2020/1/' + index,
                        num: parseInt(Math.random() * 20)
                    })
                }
                testHeatDate.push({
                    province: province[i].children[j].name,
                    date: dateData
                });
            }
        }
    });
}

function drawHeatMap_heat(data) {
    let marginLeft = document.getElementById('tree_g').getBoundingClientRect().top + heat_padding.left * 1;
    let heat_g = d3.select(".heat_svg")
        .append('g')
        .attr("transform", "translate(" + marginLeft + "," + heat_padding.top + ")")
        .attr("id", "heat_g");

    let yScale = d3.scaleOrdinal()
        .domain(yDomain)
        .range(yRange);

    let heatWidth = d3.select('#heat_svg').attr('width') - marginLeft;

    let xDomain = getXDomain(testHeatDate);
    let xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, heatWidth]);

    for (let i = 0; i < testHeatDate.length; ++i) {
        let rect = heat_g.selectAll('.'+ testHeatDate[i].province)
            .data(testHeatDate[i].date)
            .enter()
            .append('rect')
            .attr('class',testHeatDate[i].province)
            .attr('x', function (d) {
                return heat_padding.left * 1.5 + xScale(d.date);
            })
            .attr('y', function (d) {
                return yScale(testHeatDate[i].province) - 3.5;
            })
            .attr('width', 7)
            .attr('height', 7)
            .style('stroke', 'black')
            .style('fill', 'blue');
    }
}

function update_heat(data, flag) {
    let heat_g = d3.select("#heat_g");


    console.log(data);
}

function getXDomain(data) {
    let xDomain = [];
    date = data[0].date;
    for (let i = 0; i < date.length; ++i) {
        xDomain.push(date[i].date);
    }
    return xDomain;
}

function copyData(oldData, newData) {
    for (let i = 0; i < oldData.length; ++i) {
        newData.push({
            name: oldData[i].data.name,
            parent: oldData[i].data.parent
        });
    }
}

[{
        "province": '北京',
        'date': [{
                'date': '2019/12/1',
                'num': 0
            },
            {
                'date': '2019/12/2',
                'num': 0
            }
        ]
    },
    {
        "province": '山西',
        'date': [{
                'date': '2019/12/1',
                'num': 0
            },
            {
                'date': '2019/12/2',
                'num': 0
            }
        ]
    }
]