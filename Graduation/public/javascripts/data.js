$(function () {
    //导航栏点击切换页面

    function changePage(num, pageName) {
        num.bind('click', function (event) {
            $('.nav_title').removeClass('active');
            num.addClass('active');
            $('.main').css('display', 'none');
            pageName.css('display', 'block');
        });
    }
    changePage($('.one'), $('.pageOne'));
    changePage($('.two'), $('.pageTwo'));
    changePage($('.three'), $('.pageThree'));
    changePage($('.four'), $('.pageFour'));
    changePage($('.five'), $('.pageFive'));

    //筛选页面点击切换
    function navChange(data1, data2, data3, title) {
        data1.bind('click', function (event) {
            title.removeClass('active');
            data1.addClass('active');
            data2.css('display', 'none');
            data3.css('display', 'block');
        });
    }
    //页面一
    navChange($('.time_dataOne'), $('.alarm_data_pageOne'), $('.time_data_pageOne'), $('.nav_tabs_titleOne'));
    navChange($('.alarm_dataOne'), $('.time_data_pageOne'), $('.alarm_data_pageOne'), $('.nav_tabs_titleOne'));
    //页面二   
    navChange($('.time_dataTwo'), $('.alarm_data_pageTwo'), $('.time_data_pageTwo'), $('.nav_tabs_titleTwo'));
    navChange($('.alarm_dataTwo'), $('.time_data_pageTwo'), $('.alarm_data_pageTwo'), $('.nav_tabs_titleTwo'));
    //页面三
    navChange($('.time_dataThree'), $('.alarm_data_pageThree'), $('.time_data_pageThree'), $('.nav_tabs_titleThree'));
    navChange($('.alarm_dataThree'), $('.time_data_pageThree'), $('.alarm_data_pageThree'), $('.nav_tabs_titleThree'));
    //页面四
    navChange($('.time_dataFour'), $('.alarm_data_pageFour'), $('.time_data_pageFour'), $('.nav_tabs_titleFour'));
    navChange($('.alarm_dataFour'), $('.time_data_pageFour'), $('.alarm_data_pageFour'), $('.nav_tabs_titleFour'));


    //时间筛选
    function chooseTime(pageName, menuName) {
        pageName.find(menuName).bind('click', function () {
            let dropdowMenu = this.text;
            console.log(dropdowMenu);
            this.text = pageName.find('.dropdown-toggle').text();
            pageName.find(' .dropdown-toggle').html(dropdowMenu + '<span class="caret"></span>');
        });
    }
    //页面一
    chooseTime($('.time_data_pageOne'), '.dropdown-menu-one');
    chooseTime($('.time_data_pageOne'), '.dropdown-menu-two');
    chooseTime($('.alarm_data_pageOne'), '.dropdown-menu-one');
    chooseTime($('.alarm_data_pageOne'), '.dropdown-menu-two');
    //页面二
    chooseTime($('.time_data_pageTwo'), '.dropdown-menu-one');
    chooseTime($('.time_data_pageTwo'), '.dropdown-menu-two');
    chooseTime($('.alarm_data_pageTwo'), '.dropdown-menu-one');
    chooseTime($('.alarm_data_pageTwo'), '.dropdown-menu-two');
    //页面三
    chooseTime($('.time_data_pageThree'), '.dropdown-menu-one');
    chooseTime($('.time_data_pageThree'), '.dropdown-menu-two');
    chooseTime($('.alarm_data_pageThree'), '.dropdown-menu-one');
    chooseTime($('.alarm_data_pageThree'), '.dropdown-menu-two');
    //页面四
    chooseTime($('.time_data_pageFour'), '.dropdown-menu-one');
    chooseTime($('.time_data_pageFour'), '.dropdown-menu-two');
    chooseTime($('.alarm_data_pageFour'), '.dropdown-menu-one');
    chooseTime($('.alarm_data_pageFour'), '.dropdown-menu-two');
    // 基于准备好的dom，初始化echarts实例
    var lineChart = echarts.init(document.getElementById('line-chart'));
    var dataLineChart = echarts.init(document.getElementById('data-line-chart'));
    var barChart = echarts.init(document.getElementById('bar-chart'));
    var dataBarChart = echarts.init(document.getElementById('data-bar-chart'));
    var radarChart = echarts.init(document.getElementById('radar-chart'));
    var dataRadarChart = echarts.init(document.getElementById('data-radar-chart'));
    var dashBoard = echarts.init(document.getElementById('dash-board'));
    var dataDashBoard = echarts.init(document.getElementById('data-dash-board'));


    // 指定图表的配置项和数据
    /**
     * 折线图
     */
    function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 10;
        return {
            name: now.toString(),
            value: [
                [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                Math.round(value)
            ]
        }
    }

    var data = [];
    var now = +new Date(1997, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var value = Math.random() * 1000;
    for (var i = 0; i < 1000; i++) {
        data.push(randomData());
    }

    option = {
        title: {
            text: '超声波物位计',
            subtext:''
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0];
                var date = new Date(params.name);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
            },
            axisPointer: {
                animation: false
            }
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            }
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };

    setInterval(function () {

        for (var i = 0; i < 5; i++) {
            data.shift();
            data.push(randomData());
        }

        lineChart.setOption({
            series: [{
                data: data
            }]
        });
    }, 1000);

    /**
     * 柱状图
     */
    var xAxisData = [];
    var data1 = [];
    var data2 = [];
    for (var i = 0; i < 100; i++) {
        xAxisData.push('类目' + i);
        data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
    }

    option2 = {
        title: {
            text: ' '
        },
        legend: {
            data: ['bar', 'bar2'],
            align: 'left'
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            silent: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {
        },
        series: [{
            name: 'bar',
            type: 'bar',
            data: data1,
            animationDelay: function (idx) {
                return idx * 10;
            }
        }, {
            name: 'bar2',
            type: 'bar',
            data: data2,
            animationDelay: function (idx) {
                return idx * 10 + 100;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };

    /**
     * 雷达图
     */
    option3 = {
        title: {

        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['最新成交价', '预购队列']
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: {
            show: false,
            start: 0,
            end: 100
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: true,
                data: (function () {
                    var now = new Date();
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                        now = new Date(now - 2000);
                    }
                    return res;
                })()
            },
            {
                type: 'category',
                boundaryGap: true,
                data: (function () {
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(len + 1);
                    }
                    return res;
                })()
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '价格',
                max: 20,
                min: 0,
                boundaryGap: [0.2, 0.2]
            },
            {
                type: 'value',
                scale: true,
                name: '预购量',
                max: 1200,
                min: 0,
                boundaryGap: [0.2, 0.2]
            }
        ],
        series: [
            {
                name: '预购队列',
                type: 'bar',
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: (function () {
                    var res = [];
                    var len = 10;
                    while (len--) {
                        res.push(Math.round(Math.random() * 1000));
                    }
                    return res;
                })()
            },
            {
                name: '最新成交价',
                type: 'line',
                data: (function () {
                    var res = [];
                    var len = 0;
                    while (len < 10) {
                        res.push((Math.random() * 10 + 5).toFixed(1) - 0);
                        len++;
                    }
                    return res;
                })()
            }
        ]
    };
    var count = 11;
    setInterval(function () {
        axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '');

        var data3 = option3.series[0].data;
        var data4 = option3.series[1].data;
        data3.shift();
        data3.push(Math.round(Math.random() * 1000));
        data4.shift();
        data4.push((Math.random() * 10 + 5).toFixed(1) - 0);

        option3.xAxis[0].data.shift();
        option3.xAxis[0].data.push(axisData);
        option3.xAxis[1].data.shift();
        option3.xAxis[1].data.push(count++);

        radarChart.setOption(option3);
    }, 2100);

    /**
     *仪表盘
     */
    option4 = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                detail: { formatter: '{value}%' },
                data: [{ value: 50, name: '完成率' }]
            }
        ]
    };

    setInterval(function () {
        option4.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
        dashBoard.setOption(option4, true);
    }, 2000);
    /**
     * 仪表盘的時間段監控 
     */
    var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    var data5 = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    var yMax = 500;
    var dataShadow = [];

    for (var i = 0; i < data5.length; i++) {
        dataShadow.push(yMax);
    }

    option5 = {
        title: {
            text: '可缩放',
            subtext: ' '
        },
        toolbox: {
            show: true,
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: true,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            { // For shadow
                type: 'bar',
                itemStyle: {
                    normal: { color: 'rgba(0,0,0,0.05)' }
                },
                barGap: '-100%',
                barCategoryGap: '40%',
                data: dataShadow,
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ]
                        )
                    }
                },
                data: data5
            }
        ]
    };

    // Enable data zoom when user click bar.
    var zoomSize = 6;
    dataRadarChart.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        dataRadarChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
    });
    // 使用刚指定的配置项和数据显示图表。

    lineChart.setOption(option);
    dataLineChart.setOption(option);
    barChart.setOption(option2);
    dataBarChart.setOption(option2);
    radarChart.setOption(option3);
    dataRadarChart.setOption(option3);
    dashBoard.setOption(option4);
    dataDashBoard.setOption(option5);
})