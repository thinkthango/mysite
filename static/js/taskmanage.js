
var flgCheckResponseData = false;

$.ajaxSetup({
  async: false
  });
//读取cookie中的用户名(未ready时设置value失败！！！)
//alert()
//alert(document.cookie)

$(document).ready(function(){
$("input[name='username']").val(getCookie("username"));
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


    if (flgCheckResponseData)
        setCookie(username);
    return flgCheckResponseData;

}

function addtask(){
    $("input[name='taskno']").val('');
    $("input[name='taskcontent']").val('');
    $("input[name='taskdate']").val('');
    $("input[name='taskperson']").val('');
    $("input[name='taskstatus']").val('未开始');
    $("input[name='taskps']").val('');

}

