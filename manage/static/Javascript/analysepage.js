var size = 0;
var male = 0;
var female = 0;
var neut = [0, 0];
var posi = [0, 0];
var nega = [0, 0];

function search_key_word() {
    var chinese_string = $("#usersearchword").val();
    if (chinese_string === "") {
        alert("请输入检索词！")
    } else {
        url = "/AnalysePage?key=" + chinese_string;
        // alert(url)
        window.location.href = url;
        window.event.returnValue = false;
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return (false);
}

function getKeyParam() {
    var query = window.location.search.substring(1);
    var vars = query.split("=");
    return decodeURI(vars[1])
}

function showURLparam() {
    $('#displayword').append(getKeyParam())
}

function go2WeiboPage(mid) {
    var weiboURL = "https://m.weibo.cn/detail/" + mid;
    window.open(weiboURL)
}

function show_details() {
    var searchword = getKeyParam();
    $.jsonAjax("content_list", {"serachword": searchword}, function (responseData) {
        if (responseData.success) {
            for (var i = 0; i < responseData.mid.length; i++) {
                rtnhtml = "<tr onclick=\"go2WeiboPage(" + responseData.mid[i] + ")\"><td>" + (i + 1) + "</td>\n" +
                    "<td>" + responseData.text[i].slice(0, 23) + "</td>\n" +
                    "<td>" + responseData.nickname[i] + "</td>\n";
                if (responseData.gender[i] === 1) {
                    male = male + 1;
                    rtnhtml = rtnhtml + "<td>男</td>";
                    if (responseData.sentiment[i] === 1) {
                        posi[0] = posi[0] + 1;
                        rtnhtml = rtnhtml + "<td>正面</td>"
                    } else {
                        if (responseData.sentiment[i] === -1) {
                            nega[0] = nega[0] + 1;
                            rtnhtml = rtnhtml + "<td>负面</td>"
                        }
                        else {
                            neut[0] = neut[0] + 1;
                            rtnhtml = rtnhtml + "<td>中性</td>"
                        }
                    }
                } else {
                    rtnhtml = rtnhtml + "<td>女</td>";
                    if (responseData.sentiment[i] === 1) {
                        posi[1] = posi[1] + 1;
                        rtnhtml = rtnhtml + "<td>正面</td>"
                    } else {
                        if (responseData.sentiment[i] === -1) {
                            nega[1] = nega[1] + 1;
                            rtnhtml = rtnhtml + "<td>负面</td>"
                        }
                        else {
                            neut[1] = neut[1] + 1;
                            rtnhtml = rtnhtml + "<td>中性</td>"
                        }
                    }
                }
                rtnhtml = rtnhtml + "</tr>";
                $('#key_word_details').append(rtnhtml)
            }
            female = responseData.mid.length - male;
            if (male !== neut[0] + nega[0] + posi[0] || female !== neut[1] + nega[1] + posi[1]) {
                alert("error!")
            }
            $('#itemTotal').append(male + female);
            $('#posiCount').append(posi[0] + posi[1]);
            $('#neutCount').append(neut[0] + neut[1]);
            $('#negaCount').append(nega[0] + nega[1]);
            barDisplay();
        }
        else {
            alert("nothing to show");
        }
    })
}

function show_keywords() {
    var searchword = getKeyParam();
    var dom = document.getElementById("treemap-simple");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    $.jsonAjax("keyword_extract", {"serachword": searchword}, function (responseData) {
        if (responseData.success) {
            option = {
                series: [{
                    type: 'treemap',
                    data: responseData.data
                }]
            };
        }
        else {
            option = {
                series: [{
                    type: 'treemap',
                    data: [{'name': 'Error!', 'value': 1}]
                }]
            };
        }
        if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    })
}

function barDisplay() {
    var dom = document.getElementById("bar-y-category-stack");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = '堆叠条形图';

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['负面', '中性', '正面']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: ['整体', '男性', '女性']
        },
        series: [
            {
                name: '负面',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [nega[0] + nega[1], nega[0], nega[1]]
            },
            {
                name: '中性',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [neut[0] + neut[1], neut[0], neut[1]]
            },
            {
                name: '正面',
                type: 'bar',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        position: 'insideRight'
                    }
                },
                data: [posi[0] + posi[1], posi[0], posi[1]]
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}