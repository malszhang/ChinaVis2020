var thisColor = ['#74add1', '#313695', '#4575b4', '#abd9e9', '#fee090', '#d73027', '#fdae61', '#f46d43'];
var cate = ['行业战疫', '境内疫情', '境外疫情', '政府行动', '辟谣', '事实', '误区', '谣言'];
var themeColor = d3.scaleOrdinal()
    .domain(cate)
    .range(thisColor);
function drawAreaWord(provinceDate) {
    var myChart = echarts.init(document.getElementById('areaWord'));
    function getList(wordList) {
        let list = [];
        for(let i = 0 ; i < wordList.length ; i++){
            for(let j = 0 ; j < wordList[i].length ; j++){
                list.push({
                    name: wordList[i][j].name,
                    value: Number(wordList[i][j].value),
                    category:wordList[i][j].category
                })
            }
        }
        return list;
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
    myChart.showLoading();

    //通过ajax取数据
    $.get('data/countkeywords.json', function (data) {
        let province = provinceDate.province;
        let time = provinceDate.date;
        let words = [];
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
            let list = getList(words);
            let newlist = uniqueArr(list);
            myChart.setOption({
                title: {
                    text: time + ' ' + province,
                    left: 'left'
                },
                tooltip : {
                    formatter:function (info) {
                        let str = "类型:" + info.data.category + "<br>"
                            + "热度:" + info.data.value;
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
                            color:function (info) {
                                return themeColor(info.data.category);
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