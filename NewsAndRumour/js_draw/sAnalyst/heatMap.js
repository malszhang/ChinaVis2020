var heat_padding = {
    left: 40,
    top: 5,
    bottom: 5,
    right: 5
};
var i = 0;
var rootData; //树图数据
var yRange = []; //y轴的值域 树图叶子节点的坐标
var yDomain = []; //y轴的定义域 每个省份的名称
var xDomain; //x轴的定义域 日期
var xScale; //x轴的比例尺
var yScale; //y轴的比例尺
var expandData = []; // 热力图分开时的数据
var heatColor = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43',
'#d73027', '#a50026'];
// var colorDomain = []; // 颜色的定义域 每省每日的舆情数值
var colorScale = d3.scaleOrdinal(); //热力图颜色的比例尺
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
/**
 * 定义树图的布局及计算节点
 * @param {*} treeData 树图的原始数据
 * @param {*} width svg的宽
 * @param {*} height svg的高
 */
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
/**
 * 绘制、更新树图
 * @param {*} source 更新的数据
 */
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
        $.getJSON('data/provinceCount.json', function (data) {
            drawHeatMap_heat(data);
        })
    }
}
/**
 * 树图连线
 * @param {*} s 
 * @param {*} d 
 */
function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path;
}
/**
 * 树图点击进行收放
 * @param {*} d 
 */
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
/**
 * 定义热力图相关的比例尺、位置并绘制
 * @param {*} data 所需的数据
 */
function drawHeatMap_heat(data) {
    let marginLeft = document.getElementById('tree_g').getBoundingClientRect().top + heat_padding.left * 1;
    let heat_g = d3.select(".heat_svg")
        .append('g')
        .attr("transform", "translate(" + marginLeft + "," + heat_padding.top + ")")
        .attr("id", "heat_g");

    // 定义Y轴比例尺    
    yScale = d3.scaleOrdinal()
        .domain(yDomain)
        .range(yRange);
    // 热力图左侧边框距离
    let heatWidth = d3.select('#heat_svg').attr('width') - 1.3 * marginLeft;

    // 定义X轴比例尺
    xDomain = getXDomain(data);
    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, heatWidth]);
    let colorDomain = getcolorDomain(data);
    colorScale.domain(colorDomain).range(heatColor);
    drawHeat(data, heat_g);
}

function drawHeat(data, heat_g) {
    // 计算连续的两个矩形之间的距离
    let rectWidth = xScale(data[0].date[1].date) - xScale(data[0].date[0].date);
    rectWidth = rectWidth * 0.7;

    for (let i = 0; i < data.length; ++i) {
        data[i]._date = [...data[i].date];
        let rect = heat_g.append('g')
            .attr('class', data[i].province)
            .selectAll('rect')
            .data(data[i].date)
            .enter()
            .append('rect')
            .attr('class', data[i].province)
            .attr('x', function (d) {
                return heat_padding.left * 1.5 + xScale(d.date);
            })
            .attr('y', function (d) {
                return yScale(data[i].province) - 3.5;
            })
            .attr('width', rectWidth)
            .attr('height', 7)
            .style('stroke', 'black')
            .style('fill', function (d) {
                if (d.num !== 0) {
                    return colorScale(d.num);
                } else return 'white';
            })
            .on('click', function (d) {
                if (d.num !== 0) {
                    let provinceDate = {
                        province: data[i].province,
                        date: d.date
                    };
                    drawAreaWord(provinceDate);
                    drawTreeMap(provinceDate);
                }
            })
            .append('svg:title')
            .text(function (d) {
                return data[i].province + '(' + d.date + '):' + d.num;
            });
    }
}
/**
 * 合并或者分开某一地域的矩形
 * @param {*} data 更新的数据
 * @param {*} flag 判断合并或分来
 */
function update_heat(data, flag) {
    let heat_g = d3.select("#heat_g");
    // 合并
    if (flag == false) {
        let mergeData = [];
        // 计算合并后矩形的起始Y坐标
        let yStart = d3.select('.' + data[0].name)
            .select('rect')
            .attr('y');

        let yEnd = heat_g.select('.' + data[data.length - 1].name)
            .select('rect')
            .attr('y');

        for (let i = 0; i < data.length; ++i) {
            expandData.push({
                province: data[i].name,
                date: []
            });
            // 删除矩形
            heat_g.select('.' + data[i].name)
                .selectAll('rect')
                .transition()
                .duration(750)
                .attr('height', function (d) {
                    expandData[expandData.length - 1].date.push(d);
                    let isExist = false;
                    for (let i = 0; i < mergeData.length; ++i) {
                        if (mergeData[i].date == d.date) {
                            mergeData[i].num += d.num;
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) mergeData.push(d);
                    return 0;
                })
                .remove();
            // 删除<g>标签
            heat_g.select('.' + data[i].name)
                .transition()
                .duration(750)
                .remove();
        }
        // 绘制合并之后的矩形
        heat_g.append('g')
            .attr('class', data[0].parent)
            .selectAll('rect')
            .data(mergeData)
            .enter()
            .append('rect')
            .attr('x', function (d) {
                return heat_padding.left * 1.5 + xScale(d.date);
            })
            .attr('y', yStart)
            .attr('width', 7)
            .attr('height', yEnd - yStart + 7) 
            .style('stroke', 'black')
            .style('fill', function (d) {
                if (d.num !== 0) {
                    return colorScale(d.num);;
                } else return 'gray';
            })
            .append('svg:title')
            .text(function (d) {
                return data[0].parent + '(' + d.date + '):' + d.num;
            });
    }
    // 分开
    else {

        heat_g.select('.' + data[0].parent)
            .selectAll('rect')
            .transition()
            .duration(750)
            .attr('height', 0)
            .remove();
        
        heat_g.select('.' + data[0].parent)
            .transition()
            .duration(750)
            .remove();

        let expand = [];
        for (let i = 0; i < data.length; ++i) {
            let delIndex = 0;
            for (let j = 0; j < expandData.length; ++j) {
                if (data[i].name == expandData[j].province) {
                    expand.push(expandData[j]);
                    delIndex = j;
                    break;
                }
            }
            expandData.splice(delIndex, 1);
        }
        drawHeat(expand, heat_g);
    }
}
/**
 * 根据时间重绘热力图
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 */
function setTimeRangeForHeat(start, end) {
    let selectedDomain = [];
    let delRect = [];
    let startIndex = xDomain.indexOf(start);
    let endIndex = xDomain.indexOf(end);
    for (let i = 0; i < xDomain.length; ++i) {
        if ((i >= startIndex) && (i <= endIndex)) {
            selectedDomain.push(xDomain[i]);
        } else {
            delRect.push(xDomain[i]);
        }
    }
    xScale.domain(selectedDomain);
    let rectWidth = xScale(selectedDomain[1]) - xScale(selectedDomain[0]);
    rectWidth = rectWidth * 0.7;
    let heat_g = d3.select("#heat_g");
    heat_g.selectAll('g')
        .each(function (d) {
            d3.select(this).selectAll('rect')
                .transition()
                .duration(750)
                .attr('height', function (p) {
                    if (delRect.indexOf(p.date) !== -1) {
                        return 0;
                    }
                    return 7;
                })
                .attr('x', function (p) {
                    if (delRect.indexOf(p.date) !== -1) {
                        return 0;
                    }
                    return heat_padding.left * 1.5 + xScale(p.date)
                })
                .attr('width', rectWidth);
        })

}

function getcolorDomain(data){
    let colorDomain = [];
    for(let i =0;i<data.length;++i){
        for(let j = 0;j<data[i].date.length;++j){
            colorDomain.push(data[i].date[j].num);
        }
    }
    return colorDomain;
}
/**
 * 获取X轴的定义域
 * @param {*} data 
 */
function getXDomain(data) {
    let xDomain = [];
    date = data[0].date;
    for (let i = 0; i < date.length; ++i) {
        xDomain.push(date[i].date);
    }
    return xDomain;
}
/**
 * 复制数据 获取树图点击后收缩或者展开的省份数据
 * @param {*} oldData 
 * @param {*} newData 
 */
function copyData(oldData, newData) {
    for (let i = 0; i < oldData.length; ++i) {
        newData.push({
            name: oldData[i].data.name,
            parent: oldData[i].data.parent
        });
    }
}