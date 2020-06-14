var topic_padding = {
	left: 10,
	top: 10,
	bottom: 5,
	right: 5
};
var statis = ['转发', '评论', '点赞', '媒体个数'];
var topic_width,
	topic_height;

var thisColor = ['#fee090', '#d73027', '#fdae61', '#f46d43'];
var cate = ['行业战疫', '境内疫情', '境外疫情', '政府行动', '辟谣', '事实', '误区', '谣言'];
//颜色比例尺
var themeColor = d3.scaleOrdinal()
	.domain(statis)
	.range(thisColor);

function drawTopic(topicName, divName, data) {
	topic_width = document.getElementById(divName).offsetWidth - topic_padding.left - topic_padding.right;
	topic_height = document.getElementById(divName).offsetHeight - topic_padding.top - topic_padding.bottom;
	let fontSize = 18;
	let svg = d3.select('#' + divName).append('svg')
		.attr('class', divName + '_svg')
		.attr('width', topic_width + topic_padding.left + topic_padding.right)
		.attr('height', topic_height + topic_padding.top + topic_padding.bottom);
	svg.append('text')
		.attr('transform', 'translate(' + (topic_width / 2 - fontSize / 2) + ',' + (topic_padding.top + fontSize) + ')')
		.style('font-size', fontSize)
		.text(topicName);

	drawStackBar(data, svg, topicName);

}
/**
 * ['转发', '评论', '点赞', '媒体个数'] 每一个的情感正负情况数据
 * @param {*} data 
 */
function dataGroup(data) {
	let groupData = [];
	let cate = [];
	data.forEach(d => {
		if (cate.indexOf(d.category) == -1) {
			cate.push(d.category);
		}
	})
	// 第一步 将数据按类别进行划分 并类别按情感正负进行划分
	for (let i = 0; i < cate.length; ++i) {
		let json = {
			category: cate[i],
			positive: [],
			negtive: []
		};
		data.forEach(d => {
			if (d.category == cate[i]) {
				if (d.emotion == 1) {
					json.positive.push(d)
				} else json.negtive.push(d);
			}
		});
		groupData.push(json);
	}

	//第二步 统计'转发', '评论', '点赞', '媒体个数'
	for (let i = 0; i < groupData.length; ++i) {
		groupData[i].positiveNum = [];
		for (let j = 0; j < statis.length; ++j) {
			let json = {
				name: statis[j],
				num: 0
			};
			for (let x = 0; x < groupData[i].positive.length; ++x) {
				json.num += groupData[i].positive[x][statis[j]];
			}
			groupData[i].positiveNum.push(json);
		}
		groupData[i].negtiveNum = [];
		for (let j = 0; j < statis.length; ++j) {
			let json = {
				name: statis[j],
				num: 0
			};
			for (let x = 0; x < groupData[i].negtive.length; ++x) {
				json.num += groupData[i].negtive[x][statis[j]];
			}
			groupData[i].negtiveNum.push(json);
		}
	}
	for (let i = 0; i < groupData.length; ++i) {
		groupData[i].emotion = [];
		for (let j = 0; j < statis.length; ++j) {
			let json = {
				name: statis[j],
				emotion: []
			};
			for (let x = 0; x < groupData[i].negtiveNum.length; ++x) {
				if (groupData[i].negtiveNum[x].name == statis[j]) {
					groupData[i].negtiveNum[x].category = groupData[i].category;
					groupData[i].negtiveNum[x].emotion = -1;
					json.emotion.push(groupData[i].negtiveNum[x]);
				}
			}
			for (let x = 0; x < groupData[i].positiveNum.length; ++x) {
				if (groupData[i].positiveNum[x].name == statis[j]) {
					groupData[i].positiveNum[x].category = groupData[i].category;
					groupData[i].positiveNum[x].emotion = 1;
					json.emotion.push(groupData[i].positiveNum[x]);
				}
			}
			groupData[i].emotion.push(json);
		}
	}
	return groupData;
}

function getTopicData(topic, data) {
	let topicData = [];
	data.forEach(d => {
		if ((d.theme == topic) || (d.theme == '复学&复工')) {
			topicData.push(d);
		}
	});
	return topicData;
}

function drawStackBar(data, svg, topicName) {
	let all_data = [];
	data.forEach(d => {
		all_data = all_data.concat(d.emotion);
	});
	let cate = [];
	data.forEach(d => {
		cate.push(d.category);
	})
	xScale = d3.scalePoint()
		.domain(statis)
		.range([topic_padding.left * 7, topic_width - topic_padding.right * 7]);


	yScale = d3.scalePoint()
		.domain(cate)
		.range([topic_padding.top * 10, topic_height - topic_padding.bottom * 10]);

	let rectWidth = xScale(statis[1]) - xScale(statis[0]);

	let rectHeight = yScale(cate[1]) - yScale(cate[0]);

	rectHeight *= 0.8;

	rectWidth *= 0.8;

	svg.append('g')
		.selectAll('.ylabel')
		.data(cate)
		.enter()
		.append('text')
		.attr('transform', d => {
			return 'translate(' + topic_padding.left + ',' + yScale(d) + ')';
		})
		.style('font-size', 10)
		.text(String);

	svg.append('g')
		.selectAll('.xlabel')
		.data(statis)
		.enter()
		.append('text')
		.attr('transform', d => {
			return 'translate(' + xScale(d) + ',' + topic_padding.top * 6 + ')';
		})
		.style('font-size', 10)
		.text(d => {
			if (d == '媒体个数') {
				return '媒体';
			}
			return d;
		});


	let emotions = svg.selectAll('.emotion')
		.data(all_data)
		.enter()
		.append('g');


	let opacityScale = {};
	for (let i = 0; i < statis.length; ++i) {
		opacityScale[statis[i]] = d3.scaleLinear()
			.domain(d3.extent(all_data, d => {
				if (d.emotion[0].name == statis[i]) {
					let sum = d.emotion[0].num + d.emotion[1].num;
					return +sum;
				}
			}))
			.range([0.3, 1]);
	}

	let allRects = emotions.selectAll('rect')
		.data(d => {
			let sum = d.emotion[0].num + d.emotion[1].num;
			d.emotion[0].sum = sum, d.emotion[1].sum = sum;
			d.emotion[0].move = 0, d.emotion[1].move = rectWidth * d.emotion[0].num / sum;
			d.emotion[0].topicName = topicName, d.emotion[1].topicName = topicName;
			return d.emotion;
		})
		.enter()
		.append('rect')
		.attr('x', d => {
			return xScale(d.name) - 10 + d.move;
		})
		.attr('y', d => {
			return yScale(d.category) - rectHeight / 2;
		})
		.attr('width', d => {
			let thisWidth = rectWidth * d.num / d.sum;
			move = thisWidth;
			return thisWidth;
		})
		.attr('height', rectHeight)
		.attr('fill', d => {
			let label = d.topicName;
			if (d.emotion == -1) {
				label = label + '-';
			} else label = label + '+';
			return getColor(label);
		})
		.style('opacity', d => {
			return opacityScale[d.name](d.sum);
		})
		.on('click', topicClick);

	allRects.append("svg:title")
		.text(d => {
			return d.name + "总数量：" + d.sum + "\n" +
				'情感倾向：' + (d.emotion == -1 ? '消极' : '积极') + '\n' +
				(d.name == '媒体个数' ? '媒体' : d.name) + '数量：' + d.num + (d.name == '媒体个数' ? '个' : '次')  + '\n' +
				'占比：' + (d.num / d.sum * 100).toFixed(2) + '%';
		})
}
function topicClick(d) {
	highLightByCate(d.category, d.topicName);
}