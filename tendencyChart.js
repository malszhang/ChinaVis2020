/**
 * 绘制趋势曲线
 */
function drawTendency(){
    var dom = document.getElementById('tendency');
    var myChart = echarts.init(dom);

    $.getJSON("../tAnalyst/data/tendency.json",function (rawData) {
        var data = splitData();
        function splitData() {
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
        /**
         * 初始化关系数据
         * @type {Array}
         */
        var datas=randomDatas();
        function randomDatas() {
            var newData = [];
            for(var i = 0 ; i < data.values.length ; i++){
                newData.push(Math.round(Math.random()*data.values[i][0]));
            }
            return newData;
        }
        var links = datas.map(function (item, i) {
            return {
                source: i,
                target: i + 1
            };
        });
        links.pop();

        /**
         *
         * @param dayCount
         * @returns {Array}
         */
        function calculateMA(line) {
            var result = [];
            for (var i = 0;i < data.values.length;i++) {
                result.push(data.values[i][line]);
            }
            return result;
        }

        var option = {
            title: {
                text: 'demo',
                left: 0
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: ['Confirmed', 'Recovered', 'Deaths']
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                data: data.categoryData,
                scale: true,
                boundaryGap: false,
                axisLine: {onZero: false},
                splitLine: {show: false},
                splitNumber: 20,
                min: 'dataMin',
                max: 'dataMax'
            },
            yAxis: {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 50
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
                    name: 'Confirmed',
                    type: 'line',
                    data: calculateMA(0),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: 'Recovered',
                    type: 'line',
                    data: calculateMA(1),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.3
                    }
                },
                {
                    name: 'Deaths',
                    type: 'line',
                    data: calculateMA(2),
                    smooth: true,
                    lineStyle: {
                        opacity: 0.3
                    }
                }
                // {
                //     name:'demo',
                //     type: 'graph',
                //     layout: 'none',
                //     coordinateSystem: 'cartesian2d',
                //     symbolSize: 40,
                //     label: {
                //         show: true
                //     },
                //     edgeSymbol: ['circle', 'arrow'],
                //     edgeSymbolSize: [4, 10],
                //     data: datas,
                //     links: links,
                //     lineStyle: {
                //         color: '#2f4554'
                //     }
                // }
            ]
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
        window.addEventListener('resize',function () {
            myChart.resize();
        })
    })
}