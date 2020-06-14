function splitData(rawData) {
    var categoryData = [];
    var values = [];
    for (var i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i].splice(0, 1)[0]);
        values.push(rawData[i])
    }
    return {
        categoryData: categoryData,
        values: values
    };
}
function calculateMA(line, data) {
    var result = [];
    for (var i = 0; i < data.values.length; i++) {
        result.push(data.values[i][line]);
    }
    return result;
}
function drawLineBar(){
    var dom = document.getElementById("lineBar");
    var barChart = echarts.init(dom);
    $.getJSON("data/tendency.json", function(rawData) {
        let data = splitData(rawData);
        let barOption = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['新增确诊', '舆情数量']
            },
            xAxis: [
                {
                    type: 'category',
                    data: data.categoryData,
                    scale: true,
                    boundaryGap: false,
                    axisLine: {
                        onZero: false
                    },
                    splitLine: {
                        show: false
                    },
                    splitArea : {
                        show : false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '新增确诊人数',
                    minInterval: 500,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    splitLine:{
                        show:false
                    },
                    splitNumber: 5
                },
                {
                    type: 'value',
                    name: '舆情数量',
                    minInterval: 10,
                    axisLabel: {
                        formatter: '{value}'
                    },
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    splitLine:{
                        show:false
                    }
                }
            ],
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 10
            },
            {
                show: true,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
            }
            ],
            series: [
                {
                    name: '新增确诊',
                    type: 'line',
                    yAxisIndex: 0,
                    data: calculateMA(0, data),
                    color:'#F46D43',
                    showSymbol: false,
                    smooth: true,
                    z:999
                },
                {
                    name: '舆情数量',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: calculateMA(1, data),
                    color:'#4575b4',
                    barMinWidth:3,
                    barMaxWidth:15,
                    showSymbol: false,
                    smooth: true,
                    z:999
                }
            ]
        };
        if (barOption && typeof barOption === "object") {
            barChart.setOption(barOption, true);
        }
    });
    //获取框选的时间
    barChart.on('dataZoom',function(){
        let startValue = barChart.getOption().dataZoom[1].startValue;
        let endValue = barChart.getOption().dataZoom[1].endValue;
        let start = barChart.getOption().xAxis[0].data[startValue];
        let end = barChart.getOption().xAxis[0].data[endValue];
        setTimeRangeForHeat(start, end);
        drawHeat(presentData);
    })
    window.addEventListener('resize', function() {
        barChart.resize();
    })
}