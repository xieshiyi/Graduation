$(function () {
    /**
     * socket:websocket对象，与和服务端进行通信
     */
    var socket = io('http://monitor.io:8080/');
    
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
 *年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 */
Date.prototype.Format = function (fmt) {  
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
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

    /**
     * 管理员界面
     * 邮箱账号管理：
     * email：邮箱账号
     */

    function initEmail() {
        $.ajax({
            type: "get",
            url: '/api/email/info',
            async: false,
            success: function (data) {
                $('.email').val(data[0].email);
                console.log('邮箱账号：---' + data[0].email);
                // socket.emit('emailInfo', { 'email': data[0].email });
            }
        });
    }
    initEmail();

    $('.btn_modify').bind('click', function () {
        document.getElementsByClassName('email')[0].disabled = '';
        $('.btn_bind').css('display', 'inline-block');
        $('.btn_modify').css('display', 'none');

    });
    $('.btn_bind').bind('click', function () {
        var email = $('.email').val();
        var matchEmail = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
        console.log(email);
        if (email == '') {
            alert('请输入绑定邮箱账号!');
        }
        else if (matchEmail.exec(email)) {
            var email_posting = $.get('/api/email/updateEmail', { email: email }, function (result) {
                alert('绑定成功！');
            });
            initEmail();
            document.getElementsByClassName('email')[0].disabled = 'disabled';
            $('.btn_bind').css('display', 'none');
            $('.btn_modify').css('display', 'inline-block');
        }
        else {
            alert('请输入正确邮箱账号！');
        }
    });

    // 基于准备好的dom，初始化echarts实例
    var lineChart = echarts.init(document.getElementById('line-chart'));
    var dataLineChart = echarts.init(document.getElementById('data-line-chart'));
    var barChart = echarts.init(document.getElementById('bar-chart'));
    var dataBarChart = echarts.init(document.getElementById('data-bar-chart'));
    var radarChart = echarts.init(document.getElementById('radar-chart'));
    var dataRadarChart = echarts.init(document.getElementById('data-radar-chart'));
    var dashBoard = echarts.init(document.getElementById('dash-board'));
    var dataDashBoard = echarts.init(document.getElementById('data-dash-board'));


    /**
     * 查询仓库信息
     */
    function getwarehouse(repo) {
        var result = [];
        $.ajax({
            type: "get",
            url: "/api/warehouse/getWarehouseByParam?repo=" + repo + "",
            async: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }
    /**
     * 插入报警信息
     */
    function insertWarning(repo, time, height) {
        var result = [];
        $.ajax({
            type: "get",
            url: "/api/email/insertWarning?repo=" + repo + "&time=" + time + "&height=" + height,
            async: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }
    socket.on('monitor', function (obj) {
        /** 监听后台数据变化
         * 各个仓库变化，传送变化的数据，进行处理后展示到前端
        */
        if (obj.number == '1') {
            $.get('/api/monitor/repo?repo=1&number=1', function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    var axisData = new Date(responseTxt[0].time).Format("hh:mm:ss");
                    var data = option.series[0].data;
                    data.shift();
                    data.push((responseTxt[0].height).toFixed(2));
                    option.xAxis.data.shift();
                    option.xAxis.data.push(axisData);
                    lineChart.setOption(option);
                    var repoInfo = getwarehouse(1);
                    if (responseTxt[0].height > repoInfo[0].limit_upper || responseTxt[0].height < repoInfo[0].limit_lower) {
                        var emailAccount = $('.email').val();
                        socket.emit('alarm', { 'email': emailAccount, 'time': new Date(responseTxt[0].time).Format("yyyy-MM-dd hh:mm:ss"), 'repo': '1', 'height': (responseTxt[0].height).toFixed(2) });
                        console.log('仓库1插入报警信息！时间为：' + responseTxt[0].time);
                        insertWarning('1', responseTxt[0].time, (responseTxt[0].height).toFixed(2));
                    }
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
                    var repoInfo = getwarehouse(2);
                    if (responseTxt[0].height > repoInfo[0].limit_upper || responseTxt[0].height < repoInfo[0].limit_lower) {
                        var emailAccount = $('.email').val();
                        socket.emit('alarm', { 'email': emailAccount, 'time': new Date(responseTxt[0].time).Format("yyyy-MM-dd hh:mm:ss"), 'repo': '2', 'height': (responseTxt[0].height).toFixed(2) });
                        console.log('仓库2插入报警信息！');
                        insertWarning('2', responseTxt[0].time, (responseTxt[0].height).toFixed(2));
                    }
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
                    var repoInfo = getwarehouse(3);
                    if (responseTxt[0].height > repoInfo[0].limit_upper || responseTxt[0].height < repoInfo[0].limit_lower) {
                        var emailAccount = $('.email').val();
                        socket.emit('alarm', { 'email': emailAccount, 'time': new Date(responseTxt[0].time).Format("yyyy-MM-dd hh:mm:ss"), 'repo': '3', 'height': (responseTxt[0].height).toFixed(2) });
                        console.log('仓库3插入报警信息！');
                        insertWarning('3', responseTxt[0].time, (responseTxt[0].height).toFixed(2));
                    }
                }
                if (statusTxt == "error")
                    console.log("Error: " + xhr.status + ": " + xhr.statusText);
            });
        }
        if (obj.number == '4') {
            $.get('/api/monitor/repo?repo=4&number=1', function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    var newdataBoard = (responseTxt[0].height * 10).toFixed(2);
                    optionBoard.series[0].data[0].value = newdataBoard;
                    optionBoard.series[0].axisLine.lineStyle.color[0][0] = (newdataBoard / 100).toFixed(2);
                    optionBoard.series[0].axisLine.lineStyle.color[0][1] = detectionData(newdataBoard);
                    dashBoard.setOption(optionBoard);
                    var repoInfo = getwarehouse(4);
                    if (responseTxt[0].height > repoInfo[0].limit_upper || responseTxt[0].height < repoInfo[0].limit_lower) {
                        var emailAccount = $('.email').val();
                        socket.emit('alarm', { 'email': emailAccount, 'time': new Date(responseTxt[0].time).Format("yyyy-MM-dd hh:mm:ss"), 'repo': '4', 'height': (responseTxt[0].height).toFixed(2) });
                        console.log('仓库4插入报警信息！');
                        insertWarning('4', responseTxt[0].time, (responseTxt[0].height).toFixed(2));
                    }
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
                xLine.unshift(new Date(data[len].time).Format("hh:mm:ss"));
                len++;
            }

            dataLine = res;
            xAxisDataLine = xLine;
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
                xBar.unshift(new Date(data[len].time).Format("hh:mm:ss"));
                len++;
            }

            dataBar = res;
            xAxisDataBar = xBar;
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
            itemStyle: {
                normal: { color: '#749f83' }
            },
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
    var dataBoard = 0;
    $.ajax({
        type: "get",
        url: "/api/monitor/repo?repo=3&number=1",
        async: false,
        success: function (data) {
            dataBoard = (data[0].height * 10).toFixed(2);
        }
    });
    function detectionData(str) {
        var color = '#5eb95e';
        if (str >= 20 && str <= 80) {
            color = '#F37B1D';
        } else if (str > 80) {
            color = '#dd514c';
        }
        return color;
    }
    var optionBoard = {
        "tooltip": {
            "formatter": "{a} <br/>{b} : {c}%"
        },
        "series": [{
            "name": "业务指标",
            "type": "gauge",
            "splitNumber": 5,
            "axisLine": {
                "lineStyle": {
                    "color": [
                        [(dataBoard / 100).toFixed(2), detectionData(dataBoard)],
                        [1, "#e9ecf3"]
                    ],
                    "width": 50
                }
            },
            "axisTick": {
                "lineStyle": {
                    "color": "#3bb4f2",
                    "width": 3
                },
                "length": -25,
                "splitNumber": 1
            },
            "axisLabel": {
                "distance": -80,
                "textStyle": {
                    "color": "#000"
                }
            },
            "splitLine": {
                "show": false
            },
            "itemStyle": {
                "normal": {
                    "color": "#494f50"
                }
            },
            "detail": {
                "formatter": "{value}%",
                "offsetCenter": [0, "60%"],
                "textStyle": {
                    "fontSize": 30,
                    "color": "#F37B1D"
                }
            },
            "title": {
                "offsetCenter": [0, "100%"]
            },
            "data": [{
                "name": "高度",
                "value": dataBoard
            }]
        }]
    }

    /**
     * 時間段監控 图表
     * 仓库1:optionSelect1
     */
    function initData(repo, minutes) {
        var xRepo = [];
        var dataRepo = [];
        $.ajax({
            type: "get",
            url: "/api/monitor/repo/select?repo=" + repo + "&minutes=" + minutes + "",
            async: false,
            success: function (data) {
                var res = [];
                var xData = [];
                var len = 0;
                while (len < data.length) {
                    res.unshift((data[len].height).toFixed(2));
                    xData.unshift(new Date(data[len].time).Format("hh:mm:ss"));
                    len++;
                }
                xRepo = xData;
                dataRepo = res;
            }
        });
        var result = { time: xRepo, height: dataRepo };
        return result;
    }
    /**
 * 时间段监控图表数据初始化
 * result1:时间段 图表1
 * result2:时间段 图表2
 * result3:时间段 图表3
 * result4:时间段 图表4 
 */
    var result1 = initData(1, 5);
    var result2 = initData(2, 5);
    var result3 = initData(3, 5);
    var result4 = initData(4, 5);
    optionSelect1 = {
        title: {
            text: '时间段高度',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['高度']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {},
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: result1.time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} m'
            }
        },
        series: [
            {
                name: '高度',
                type: 'line',
                data: result1.height,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };

    optionSelect2 = {
        title: {
            text: '时间段高度',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['高度']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {},
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: result2.time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} m'
            }
        },
        series: [
            {
                itemStyle: {
                    normal: { color: '#ca8622' }
                },
                name: '高度',
                type: 'line',
                data: result2.height,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };
    optionSelect3 = {
        title: {
            text: '时间段高度',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['高度']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {},
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: result3.time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} m'
            }
        },
        series: [
            {
                itemStyle: {
                    normal: { color: '#61a0a8' }
                },
                name: '高度',
                type: 'line',
                data: result3.height,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };
    optionSelect4 = {
        title: {
            text: '时间段高度',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['高度']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {},
                dataView: { readOnly: false },
                magicType: { type: ['line', 'bar'] },
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: result4.time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} m'
            }
        },
        series: [
            {
                itemStyle: {
                    normal: { color: '#d48265' }
                },
                name: '高度',
                type: 'line',
                data: result4.height,
                markPoint: {
                    data: [
                        { type: 'max', name: '最大值' },
                        { type: 'min', name: '最小值' }
                    ]
                },
                markLine: {
                    data: [
                        { type: 'average', name: '平均值' }
                    ]
                }
            }
        ]
    };
    /**
     * 时间段筛选
     */
    function chooseTimeData(pageName, menuName, repo, option, chart) {
        var m = 0;
        pageName.find(menuName).bind('click', function () {
            let dropdowMenu = this.text;
            this.text = pageName.find('.dropdown-toggle').text();
            pageName.find(' .dropdown-toggle').html(dropdowMenu + '<span class="caret"></span>');
            console.log(dropdowMenu);
            if (dropdowMenu === '30分钟内') {
                m = 30;
            }
            else if (dropdowMenu === '1小时内') {
                m = 60;
            }
            else {
                m = 5;
            }
            console.log(m);
            var result = initData(repo, m);
            option.xAxis.data = result.time;
            option.series[0].data = result.height;
            chart.setOption(option);
        });
    }
    /**
     * 报警详情查询初始化查询
     * repo：仓库
     * minutes：时间段内
     * alarm1: 仓库1报警详情
     * alarm2：仓库2报警详情
     * alarm3：仓库3报警详情
     * alarm4：仓库4报警详情
     */
    function initAlarm(repo, minutes) {
        var result = [];
        $.ajax({
            type: "get",
            url: "/api/email/getAlarmByParam?repo=" + repo + "&minutes=" + minutes + "",
            async: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }
    function insertToTable(data, table) {
        var row = table.find('tbody');
        row.find('tr').remove();
        if (data[0] == undefined) {
            row.append('<tr><td>-</td><td>-</td><td>-</td><td>-</tr>');
        }
        $.each(data, function (i, n) {
            console.log(n)
            row.append('<tr><td>' + (i + 1) + '</td><td>' + new Date(n.time).Format("yyyy-MM-dd") + '</td><td>' + new Date(n.time).Format("hh:mm:ss") + '</td><td>' + n.height + '</tr>');
        });
    }
    var alarm1 = initAlarm(1, 5);
    var alarm2 = initAlarm(2, 5);
    var alarm3 = initAlarm(3, 5);
    var alarm4 = initAlarm(4, 5);
    insertToTable(alarm1, $('.table_one'));
    insertToTable(alarm2, $('.table_two'));
    insertToTable(alarm3, $('.table_three'));
    insertToTable(alarm4, $('.table_four'));
    /**
     * 报警详情查询
     */
    function chooseAlarmData(pageName, menuName, repo, table) {
        var m = 0;
        pageName.find(menuName).bind('click', function () {
            let dropdowMenu = this.text;
            this.text = pageName.find('.dropdown-toggle').text();
            pageName.find(' .dropdown-toggle').html(dropdowMenu + '<span class="caret"></span>');
            console.log(dropdowMenu);
            if (dropdowMenu === '30分钟内') {
                m = 30;
            }
            else if (dropdowMenu === '1小时内') {
                m = 60;
            }
            else {
                m = 5;
            }
            console.log(m);
            var result = initAlarm(repo, m);
            insertToTable(result, table);
        });
    }

    //页面一
    chooseTimeData($('.time_data_pageOne'), '.dropdown-menu-one', '1', optionSelect1, dataLineChart);
    chooseTimeData($('.time_data_pageOne'), '.dropdown-menu-two', '1', optionSelect1, dataLineChart);
    chooseAlarmData($('.alarm_data_pageOne'), '.dropdown-menu-one', '1', $('.table_one'));
    chooseAlarmData($('.alarm_data_pageOne'), '.dropdown-menu-two', '1', $('.table_one'));
    //页面二
    chooseTimeData($('.time_data_pageTwo'), '.dropdown-menu-one', '2', optionSelect2, dataBarChart);
    chooseTimeData($('.time_data_pageTwo'), '.dropdown-menu-two', '2', optionSelect2, dataBarChart);
    chooseAlarmData($('.alarm_data_pageTwo'), '.dropdown-menu-one', '2', $('.table_two'));
    chooseAlarmData($('.alarm_data_pageTwo'), '.dropdown-menu-two', '2', $('.table_two'));
    //页面三
    chooseTimeData($('.time_data_pageThree'), '.dropdown-menu-one', '3', optionSelect3, dataRadarChart);
    chooseTimeData($('.time_data_pageThree'), '.dropdown-menu-two', '3', optionSelect3, dataRadarChart);
    chooseAlarmData($('.alarm_data_pageThree'), '.dropdown-menu-one', '3', $('.table_three'));
    chooseAlarmData($('.alarm_data_pageThree'), '.dropdown-menu-two', '3', $('.table_three'));
    //页面四
    chooseTimeData($('.time_data_pageFour'), '.dropdown-menu-one', '4', optionSelect4, dataDashBoard);
    chooseTimeData($('.time_data_pageFour'), '.dropdown-menu-two', '4', optionSelect4, dataDashBoard);
    chooseAlarmData($('.alarm_data_pageFour'), '.dropdown-menu-one', '4', $('.table_four'));
    chooseAlarmData($('.alarm_data_pageFour'), '.dropdown-menu-two', '4', $('.table_four'));

    // 使用刚指定的配置项和数据显示图表。

    lineChart.setOption(option);
    dataLineChart.setOption(optionSelect1);
    barChart.setOption(optionBar);
    dataBarChart.setOption(optionSelect2);
    radarChart.setOption(optionRadar);
    dataRadarChart.setOption(optionSelect3);
    dashBoard.setOption(optionBoard);
    dataDashBoard.setOption(optionSelect4);
})