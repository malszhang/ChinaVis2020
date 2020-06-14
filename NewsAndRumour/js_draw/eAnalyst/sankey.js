var sankey_padding = {
	left: 10,
	top: 10,
	bottom: 5,
	right: 5
};
var sankey_height,
	sankey_width;

function drawSankey(data) {

	sankey_height = document.getElementById('sankeyChart').offsetHeight - sankey_padding.top - sankey_padding.bottom;
	sankey_width = document.getElementById('sankeyChart').offsetWidth - sankey_padding.left - sankey_padding.right;

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
		.style('stroke', function (d) {
			let label = d.source.theme;
			if(d.source.emotion == 1) {
				label = label + '+';
			}
			else label = label + '-';
			if(d.source.theme == '复学&复工') label = '复学&复工';
			return getColor(label);
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
		.attr("fill", d => {
			let label = d.theme;
			if(d.emotion == 1) {
				label = label + '+';
			}
			else label = label + '-';
			if(d.theme == '复学&复工') label = '复学&复工';
			return getColor(label);
		})
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
			return '时间：' + d.date + '\n' +
				'新闻标题：' + d.title + '\n' +
				'主题：' + d.theme + '\n';
		});

	setLabel();
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
		.style('opacity', function (p) {
			if (p == d) {
				return 1;
			}
			return 0.3;
		});
	d3.select('.nodes').selectAll('rect')
		.style('opacity', function (p) {
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
	drawWordCloud(keyword);
	para_highLight(d);
}

function para_brush(selectedData) {
	let nodes = d3.select('.nodes').selectAll('g');
	let keyword = []; //平行坐标筛选的新闻的关键词，多个
	nodes.selectAll('rect')
		.style('opacity', function (d) {
			if (selectedData.indexOf(d.title) == -1) {
				return 0.3;
			} else {
				keyword.push(d.keyword);
				return 1;
			}
		});
	/// ****************调用词云 先去重，在绘制***********
	let list = [];
	for (let i = 0; i < keyword.length; i++) {
		for (let j = 0; j < keyword[i].length; j++) {
			list.push(keyword[i][j]);
		}
	}
	drawWordCloud(list);
}

function getColor(d) {
	let color = ['#EE6352', '#59CD90', '#3FA7D6', "#FAC05E","#F79D84"];
	let label = ['复学+', '复学-', '复工+', '复工-', '复学&复工'];
	let index = label.indexOf(d);
	return color[index];
}

function setLabel() {
	let label = ['复学+', '复学-', '复工+', '复工-', '复学&复工'];
	let svg = d3.select('.sankey_svg');
	let leftPosition = sankey_width * 0.91;
	let top = sankey_padding.top * 3;
	let labelWidth = 15;
	let labelHeight = 15;
	let fontSzie = 19;

	let labels = svg.selectAll('.label')
		.data(label)
		.enter()
		.append('g')
		.attr('class', d => {
			return d;
		});

	labels.append('text')
		.attr("transform", (d, i) => {
			return 'translate(' + leftPosition + ',' + (top + i * labelHeight * 2) + ')';
		})
		.text(d => {
			let name = d.slice(0,2);
			let emo = d.slice(2,5);
			if (emo !== '&复工') {
				return name + '(' + emo + ')';
			}
			else return d;
			
		})
		.style('font-size', fontSzie);

	labels.append('rect')
		.attr('x', leftPosition - labelWidth * 1.5)
		.attr('y', (d, i) => {
			return top + i * labelHeight * 2 - labelHeight;
		})
		.attr('width', labelWidth)
		.attr('height', labelHeight)
		.style('fill', d => {
			return getColor(d);
		})
}

function highLightByCate(cate, topic) {
	let keyword = [];
	d3.select('.nodes')
		.selectAll('rect')
		.style('opacity', function (d) {
			if((d.category == cate) && ((d.theme == topic)||(d.theme == '复学&复工'))) {
				keyword = keyword.concat(d.keyword);
				return 1;
			}
			return 0.3;
		});

	drawWordCloud(keyword);
}