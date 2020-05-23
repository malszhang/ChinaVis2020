var clickNodes = [];
var useLinks = [];
var i = 0;
function strongWord(i){
    return "<strong>"+i+"、"+"</strong>";
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
    $("#knTopic").html("共有谣言与新闻("+data.length+")条");
    var htmls = "";
    for (var i = 0; i < data.length; i++) {
        htmls += "<tr class=\"active\"><td>" + strongWord(i+1)+markStr(data[i].text, wordL) + "</td></tr>";
    }
    $("#knTbody")
        .html(htmls);
    $("#kn").show();
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
			name: r,
			weight: num
		})
	});
	return wordL
}
function findComByNum(wordL, len){
	var comWord = []
	wordL.forEach(function(w){
		if (w.weight == len){
			comWord.push(w.name)
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
				clickNodes.push(nodes[targetIndex]);
				useLinks.push(i);
				findNodeByLinks(link.target, links, nodes, nodes_name);
			} else if (nodeName == link.target &&
			 sourceIndex != -1){
				 clickNodes.push(nodes[sourceIndex]);
				 useLinks.push(i);
				 findNodeByLinks(link.source, links, nodes, nodes_name);
			 }
		} else{
			return;
		}
	}
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
    option = {
		color:webkitDep.color,
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
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
				data: webkitDep.categories
			}
		],
        animation: false,
        series : [
            {
                name: 'Les Miserables',
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
                    repulsion: 50
                },
    			focusNodeAdjacency: true,
            }
        ]
    };
    myChart.setOption(option);
	myChart.on('click', function(params) {
		var clickText = [params.data];
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
		console.log(comWords)
		creatKnTable(clickNodes, comWords);
		// }
		// console.log(clickNodes)
		drawThemeBubble({
			"children": keyWords
		})
	});
}