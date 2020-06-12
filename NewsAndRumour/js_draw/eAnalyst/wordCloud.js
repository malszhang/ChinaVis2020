function drawWordCloud(wordList) {
    let list = [];
    for(let j = 0 ; j < wordList.length ; j++){
        list.push({
            name: wordList[j],
            value: 1,
        })
    }

    function uniqueArr(arr){
        let Array = [];
        let names = [];
        for(let i = 0 ; i < arr.length ; i++){
            if(names.indexOf(arr[i].name) === -1){
                Array.push(arr[i]);
                names.push(arr[i].name);
            }
        }
        return Array;
    }
    let newlist = uniqueArr(list);
    let myChart = echarts.init(document.getElementById('wordCloud'));
    myChart.showLoading();
    myChart.setOption({
        tooltip : {
            formatter:function (info) {
                 // "类型:" + info.data.category + "<br>"
                let str = "热度:" + info.data.value;
                return str;
            },
            backgroundColor:'rgba(255,255,255,0)',
            textStyle:{
                fontWeight:'bold',
                fontSize:20,
                color:'#e65457',
            }
        },
        series: [{
            type: 'wordCloud',
            sizeRange: [15, 35],
            rotationRange: [0, 0],  //设置为不旋转
            gridSize: 4,            //字符之间的间隔
            shape: 'pentagon',
            left:'center',
            top:'center',
            drawOutOfBound: false,
            textStyle: {
                //正常情况下的样式
                normal:{
                    color:function () {
                        var thisColor = ['#74add1', '#313695', '#4575b4', '#abd9e9', '#fee090', '#d73027', '#fdae61', '#f46d43'];
                        return thisColor[Math.floor(Math.random()*9)];
                    }
                },
                //鼠标悬浮时的样式
                emphasis: {
                    fontWeight:'bolder',
                    fontSize:30,
                    color: '#00467A'
                }
            },
            data: newlist,
        }]
    });
    myChart.hideLoading();
    window.onresize = function () {
        myChart.resize();
    }
}