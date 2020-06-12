var topic_padding = {
	left: 10,
	top: 10,
	bottom: 5,
	right: 5
};

function drawTopic(topicName, divName) {
	let topic_width = document.getElementById(divName).offsetWidth - topic_padding.left - topic_padding.right;
	let topic_height = document.getElementById(divName).offsetHeight - topic_padding.top - topic_padding.bottom;
	let fontSize = 18;
	let svg = d3.select('#' + divName).append('svg')
		.attr('class', divName + '_svg')
		.attr('width', topic_width + topic_padding.left + topic_padding.right)
		.attr('height', topic_height + topic_padding.top + topic_padding.bottom);
	svg.append('text')
		.attr('transform', 'translate(' + topic_padding.left + ',' + (topic_padding.top + fontSize) + ')')
		.style('font-size', fontSize)
		.text(topicName);

}

/**
 * 16组数据
 * ['转发', '评论', '点赞', '媒体个数']
 * ['']
 */
function dataGroup(data) {
	let statis = ['转发', '评论', '点赞', '媒体个数'];
	let cate = [];
	for (let i = 0; i < data.length; ++i) {
		if (cate.indexOf(data[i].category) == -1) {
			cate.push(data[i].category);
		}
	}
	let staData = [];
	for (let i = 0; i < cate.length; ++i) {
		let json = {};
		json[cate[i]] = [];
		for (let j = 0; j < data.length; ++j) {
			if (data[j].category == cate[i]) {
				json[cate[i]].push(data[i]);
			}
		}

		staData.push(json);
	}
	console.log(staData);

	// for(let i = 0;i<statis.length;++i) {
	// 	staData[statis[i]] = 0;
	// 	for(let j = 0;j<staData.length;++j) {
	// 		staData[statis[i]] = staData;
	// 	}
	// }

}