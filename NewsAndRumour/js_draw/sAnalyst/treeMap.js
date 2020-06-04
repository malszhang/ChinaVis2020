function drawTreeMap(provinceDate) {
    var dom = document.getElementById("treeMap");
    var treeMapChart = echarts.init(dom);
    var treeOption = null;
    treeMapChart.showLoading();
    $.get('data/textcategory.json', function (data) {
        treeMapChart.hideLoading();
        var formatUtil = echarts.format;

        let province = provinceDate.province;
        let time = provinceDate.date;
        
        let selectedData = [];
        for(let i = 0;i<data.length;++i){
            if(data[i].province == province){
                for(let j = 0;j<data[i].date.length;++j){
                    if(data[i].date[j].date == time){
                        selectedData = data[i].date[j];
                    }
                }
            }
        }
        let list = getList(selectedData);

        treeMapChart.setOption(
            treeOption = {
            tooltip: {
                formatter: function (info) {
                    var value = info.value;
                    var treePathInfo = info.treePathInfo;
                    var treePath = [];

                    for (var i = 1; i < treePathInfo.length; i++) {
                        treePath.push(treePathInfo[i].name);
                    }
                    return [
                        '<div class="tooltip-title">' + formatUtil.encodeHTML(info.name) + '</div>',
                        '个数: ' + formatUtil.addCommas(value),
                    ].join('');
                }
            },
            series: [
                {
                    type: 'treemap',
                    label: {
                        show: true,
                        formatter: '{b}'
                    },
                    roam:false,
                    nodeClick:false,
                    breadcrumb:false,
                    upperLabel: {
                        show: true,
                        height: 30
                    },
                    itemStyle: {
                        borderColor: '#fff'
                    },
                    levels: getLevelOption(),
                    data: list
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

function getList(data){
    let list = [];
    let nameList = ['行业战疫', '境内疫情', '境外疫情', '政府行动', '辟谣', '事实', '误区', '谣言'];
    for(let i = 0 ; i < nameList.length ; i++){
        list.push({
            name: nameList[i],
            id:nameList[i],
            value: Number(data[nameList[i]].value),
            children:getChildren(data[nameList[i]].children,nameList[i])
        });
    }
    return list;
}

function getChildren(childrenList,id) {
    let children = [];
    for(let i = 0 ; i < childrenList.length ; i++){
        children.push({
            id:id,
            name:childrenList[i].name,
            value:childrenList[i].value,
        })
    }
    return children;
}

function getLevelOption() {
    return [
        {
            color:['#74add1', '#313695', '#4575b4', '#abd9e9', '#fee090', '#d73027', '#fdae61', '#f46d43'],
            colorMappingBy: 'id',
            itemStyle: {
                borderColor: '#039e6d',
                borderWidth: 0,
                gapWidth: 1
            },
            upperLabel: {
                show: false
            }
        },
        {
            itemStyle: {
                borderColor: '#037c55',
                borderWidth: 5,
                gapWidth: 1
            },
            emphasis: {
                itemStyle: {
                    borderColor: '#ddd'
                }
            }
        }
    ];
}