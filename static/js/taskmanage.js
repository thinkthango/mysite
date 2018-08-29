
$(document).ready(function(){
//$("input[name='username']").val(getCookie("username"));
});

function addClick(){
    $("input[name='taskdate']").val(getNowFormatDate());
    jQuery('body,.addBox').show();
    return 0;
}
function editClick(){
    //拿展示数据
    taskno = $("input[name='select_record']:checked").parent().next().text();
     $.ajax({
        type : "GET",
        async : false,
        cache : false,
        url : "./select_taskbyno",
        data : "taskno=" + taskno,
        success:function(data){
//                for(i=0;i<data.length;i++){
//                  console.log(data[i]);
//                }
//                alert(data);
                data = JSON.parse(data); //字符串转JSON
                console.log(data);
                for(var key in data){
                    console.log(key);
                }
                console.log(data['taskno']);
                console.log(data['taskcontent']);
                console.log(data['taskdate']);
                console.log(data['taskperson']);
                console.log(data['taskstatus']);
                console.log(data['taskps']);
                $('.editForm input[name="taskno"]').val(data['taskno']);
                $('.editForm textarea[name="taskcontent"]').val(data['taskcontent']);
                $('.editForm input[name="taskdate"]').val(data['taskdate']);
                $('.editForm select[name="taskperson"]').val(data['taskperson']);
                $('.editForm select[name="taskstatus"]').val(data['taskstatus']);
                $('.editForm input[name="taskps"]').val(data['taskps']);
            },
        error :function(){alert('请求错误！');}
    });
    jQuery('body,.editBox').show();
    return 0;
}

function addTask(){
    taskno = $("input[name='taskno']").val();
    taskcontent = $("textarea[name='taskcontent']").val();
    taskdate = $("input[name='taskdate']").val();
    taskperson = $("select[name='taskperson']").val();
    taskstatus = $("select[name='taskstatus']").val();
    taskps = $("input[name='taskps']").val();

    clearAddbox();
    $('.addBox').hide();

    $.ajax({
        type : "POST",
        async : false,
        cache : false,
        url : "./add",
        data : JSON.stringify({
            'taskno':taskno,
            'taskcontent':taskcontent,
            'taskdate':taskdate,
            'taskperson':taskperson,
            'taskstatus':taskstatus,
            'taskps':taskps,
            'csrfmiddlewaretoken':$("[name='csrfmiddlewaretoken']").val() //getCookie("csrftoken")
            }),
        error :function(){alert('请求错误！');}
    });

    //刷新当前页
    sleep(1000);
    window.location.reload();
//    setTimeout(function(){window.location.reload();},1000);

    return false;
}

function editTask(){
    $('.editBox').hide();
    taskno = $('.editForm input[name="taskno"]').val();
    taskstatus = $('.editForm select[name="taskstatus"]').val();
    taskps = $('.editForm input[name="taskps"]').val();

    $.ajax({
        type : "POST",
        async : false,
        cache : false,
        url : "./update_taskbyno",
        data : JSON.stringify({
            'taskno':taskno,
            'taskcontent':taskcontent,
            'taskstatus':taskstatus,
            'taskps':taskps,
            'csrfmiddlewaretoken':$("[name='csrfmiddlewaretoken']").val() //getCookie("csrftoken")
            }),
        success:function(data){},
        error :function(){alert('请求错误！');}
    });

    //刷新当前页
    sleep(1000);
    window.location.reload();
//    setTimeout(function(){window.location.reload();},1000);
    return false;
}


function clearAddbox(){
    //$("input[name='taskno']").val('');
    $("textarea[name='taskcontent']").val('');
    $("input[name='taskdate']").val(getNowFormatDate());
    $("select[name='taskperson']").val('');
    $("select[name='taskstatus']").val('未开始');
    $("input[name='taskps']").val('');

}

//已完成状态数据背景色置灰
turnGray();
function turnGray(){
    $(".data_table tr").children().each(function(){
        if ($(this).text()=='已完成'){
            $(this).parent().css({"background":"gray","opacity":"0.8"});
        }
    });
}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    {
    c_start=c_start + c_name.length + 1
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    }
  }
return ""
}

function sleep(d){
  for(var t = Date.now();Date.now() - t <= d;);
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "T" + date.getHours() + seperator2 + date.getMinutes();
            //+ seperator2 + date.getSeconds();
    return currentdate;
}