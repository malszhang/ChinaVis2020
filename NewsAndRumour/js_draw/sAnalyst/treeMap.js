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
            title: {
                text: province,
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
                        '<div class="tooltip-title">' + formatUtil.encodeHTML(info.name) + '</div>',
                        '个数: ' + formatUtil.addCommas(value),
                    ].join('');
                }
            },
            series: [
                {
                    name: province,
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
    list.push({
        name: '境内疫情',
        value: Number(data['境内疫情'].value),
        children:getChildren(data['境内疫情'].children)
    });
    list.push({
        name: '境外疫情',
        value: Number(data['境外疫情'].value),
        children:getChildren(data['境外疫情'].children)
    });
    list.push({
        name: '政府行动',
        value: Number(data['政府行动'].value),
        children:getChildren(data['政府行动'].children)
    });
    list.push({
        name: '行业战疫',
        value: Number(data['行业战疫'].value),
        children:getChildren(data['行业战疫'].children)
    });
    return list;
}

function getChildren(childrenList) {

    let children = [];
    for(let i = 0 ; i < childrenList.length ; i++){
        children.push({
            name:childrenList[i].name,
            value:childrenList[i].value
        })
    }
    return children;
}

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