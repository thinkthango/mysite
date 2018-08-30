
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
    sleep(500);
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
            //'taskcontent':taskcontent,
            'taskstatus':taskstatus,
            'taskps':taskps,
            'csrfmiddlewaretoken':$("[name='csrfmiddlewaretoken']").val() //getCookie("csrftoken")
            }),
        success:function(data){},
        error :function(){alert('请求错误！');}
    });

    //刷新当前页
    sleep(500);
    console.log('after editTask\'s ajax');
    window.location.reload();
//    setTimeout(function(){window.location.reload();},1000);
    return false;
}

function delTask(){
    if (!window.confirm("是否确认删除该数据？")){
        return 0;
    }
    taskno = $("input[name='select_record']:checked").parent().next().text();
     $.ajax({
        type : "GET",
        async : false,
        cache : false,
        url : "./delete_taskbyno",
        data : "taskno=" + taskno,
        success:function(){},
        error :function(){alert('请求错误！');}
    });
    //刷新当前页
    sleep(500);
    window.location.reload();
    return 0;
}

function searchPerson(){
    searchperson = $('select[name="search_person"] option:selected').text();
    if(searchperson.trim()==''){
        window.location.reload();
        return true;
    }
    $.ajax({
            type : "GET",
            async : false,
            cache : false,
            url : "./search",
            dataType: "json",
            data : "searchperson=" + searchperson,
            success:function(data){
                var tasks = data.tasks;
                var cnt = data.cnt;
                // var infos = $('tbody');
                // $('tbody').empty(); //清空tbody内容
                $('.data_table').empty(); //清空tbody内容
                var tr1 = document.createElement("tr");
                var th1 = document.createElement("th");
                var th2 = document.createElement("th");
                var th3 = document.createElement("th");
                var th4 = document.createElement("th");
                var th5 = document.createElement("th");
                var th6 = document.createElement("th");
                var th7 = document.createElement("th");
                th1.innerHTML = '选择';
                th2.innerHTML = '任务编号';
                th3.innerHTML = '任务内容';
                th4.innerHTML = '任务时间';
                th5.innerHTML = '执行人员';
                th5.setAttribute('style','"color:red;"');
                th6.innerHTML = '执行状态';
                th7.innerHTML = '备注';
                tr1.appendChild(th1);
                tr1.appendChild(th2);
                tr1.appendChild(th3);
                tr1.appendChild(th4);
                tr1.appendChild(th5);
                tr1.appendChild(th6);
                tr1.appendChild(th7);
                $('.data_table').append(tr1);

                for(var i=0;i<cnt;i++){
                    var tr = document.createElement("tr");
                    var radio = document.createElement("td");
                    var radio_input = document.createElement("input");
                    var taskno = document.createElement("td");
                    var taskcontent = document.createElement("td");
                    var taskdate = document.createElement("td");
                    var taskperson = document.createElement("td");
                    var taskstatus = document.createElement("td");
                    var taskps = document.createElement("td");
                    radio_input.setAttribute('type','radio');
                    radio_input.setAttribute('name','select_record');
                    radio_input.setAttribute('checked','checked');
                    radio.appendChild(radio_input);
                    taskno.innerHTML = tasks[i].taskno;
                    taskcontent.innerHTML = tasks[i].taskcontent;
                    taskdate.innerHTML = tasks[i].taskdate;
                    taskperson.innerHTML = tasks[i].taskperson;
                    taskstatus.innerHTML = tasks[i].taskstatus;
                    taskps.innerHTML = tasks[i].taskps;
                    tr.appendChild(radio);
                    tr.appendChild(taskno);
                    tr.appendChild(taskcontent);
                    tr.appendChild(taskdate);
                    tr.appendChild(taskperson);
                    tr.appendChild(taskstatus);
                    tr.appendChild(taskps);
                    $('.data_table').append(tr);
                }
                // $(".data_table").append(infos);

                //$('html').html(data);
                //设置条件人员被选中
                $("select[name='search_person'] option[text='" + searchperson + "']").attr("selected", true);
            },
            error :function(){alert('请求错误！');}
    });
    return true;
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