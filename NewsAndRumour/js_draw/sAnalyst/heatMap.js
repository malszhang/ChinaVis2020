var heat_padding = {
    left: 40,
    top: 5,
    bottom: 5,
    right: 5
};
var i = 0;
var rootData; //树图数据
var allHeatData = []; //热力图的所有的数据
var yRange = []; //y轴的值域 树图叶子节点的坐标
var yDomain = []; //y轴的定义域 每个省份的名称
var xDomain; //x轴的定义域 日期
var xScale; //x轴的比例尺
var yScale; //y轴的比例尺
var startTime = '2019/12/22'; //框选时间的开始
var endTime = '2020/5/23'; //框选时间的结束
var presentData = []; // 热力图实时的数据
var mergeData = []; //合并省份之后的数据含位置信息
var rectWidth;
var duration = 750;
var heatColor = [
    '#e1e1e1', '#313695',
    '#4575b4', '#74add1',
    '#abd9e9', '#fee090',
    '#fdae61', '#f46d43',
    '#d73027', '#a50026'
];
// var heatColor = [
//     '#80FFDB', '#72EFDD',
//     '#64DFDF', '#56CFE1',
//     '#48BFE3', '#4EA8DE',
//     '#5390D9', '#5E60CE',
//     '#6930C3', '#7400B8'
// ];

var colorDomain = []; // 颜色的定义域 每省每日的舆情数值
var colorScale = function (d) {
    let index = parseInt(colorDomain.indexOf(d) / 2);
    return heatColor[index];
}; //热力图颜色的比例尺

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

    $.getJSON("data/province.json", function (treeData) {
        drawHeatMap_tree(treeData, width, height);
    });
    $.getJSON('data/provinceCount.json', function (data) {
        for (let i = 0; i < data.length; ++i) {
            data[i]._date = deepCopy(data[i].date);
        }
        allHeatData = deepCopy(data);
        presentData = deepCopy(data);
        getMergeData(data);
        drawHeatMap_heat(presentData);
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

    // 定义Y轴比例尺    
    yScale = d3.scaleOrdinal()
        .domain(yDomain)
        .range(yRange);

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
        .duration(duration)
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
        .duration(duration)
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
        .duration(duration)
        .attr('d', function (d) {
            return diagonal(d, d.parent);
        });
    // ************删除的连线************
    var linkExit = link.exit().transition()
        .duration(duration)
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

    // 热力图左侧边框距离
    let heatWidth = d3.select('#heat_svg').attr('width') - 1.3 * marginLeft;

    // 定义X轴比例尺
    xDomain = getXDomain(data);

    xScale = d3.scaleBand()
        .domain(xDomain)
        .range([0, heatWidth]);

    colorDomain = getcolorDomain(data);

    let newColorDomain = [];
    for (let i = colorDomain.length - 1; i >= 0; --i) {
        if (newColorDomain.indexOf(colorDomain[i]) == -1) {
            newColorDomain.push(colorDomain[i]);
        }
    }
    newColorDomain.sort(function (a, b) {
        return a - b;
    });
    colorDomain = newColorDomain;

    d3.select(".heat_svg")
        .append('g')
        .attr("transform", "translate(" + marginLeft + "," + heat_padding.top + ")")
        .attr("id", "heat_g")
        .attr('class', 'heat_g');

    drawHeat(data);
}

function drawHeat(data) {
    // 计算连续的两个矩形之间的距离
    rectWidth = xScale(data[0].date[1].date) - xScale(data[0].date[0].date);
    rectWidth = rectWidth * 0.7;

    d3.select('.heat_g').selectAll('g').remove();

    let province = d3.select('.heat_g').selectAll('.province')
        .data(data)
        .enter()
        .append('g')
        .attr('class', function (d) {
            return d.province;
        });

    let group = province.selectAll('rect')
        .data(function (d) {
            for (let i = 0; i < d.date.length; ++i) {
                d.date[i].province = d.province;
            }
            return d.date;
        });

    let groupEnter = group.enter()
        .append('rect')
        .attr('class', function (d) {
            return d.date;
        })
        .attr('x', function (d) {
            return heat_padding.left * 1.5 + xScale(d.date);
        })
        .attr('y', function (d) {
            for (let i = 0; i < mergeData.length; ++i) {
                if (d.province === mergeData[i].province) {
                    return mergeData[i].yStart;
                }
            }
            return yScale(d.province) - 3.5;
        })
        .on('click', function (d) {
            if (d.num !== 0) {
                let provinceDate = {
                    province: d.province,
                    date: d.date
                };
                drawAreaWord(provinceDate);
                drawTreeMap(provinceDate);
            }
        });

    groupEnter.append('svg:title')
        .text(function (d) {
            return '地区：' + d.province + '\n' +
                '时间：' + d.date + '\n' +
                '热度：' + d.num + '\n';// +
                // 'color:' + colorScale(d.num)
        });

    let groupUpdate = groupEnter.merge(group);

    groupUpdate.transition()
        .duration(duration)
        .attr('x', function (d) {
            return heat_padding.left * 1.5 + xScale(d.date);
        })
        .attr('y', function (d) {
            for (let i = 0; i < mergeData.length; ++i) {
                if (d.province === mergeData[i].province) {
                    return mergeData[i].yStart;
                }
            }
            return yScale(d.province) - 3.5;
        })
        .attr('width', rectWidth)
        .attr('height', function (d) {
            for (let i = 0; i < mergeData.length; ++i) {
                if (d.province === mergeData[i].province) {
                    return mergeData[i].rectHeight;
                }
            }
            return 7;
        })
        .style('stroke', 'black')
        .style('stroke-opacity', 0.4)
        .style('stroke-width', 0.4)
        .style('fill', function (d) {
            if (d.num !== 0) {
                return colorScale(d.num);
            } else return 'white';
        });
}

/**
 * 合并或者分开某一地域的矩形
 * @param {*} data 更新的数据
 * @param {*} flag 判断合并或分来
 */
function update_heat(data, flag) {
    getPresentHeatData(data, flag);
    setTimeRangeForHeat(startTime, endTime);
    drawHeat(presentData);
}
/**
 * 将区域省份数据合并
 * @param {*} data 
 */
function mergeProvince(data) {
    let heat_g = d3.select("#heat_g");
    console.log(presentData);
    let thisMergeData = [];
    // 计算合并后矩形的起始Y坐标
    let yStart = d3.select('.' + data[0].name)
        .select('rect')
        .attr('y');

    let yEnd = heat_g.select('.' + data[data.length - 1].name)
        .select('rect')
        .attr('y');

    for (let i = 0; i < presentData.length; ++i) {
        if (presentData[i].province === data[0].parent) {
            thisMergeData.push(presentData[i]);
        }
    }

    for (let i = 0; i < data.length; ++i) {
        // 删除矩形
        heat_g.select('.' + data[i].name)
            .selectAll('rect')
            .transition()
            .duration(duration)
            .attr('height', function (d) {
                return 0;
            })
            .remove();

        // 删除<g>标签
        heat_g.select('.' + data[i].name)
            .transition()
            .duration(duration)
            .remove();
    }
    // 绘制合并之后的矩形
    let newProvince = d3.select('.heat_g')
        .append('g')
        .data(thisMergeData)
        .attr('class', function (d) {
            return d.province;
        });

    newProvince.selectAll('rect')
        .data(function (d) {
            for (let i = 0; i < d.date.length; ++i) {
                d.date[i].province = d.province;
            }
            return d.date;
        })
        .enter()
        .append('rect')
        .attr('x', function (d) {
            return heat_padding.left * 1.5 + xScale(d.date);
        })
        .attr('y', yStart)
        .attr('width', rectWidth)
        .attr('height', yEnd - yStart + 7)
        .style('stroke', 'black')
        .style('fill', function (d) {
            if (d.num !== 0) {
                return colorScale(d.num);;
            } else return 'white';
        })
        .append('svg:title')
        .text(function (d) {
            return data[0].parent + '(' + d.date + '):' + d.num;
        });
}

/**
 * 将区域数据分开
 * @param {*} data 
 */
function expandProvince(data) {
    let heat_g = d3.select("#heat_g");

    //删除矩形
    heat_g.select('.' + data[0].parent)
        .selectAll('rect')
        .transition()
        .duration(duration)
        .attr('height', 0)
        .remove();

    //删除group
    heat_g.select('.' + data[0].parent)
        .transition()
        .duration(duration)
        .remove();

    let expandData = [];
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < presentData.length; ++j) {
            if (data[i].name === presentData[j].province) {
                expandData.push(presentData[j]);
                break;
            }
        }
    }
    drawHeat(expandData);
}

/**
 * 根据时间重绘热力图
 * @param {*} start 开始时间
 * @param {*} end 结束时间
 */
function setTimeRangeForHeat(start, end) {
    startTime = start;
    endTime = end;
    let startIndex = xDomain.indexOf(startTime);
    let endIndex = xDomain.indexOf(endTime);
    let selectedDomain = [];
    for (let i = startIndex; i <= endIndex; ++i) {
        selectedDomain.push(xDomain[i]);
    }
    for (let i = 0; i < presentData.length; ++i) {
        presentData[i].date = [];
        presentData[i].date = presentData[i]._date.filter(function (d) {
            if (selectedDomain.indexOf(d.date) !== -1) return d;
        });
    }
    xScale.domain(selectedDomain);
}

function getPresentHeatData(data, flag) {
    //合并
    if (flag === false) {
        //删除数据
        let delDataIndex = [];
        for (let i = presentData.length - 1; i >= 0; i--) {
            for (let j = 0; j < data.length; ++j) {
                if (presentData[i].province === data[j].name) {
                    presentData.splice(i, 1);
                    delDataIndex.unshift(i);
                    break;
                }
            }
        }
        for (let i = 0; i < mergeData.length; ++i) {
            if (mergeData[i].province === data[0].parent) {
                presentData.splice(delDataIndex[0], 0, mergeData[i]);
                break;
            }
        }
    }
    //分开
    else {
        let index = 0;
        for (let i = presentData.length - 1; i >= 0; --i) {
            if (presentData[i].province === data[0].parent) {
                presentData.splice(i, 1);
                index = i;
                break;
            }
        }
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < allHeatData.length; ++j) {
                if (data[i].name === allHeatData[j].province) {
                    presentData.splice(index, 0, allHeatData[j]);
                    index++;
                    break;
                }
            }
        }
    }
    return presentData;
}
/**
 * 获取颜色比例尺的定义域
 * @param {*} data 
 */
function getcolorDomain(data) {
    let colorDomain = [];
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].date.length; ++j) {
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

function getMergeData(data) {
    $.getJSON('data/areaCount.json', function (area) {
        mergeData = deepCopy(area);
        for (let i = 0; i < mergeData.length; ++i) {
            let selectedData = [];
            for (let j = 0; j < data.length; ++j) {
                if (mergeData[i].province === data[j].parent) {
                    selectedData.push(data[j]);
                }
            }
            mergeData[i].rectHeight = (yScale(selectedData[selectedData.length - 1].province) - yScale(selectedData[0].province));
            mergeData[i].yStart = yScale(selectedData[0].province);
            mergeData[i]._date = deepCopy(mergeData[i].date);
        }
        return mergeData;
    });
}

function deepCopy(obj, cache = []) {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
    const hit = cache.filter(c => c.original === obj)[0]
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}

    cache.push({
        original: obj,
        copy
    })
    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })

    return copy;
}