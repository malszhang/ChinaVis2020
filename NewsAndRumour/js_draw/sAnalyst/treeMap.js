function drawTreeMap() {
    var dom = document.getElementById("treeMap");
    var treeMapChart = echarts.init(dom);
    var treeOption = null;
    function getLevelOption() {
        return [
            {
                itemStyle: {
                    borderColor: '#777',
                    borderWidth: 0,
                    gapWidth: 1
                },
                upperLabel: {
                    show: false
                }
            },
            {
                itemStyle: {
                    borderColor: '#555',
                    borderWidth: 5,
                    gapWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        borderColor: '#ddd'
                    }
                }
            },
            {
                colorSaturation: [0.35, 0.5],
                itemStyle: {
                    borderWidth: 5,
                    gapWidth: 1,
                    borderColorSaturation: 0.6
                }
            }
        ];
    }

    treeMapChart.showLoading();
    $.get('data/treeMap.json', function (diskData) {
        treeMapChart.hideLoading();
        var formatUtil = echarts.format;

        treeMapChart.setOption(
            treeOption = {
            title: {
                text: 'Disk Usage',
                left: 'center'
            },
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }

                    return [
                        '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                        'Disk Usage: ' + formatUtil.addCommas(value) + ' KB',
                    ].join('');
                }
            },

            series: [
                {
                    name: 'Disk Usage',
                    type: 'treemap',
                    visibleMin: 300,
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    upperLabel: {
                        show: true,
                        height: 30
                    },
                    itemStyle: {
                        borderColor: '#fff'
                    },
                    levels: getLevelOption(),
                    data: diskData
                }
            ]
        });
    });

    if (treeOption && typeof treeOption === "object") {
        treeMapChart.setOption(treeOption, true);
    }
    window.addEventListener('resize', function() {
        treeMapChart.resize();
    })
}