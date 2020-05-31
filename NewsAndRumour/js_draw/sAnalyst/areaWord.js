
function drawAreaWord(provinceDate) {
    var myChart = echarts.init(document.getElementById('areaWord'));
    function getList(wordList) {
        let list = [];
        for (var i = 0; i < wordList.length; i++) {
            list.push({
                name: wordList[i].name,
                value: Number(wordList[i].value)
            })
        }
        return list;
    }
    myChart.showLoading();

    //通过ajax取数据
    $.get('data/countkeywords.json', function (data) {
        let province = provinceDate.province;
        let time = provinceDate.date;
        let words;
        for(let i = 0;i<data.length;++i){
            if(data[i].province == province){
                for(let j = 0;j<data[i].date.length;++j){
                    if(data[i].date[j].date == time){
                        words = data[i].date[j].keywords;
                    }
                }
            }
        }
        //ajax请求成功时执行
        window.onload = setTimeout(function () {
            var list = getList(words);

            myChart.setOption({
                title: {
                    text: '省份:' + province + '\n' + '时间:' + time,
                    left: 'left'
                },
                tooltip : {
                    formatter:"热度:{c}",
                    backgroundColor:'rgba(255,255,255,0)',
                    textStyle:{
                        fontWeight:'bold',
                        fontSize:20,
                        color:'#1286ba',
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
                            color:function (info) {
                                let colorIndex;
                                let colorArr = ['#fdae61', '#f46d43', '#d73027', '#a50026'];
                                if(info.data.value > 3)
                                    colorIndex = 3;
                                else
                                    colorIndex = info.data.value;
                                return colorArr[colorIndex];
                            }
                        },
                        //鼠标悬浮时的样式
                        emphasis: {
                            fontWeight:'bolder',
                            fontSize:30,
                            color: '#00467A'
                        }
                    },
                    data: list,
                }]
            });
        }, 100)
        myChart.hideLoading();
    })

    //添加点击事件
    myChart.on('click',function(params){
        var name = params.name;
        var value = params.value;
        console.log(name + ":" + value);
    });

    //图表自适应
    window.onresize = function () {
            myChart.resize();
    }
}