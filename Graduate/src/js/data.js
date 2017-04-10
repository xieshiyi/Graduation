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


    var socket = io('http://monitor.io:8080/');
    socket.on('monitor', function (obj) {
        /** 监听后台数据变化
         * 各个仓库变化，传送变化的数据，进行处理后展示到前端
        */
        if (obj.number == '1') {
            $.get('/api/monitor/repo?repo=1&number=1', function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    var axisData = new Date(responseTxt[0].time).toLocaleTimeString().replace(/^\D*/, '');
                    var data = option.series[0].data;
                    data.shift();
                    data.push((responseTxt[0].height).toFixed(2));
                    option.xAxis.data.shift();
                    option.xAxis.data.push(axisData);
                    lineChart.setOption(option);

                    console.log('1号仓库---' + new Date(responseTxt[0].time) + '---' + responseTxt[0].height);
                }
                if (statusTxt == "error")
                    console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });
        }
        if (obj.number == '2') {
            $.get('/api/monitor/repo?repo=2&number=1', function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    var axisData = new Date(responseTxt[0].time).toLocaleTimeString().replace(/^\D*/, '');
                    var dataBar = optionBar.series[0].data;
                    dataBar.shift();
                    dataBar.push((responseTxt[0].height).toFixed(2));
                    optionBar.xAxis.data.shift();
                    optionBar.xAxis.data.push(axisData);
                    barChart.setOption(optionBar);

                    console.log('2号仓库---' + new Date(responseTxt[0].time) + '---' + responseTxt[0].height);
                }
                if (statusTxt == "error")
                    console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });
        }
        if (obj.number == '3') {
            $.get('/api/monitor/repo?repo=3&number=1', function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    var newdataRadar = (responseTxt[0].height.toFixed(2)) / 10;
                    optionRadar.series[0].data = [newdataRadar, newdataRadar - 0.1, newdataRadar - 0.2, newdataRadar - 0.3];
                    radarChart.setOption(optionRadar);
                    console.log('新水球数据：' + newdataRadar);
                    console.log('3号仓库---' + new Date(responseTxt[0].time) + '---' + responseTxt[0].height);
                }
                if (statusTxt == "error")
                    console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });
        }
        console.log('client-msg:' + obj.number);
    });

    // 指定图表的配置项和数据
    /**
     * 折线图
     */
    /**
     * 初始化数据
     * dataLine:折线图初始化数据
     * xAxisDataLine:X轴初始化
     */
    var dataLine = [];
    var xAxisDataLine = [];
    $.ajax({
        type: "get",
        url: "/api/monitor/repo?repo=1&number=10",
        async: false,
        success: function (data) {
            var res = [];
            var xLine = [];
            var len = 0;
            while (len < 10) {
                res.unshift((data[len].height).toFixed(2));
                xLine.unshift(new Date(data[len].time).toLocaleTimeString().replace(/^\D*/, ''));
                len++;
            }

            dataLine = res;
            xAxisDataLine = xLine;
            console.log('折线图X轴初始化：:---' + xAxisDataLine);
            console.log('折线图数据初始化:---' + dataLine);
        }
    });
    option = {
        title: {
            text: '超声波物位计',
            subtext: ''
        },
        legend: {
            data: ['最新高度'],
            align: 'left'
        },
        tooltip: {
            trigger: 'axis',
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
            type: 'category',
            splitLine: {
                show: false
            },
            splitLine: { //网格线
                show: true,
                lineStyle: {
                    color: ['#b1b1b1'],
                    type: 'dashed'
                }
            },
            boundaryGap: true,
            data: xAxisDataLine
        },
        yAxis: {
            splitLine: { //网格线
                show: true,
                lineStyle: {
                    color: ['#b1b1b1'],
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '最新高度',
            type: 'line',
            data: dataLine

        }]
    };


    /**
     * 柱状图
     * xAxisDataBar：柱状图X轴初始化
     * dataBar：柱状图数据初始化
     */
    var xAxisDataBar = [];
    var dataBar = [];
    $.ajax({
        type: "get",
        url: "/api/monitor/repo?repo=2&number=10",
        async: false,
        success: function (data) {
            var res = [];
            var xBar = [];
            var len = 0;
            while (len < 10) {
                res.unshift((data[len].height).toFixed(2));
                xBar.unshift(new Date(data[len].time).toLocaleTimeString().replace(/^\D*/, ''));
                len++;
            }

            dataBar = res;
            xAxisDataBar = xBar;
            console.log('柱状图X轴初始化:---' + xAxisDataBar);
            console.log('柱状图数据初始化:---' + dataBar);
        }
    });
    optionBar = {
        tooltip: { trigger: 'axis' },
        legend: {
            data: ['最新高度']
        },
        toolbox: {
            show: true,
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: { readOnly: false },
                saveAsImage: {
                    pixelRatio: 2
                },
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: xAxisDataBar
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            name: '最新高度',
            type: 'bar',
            data: dataBar,
            animationDelay: function (idx) {
                return idx * 10;
            }
        }],
        animationEasing: 'elasticOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        }
    };

    /**
     * 雷达图
     * dataRader：水球图数据初始化
     */
    var dataRadar = [];
    $.ajax({
        type: "get",
        url: "/api/monitor/repo?repo=3&number=1",
        async: false,
        success: function (data) {
            var len = 0;
            while (len < 4) {
                dataRadar.push((data[0].height.toFixed(2)) / 10 - len / 10);
                len++;
            }
            console.log('水球图:---' + dataRadar);
        }
    });

    optionRadar = {
        series: [{
            type: 'liquidFill',
            data: dataRadar,
            radius: '80%'
        }]
    };

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

    // 使用刚指定的配置项和数据显示图表。

    lineChart.setOption(option);
    dataLineChart.setOption(option);
    barChart.setOption(optionBar);
    dataBarChart.setOption(optionBar);
    radarChart.setOption(optionRadar);
    dataRadarChart.setOption(optionRadar);
    dashBoard.setOption(option4);
    //dataDashBoard.setOption(option5);
})