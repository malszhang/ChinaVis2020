var sankey_padding = {
	left: 10,
	top: 10,
	bottom: 5,
	right: 5
};


function drawSankey(data) {

	let sankey_height = document.getElementById('sankeyChart').offsetHeight - sankey_padding.top - sankey_padding.bottom;
	let sankey_width = document.getElementById('sankeyChart').offsetWidth - sankey_padding.left - sankey_padding.right;

	// 设置svg
	let svg = d3.select('#sankeyChart')
		.append('svg')
		.attr('class', 'sankey_svg')
		.attr('width', sankey_width + sankey_padding.left + sankey_padding.right)
		.attr('height', sankey_height + sankey_padding.top + sankey_padding.bottom);

	// 定义sankey布局的基本参数 其中extent[[x0, y0],[x1, y1]] [x0, y0]为左上起点的坐标 [x1, y1]为右下坐标
	let sankey = d3.sankey()
		.nodeWidth(15)
		.nodePadding(10)
		.extent([
			[sankey_padding.left, sankey_padding.top],
			[sankey_width, sankey_height]
		]);

	// 定义连接
	var link = svg.append("g")
		.attr("class", "links")
		.attr("fill", "none")
		.attr("stroke", "#000")
		.attr("stroke-opacity", 0.2)
		.selectAll("path");
	// 定义节点
	var node = svg.append("g")
		.attr("class", "nodes")
		.attr("font-family", "sans-serif")
		.attr("font-size", 10)
		.selectAll("g");

	// 处理原始数据
	let sanKeyData = sankey(data);
	//绘制连线
	link = link
		.data(sanKeyData.links)
		.enter()
		.append("path")
		.attr("d", d3.sankeyLinkHorizontal())
		.style('stroke', function(d) {
			return getColor(d.source);
		})
		.style('opacity', 0.6)
		.style("stroke-width", function (d) {
			return Math.min(30, d.width);
		})
		.on('mouseover', linkMouseOver)
		.on('mouseout', mouseOut);

	link.append("title")
		.text(function (d) {
			return d.source.date + " → " + d.target.date + "\n";
		});
	//绘制节点
	node = node
		.data(sanKeyData.nodes)
		.enter().append("g");

	node.append("rect")
		.attr("x", function (d) {
			return d.x0;
		})
		.attr("y", function (d) {
			return d.y0;
		})
		.attr("height", function (d) {
			return d.y1 - d.y0;
		})
		.attr("width", function (d) {
			return d.x1 - d.x0;
		})
		.on('mouseover', mouseOver)
		.on('mouseout', mouseOut)
		.on('click', sankeyClick)
		.attr("fill", getColor)
		.attr("stroke", "#000");

	node.append("text")
		.attr("x", function (d) {
			return d.x0 - 6;
		})
		.attr("y", function (d) {
			return (d.y1 + d.y0) / 2;
		})
		.attr("dy", "0.35em")
		.attr("text-anchor", "end")
		.text(function (d) {
			return d.name;
		})
		.attr("x", function (d) {
			return d.x1 + 6;
		})
		.attr("text-anchor", "start");

	node.append("title")
		.text(function (d) {
			return '时间：'+d.date + '\n'
			+ '新闻标题：' + d.title + '\n'
			+ '主题：' + d.theme + '\n';
		});
}

function mouseOver(d) {
	d3.select('.nodes')
		.selectAll('rect')
		.style('opacity', function (p) {
			if (d.sourceLinks.length != 0) {
				for (let i = 0; i < d.sourceLinks.length; ++i) {
					if ((d.sourceLinks[i].source == p) || (d.sourceLinks[i].target == p)) {
						return 1;
					}
				}
			}
			if (d.targetLinks.length != 0) {
				for (let i = 0; i < d.targetLinks.length; ++i) {
					if ((d.targetLinks[i].source == p) || (d.targetLinks[i].target == p)) {
						return 1;
					}
				}
			}
			return 0.3;
		});
	d3.select('.links')
		.selectAll('path')
		.style('opacity', function (p) {
			if (d.sourceLinks.length != 0) {
				for (let i = 0; i < d.sourceLinks.length; ++i) {
					if (d.sourceLinks[i] == p) {
						return 1;
					}
				}
			}
			if (d.targetLinks.length != 0) {
				for (let i = 0; i < d.targetLinks.length; ++i) {
					if (d.targetLinks[i] == p) {
						return 1;
					}
				}
			}
			return 0.3;
		});
}

function mouseOut() {
	d3.select('.nodes')
		.selectAll('rect')
		.style('opacity', function (p) {
			return 1;
		});
	d3.select('.links')
		.selectAll('path')
		.style('opacity', function (p) {
			return 1;
		});
}

function linkMouseOver(d) {
	d3.select('.links').selectAll('path')
	.style('opacity', function(p) {
		if(p == d) {
			return 1;
		}
		return 0.3;
	});
	d3.select('.nodes').selectAll('rect')
	.style('opacity', function(p) {
		if ((p == d.source) || (p == d.target)) {
			return 1;
		}
		return 0.3;
	});
}
/**
 * 调用词云 先去重，在绘制
 * @param {*} d 
 */
function sankeyClick(d) {
	let keyword = d.keyword;
}

function para_brush(selectedData) {
	let nodes = d3.select('.nodes').selectAll('g');
	let keyword = []; //平行坐标筛选的新闻的关键词，多个
	nodes.selectAll('rect')
		.style('opacity', function (d) {
			if (selectedData.indexOf(d.title) == -1) {
				return 0.3;
			} 
			else{
				keyword.push(d.keyword);
				return 1;
			} 
		});
	/// ****************调用词云 先去重，在绘制***********
}

function getColor(d) {
	if (d.theme == '复学&复工') {
		return 'green';
	}
	if (d.emotion == 1) {
		return 'red';
	}
	return 'blue';
}