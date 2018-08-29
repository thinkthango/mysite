//function msg(){
//    username = document.getElementsByClassName("reg_user").username.value;
//    password = document.getElementsByClassName("reg_pwd").password.value;
//    if (username.trim() == '' || password.trim() == '')
//    {
//        alert("please input username and password!");
//        return 0;
//    }
//
//    alert(username + "\n" +  password);
//
//}
var flgCheckResponseData = false;

$.ajaxSetup({
  async: false
  });

function checkInput(){
    var username = $("input[name='username']").val();
    var password = $("input[name='password']").val();

    if (username.trim() == '' || password.trim() == '')
    {
        $(".label_info").css({"display":"block"});
        $(".label_info").text("please input username and password!");
        $(".label_info").fadeOut(3000);
        return false;
    }

    $.post(window.location.protocol + '//' + window.location.host + "/userinfo/check",
        {
            username:username,
            password:password,
            flgstr:'register',
            csrfmiddlewaretoken:$("[name='csrfmiddlewaretoken']").val()
        },
        function(result,status){
            console.log(result);
            result = JSON.parse(result);
            //if (result.indexOf("NG") != -1) {
            if (result["result"] == "NG") {
                $(".label_info").css({"display":"block"});
                $(".label_info").text("username alreay exists!");
                $(".label_info").fadeOut(3000);
                flgCheckResponseData = false;
            } else {
                //$(".label_info").css({"display":"none"})
                $(".label_info").text("success");
                $(".label_info").css({"color":"blue","display":"block"});
                $(".label_info").fadeOut(2000);
                flgCheckResponseData = true;
            }
        }
    );

//    $.ajax({
//        type : "POST",
//        async : false,
//        cache : false,
//        url : "http://127.0.0.1:8000/register/check",
//        data : JSON.stringify({
//            'username':username,
//            'csrfmiddlewaretoken':$("[name='csrfmiddlewaretoken']").val()
//            }),
//        success : checkResponseData(result,status)
//    });

    //debugger;
    //document.write("flgCheckResponseData:" + flgCheckResponseData);

    //cookie中添加用户名
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + 14 * (24 * 60 * 60 * 1000));
    document.cookie = "username=" + username+ "; expires=" + expdate.toGMTString()+"; path=/";
    document.cookie = "secure; path=/";
    return flgCheckResponseData;
}


function StringFormat() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

//$(document).ready(function(){
//    $(".reg_btn").click(
//        checkInput();
//    );
//});
