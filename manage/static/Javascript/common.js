(function (jQuery) {
    jQuery.extend({
        jsonAjax: function (method_name, data, successfn, ajaxfun) {
            if (null == method_name || "" == method_name) {
                alert("method_name不能为空……");
                return;
            }
            ajaxfun = (null == ajaxfun || "" == ajaxfun) ? {} : ajaxfun;
            ajaxfun.async = (ajaxfun.async == null || ajaxfun.async == "" || typeof (ajaxfun.async) == "undefined") ? "true" : ajaxfun.async;
            ajaxfun.type = (ajaxfun.type == null || ajaxfun.type == "" || typeof (ajaxfun.type) == "undefined") ? "post" : ajaxfun.type;
            $.ajax({
                type: ajaxfun.type,
                async: ajaxfun.async,
                data: {
                    "data": JSON.stringify(data)
                },
                url: "/ControlCenter?method_name=" + method_name,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                dataType: "json",
                success: function (d) {
                    //检测EXCEPTION
                    if (d != null && d != undefined && d.EXCEPTION != null && d.EXCEPTION != undefined) {
                        alert(d.EXCEPTION);
                    } else {
                        successfn(d);
                    }

                },
                error: function (e) {
                    alert(e);
                }
            });
        }

    })
})(jQuery);