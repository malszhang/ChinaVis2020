var clickNodes = [];
var useLinks = [];
var i = 0;
function divideCate(categories){
	var result = [[],[]];
	categories.forEach(function(cate){
		if (cate.length == 4){
			result[0].push(cate);
		}else{
			result[1].push(cate);
		}
	});
	return result;
}
function nodeToBubble(nodes, keyWords){
	var buData = [];
	keyWords.forEach(function(word){
		var bubble = [];
		nodes.forEach(function(node){
			if (node.keyword.indexOf(word.cate) != -1){
				bubble.push(node.category);
			}
		});
		buData.push({
			name: word.cate,
			weight: findComWords([{keyword:bubble}])
		});
	});
	return buData;
}
function timeDeal(time){
	var date = time.split(" ");
	var dateStr = date[0].split("/");
	var year = dateStr[0];
	var month = dateStr[1].length == 2? dateStr[1]: "0"+dateStr[1];
	var day = dateStr[2].length == 2? dateStr[2]: "0"+dateStr[2];
	return year + month + day + " "+date[1];
}
function isInData(data, d){
		
	data.forEach(function(t){
		if (t.name == d.name){
			return true;
		}
	});
	return false;
}
function sortData(data){
	for (var i = 0; i < data.length; i++){
		for (var j = i; j < data.length; j++){
			var iTime = timeDeal(data[i].time);
			var jTime = timeDeal(data[j].time);
			if (iTime > jTime){
				var t = data[i];
				data[i] = data[j];
				data[j] = t;
			}
		}
	}
	return data;
}
function strongWord(text){
    return "<strong>"+text+"</strong>";
}
function markStr(str, wordL) {
    str = "  " + str;
    for (var i = 0; i < wordL.length; i++) {
        var showIndex = str.indexOf(wordL[i]);
        if (showIndex > -1) {
            var str1 = str.substring(0, showIndex) + "<mark style=\'background-color: #ff993e\'><strong>";
            var str2 = "</strong></mark>" + str.substring(showIndex + wordL[i].length, str.length);
            str = str1 + wordL[i] + str2;
        }
    }
    return str;
}
function creatKnTable(data, wordL) {
	var data = sortData(data);
	var vertical = "class = \"el-divider el-divider--vertical\"";
	var horizon = "class = \"el-divider el-divider--horizontal\"";
    $("#knTopic").html("<b>共有谣言与新闻("+data.length+")条</b>");
    var htmls = "";
    for (var i = 0; i < data.length; i++) {
		// htmls += "<div><span>"+data[i].time+"</span><div "+vertical+
		// "></div><span>"+data[i].category+"</span></div>";
		htmls += "<div><span>"+data[i].time+"</span></div>";
        htmls += "<span>" +strongWord(data[i].category+"：")+markStr(data[i].text, wordL) + "</span>";
		htmls += "<div "+horizon+"></div>"
    }
    $("#knBody").html(htmls);
    // $("#kn").show();
}
function countNum(word, wordL){
	var count = 0;
	wordL.forEach(function(w){
		if (word == w){
			count++;
		}
	})
	return count;
}
function findComWords(nodes){
	var keyWord = [];
	var rData = [];
	var wordL = []
	nodes.forEach(function(node){
		node.keyword.forEach(function(word){
			if (keyWord.indexOf(word) == -1){
				rData.push(word);
			}
			keyWord.push(word);
		})
	})
	rData.forEach(function(r){
		var num = countNum(r, keyWord)
		wordL.push({
			cate: r,
			num: num
		})
	});
	return wordL
}
function findComByNum(wordL, len){
	var comWord = []
	wordL.forEach(function(w){
		if (w.num == len){
			comWord.push(w.cate)
		}
	});
	return comWord;
}
function findNodeByLinks(nodeName, links, nodes, nodes_name){
	
	for (var i = 0; i < links.length; i++){
		if (useLinks.indexOf(i) == -1){
			
			var link = links[i];
			var targetIndex = nodes_name.indexOf(link.target);
			var sourceIndex = nodes_name.indexOf(link.source);
			if (nodeName == link.source &&
			 targetIndex != -1){
				 if (!isInData(clickNodes, nodes[targetIndex])){
				 	// console.log(isInData(clickNodes, nodes[targetIndex]))
					clickNodes.push(nodes[targetIndex])
					useLinks.push(i);
					findNodeByLinks(link.target, links, nodes, nodes_name);
				 }
				
			} else if (nodeName == link.target &&
			 sourceIndex != -1){
				 if (!isInData(clickNodes, nodes[sourceIndex])){
					 // console.log(isInData(clickNodes, nodes[sourceIndex]))
				 	clickNodes.push(nodes[sourceIndex])
					useLinks.push(i);
					findNodeByLinks(link.source, links, nodes, nodes_name);
				 }
				 
			 }
		} else{
			continue;
		}
	}
	return;
}
function splitDiv(divNum) {
    let html = '';
    let rowNum = Math.ceil(divNum / 2);
    let height = document.getElementById("nodeMatrix").offsetHeight;
    $("#nodeMatrix").css({"height":height});
    let cellHeight = (height - 20) / 2;
    if(rowNum == 1) cellHeight = height - 20;
    index = 0;
    for (let i = 0; i < rowNum; ++i) {
        let row = '<el-row :gutter="8" style="margin:5px">';
        for (let j = 0; j < 2; ++j) {
            if(rowNum == 1){
                row += '<el-col :span="24" style="">';
            }
            else row += '<el-col :span="12" style="">';
            row += '<div class="grid-content-header grid-content3 bg-purple" style="border:0px;height:' + cellHeight + '" id="node-' + index + '"></div>';
            row += '</el-col>';
            index++;
            if(index >= divNum) break;
        }
        row += '</el-row>';
        html += row;
        if(index >= divNum) break;
    }
    $("#nodeMatrix").html(html);
    new Vue({
        el: "#nodeMatrix",
    });
}

function drawNodeMatrix(dataNum, data) {
    // splitDiv(dataNum);
    for(let i = 0;i<dataNum;++i){
        let dom = document.getElementById("nodeMatrix");
        let myChart = echarts.init(dom);
        drawNode(data, myChart);
    }
}

function drawNode(webkitDep, myChart) {
    var nColors = ['#74add1', '#313695', '#4575b4', '#abd9e9','#fee090','#d73027', '#fdae61', '#f46d43'];
    // console.log(webkitDep.categories);
	var legendData = divideCate(webkitDep.categories);
	option = {
		color:webkitDep.color,
        title: {
            // text: 'Les Miserables',
            // subtext: 'Default layout',
            // left: 'right'
            // top: 'bottom',
        },
		// grid:{
		// 	top: "10%",
		// 	bottom: "10%"
		// },
        tooltip: {
    		formatter: function(obj) {
    			// console.log(obj)
				var str = "";
				if (obj.dataType == "node"){
					str = "时间: "+obj.data.time+"<br>"+				
				       "内容: "+obj.data.text+ "<br>"+
					   "类型: "+obj.data.category+ "<br>";
				}
    			return str
    		}
    	},
		legend:[
			{
				orient: 'vertical',
				left: "left",
				top: "center",
				data: legendData[0]
			},
			{
				orient: 'vertical',
				right: "right",
				top: "center",
				data: legendData[1]
			}
		],
        animation: false,
        series : [
            {
                // name: 'Les Miserables',
				// gridIndex: 0,
                type: 'graph',
                layout: 'force',
                data: webkitDep.nodes,
                links: webkitDep.links,
    			categories: webkitDep.categories_name,
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
					initLayout:"circular",
                    repulsion: 50
                },
    			focusNodeAdjacency: true,
            }
        ]
    };
    myChart.setOption(option);
	window.addEventListener('resize', function() {
		myChart.resize();
	})
	myChart.on('click', function(params) {
		// console.log(params);
		clickNodes = [params.data];
		useLinks = []
		// i++;
		findNodeByLinks(params.data.name, webkitDep.links, webkitDep.nodes, webkitDep.nodes_name);
		// if (i%2){
		var keyWords = [];
		keyWords = findComWords(clickNodes);	
		var comWords = [];
		comWords =findComByNum(keyWords, clickNodes.length)
		// console.log(comWords)
		creatKnTable(clickNodes, comWords);
		// }
		// console.log(clickNodes)
		drawThemeBubble({
			"children": nodeToBubble(clickNodes, keyWords)
		})
	});
}
