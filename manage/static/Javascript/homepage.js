function show_hot_list() {
    var rtnhtml = null;
    $.jsonAjax("hot_list", {}, function (responseData) {
        if (responseData.success) {
            if (responseData.namelist != null && responseData.namelist.length > 0) {
                for (var i = 0; i < responseData.namelist.length; i++) {
                    rtnhtml ="<tr><td>"+(i+1)+"</td><td>"+responseData.namelist[i]+"</td><td>"+responseData.hot_temper[i]+"</td><td><button type=\"button\" class=\"btn btn-outline-info btn-sm m-0\" onclick=\"goto_analyse('"+responseData.namelist[i]+"')\">详情</button></td>"+"</tr>"
                    $('#hot_list').append(rtnhtml)
                }
            }
            else {
                alert("nothing to show");
            }
        }
    })
}

function  goto_analyse(chinese_string) {
    window.location="/AnalysePage?key="+chinese_string;
    return false;
}

function search_key_word() {
    var chinese_string = $("#usersearchword").val();
    if(chinese_string===""){
        alert("请输入检索词！")
    }else {
        url="/AnalysePage?key="+chinese_string;
        // alert(url)
        window.location.href=url;
        window.event.returnValue = false;
    }
}