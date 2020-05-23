
function drawAreaWord() {
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
        let province = data[0].province;
        let time = data[0].date[35].date;
        let words = data[0].date[35].keywords;
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
                toolbox: {
                    right:'5%',
                    feature: {
                        dataView: {readOnly: true},
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [{
                    type: 'wordCloud',
                    data: list,
                    sizeRange: [15, 40],
                    rotationRange: [0, 0],  //设置为不旋转
                    gridSize: 2,            //字符之间的间隔
                    shape: 'pentagon',
                    drawOutOfBound: false,
                    textStyle: {
                        //正常情况下的样式
                        normal: {
                            color: ['#575757','#1286ba','#e65457']
                        },
                        //鼠标悬浮时的样式
                        emphasis: {
                            fontWeight:'bolder',
                            fontSize:30,
                            color: '#00467A'
                        }
                    },
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