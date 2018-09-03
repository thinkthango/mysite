
$(document).ready(function(){
    turnGray(); //完成状态数据背景置灰
    replaceBr(); //内容中换行符显示
    movePage('.addHeader','.addBox');//移动新增窗口
    movePage('.editHeader','.editBox');//移动编辑窗口
});

function addClick(){
    $(".addForm input[name='taskdate']").val(getNowFormatDate());
    $('.addBox').css({'left': '45%','top': '25%','margin-left': '-250px'});
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
     $('.editBox').css({'left': '45%','top': '25%','margin-left': '-250px'});
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
        //success:function(data){},
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

$(function(){
    $('.task_search_box').bind('keypress',function(event){
        if(event.keyCode == "13")
        {
            searchPerson();
        }
    });
});

function searchPerson(){
//    search_conditon = $('select[name="search_person"] option:selected').text();
    search_conditon = $('.task_search_box').val();
    if(search_conditon.trim()==''){
        window.location.reload();
        return true;
    }
    $.ajax({
            type : "GET",
            async : false,
            cache : false,
            url : "./search",
            dataType: "json",
            data : "search_conditon=" + search_conditon,
            success:function(data){
                var tasks = data.tasks;
                var cnt = data.cnt;
                // var infos = $('tbody');
                // $('tbody').empty(); //清空tbody内容
                $('#data_table').empty(); //清空tbody内容
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
                th5.setAttribute("style","color:#02ff00;");
                th6.innerHTML = '执行状态';
                th7.innerHTML = '备注';
                tr1.appendChild(th1);
                tr1.appendChild(th2);
                tr1.appendChild(th3);
                tr1.appendChild(th4);
                tr1.appendChild(th5);
                tr1.appendChild(th6);
                tr1.appendChild(th7);
                //为了加滚动条，表头单独拿出来了
                // $('.data_table').append(tr1);

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
                    $('#data_table').append(tr);
                }
                // $(".data_table").append(infos);
                turnGray();
                //$('html').html(data);
                //设置条件人员被选中
                //$("select[name='search_person'] option[text='" + searchperson + "']").attr("selected", true);
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
function turnGray(){
    $("#data_table tr").children().each(function(){
        if ($(this).text()=='已完成'){
            $(this).parent().css({"background":"gray","opacity":"0.8"});
        }
        if ($(this).text()=='已暂停'){
            $(this).parent().css({"background":"yellow","opacity":"0.8"});
        }
    });
}

//内容显示换行符
function replaceBr(){
    var content = $('#data_table tr td:nth-child(3)');
    content.each(function(){
        var txt = $(this).text();
        var j =0;
        var span = document.createElement("span");
        for(i=0;i<txt.length;i++){
            if(txt.charAt(i)=='\n'){
                var p = document.createElement("p");
                var partTxt = txt.slice(j,i);
                p.innerHTML = partTxt;
                //由于p标签内容为空时，页面不显示空行，加一个<br>
                    if(partTxt==''){
                        p.appendChild(document.createElement("br"));
                    }
                span.appendChild(p);
                j = i + 1;
            }
        }
        var p_end = document.createElement("p");
        p_end.innerHTML = txt.slice(j);
        $(this).text('');
        span.appendChild(p_end);
        $(this).append(span);
    });
}

//页面拖动
function movePage(strHear,strForm) {
    $(strHear).mousedown(
        function(event) {

            $(strForm).css("margin","0px")

            var isMove = true;
            var abs_x = event.pageX - ($(strForm).offset().left+10);
            var abs_y = event.pageY - ($(strForm).offset().top+10);
            $(document).mousemove(function(event) {
                if(isMove) {
                    var obj = $(strForm);
                    obj.css({
                        'left': event.pageX - abs_x,
                        'top': event.pageY - abs_y
                    });
                }
            }).mouseup(
                function() {
                    var obj = $(strForm);
                    //还原样式，并获取
                    obj.css({
                        'left': $(strForm).offset().left-10,
                        'top': $(strForm).offset().top-10
                    });
                    $(strForm).css("margin-left","10px")
                    $(strForm).css("margin-top","10px")

                    isMove = false;
                }
            );
        }
    );

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
    var month = date.getMonth() + 1;//Date类的getMonth方法的返回值比实际月份少一
    var strDate = date.getDate();
    var strHours = date.getHours();
    var strMinutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strHours >= 0 && strHours <= 9) {
        strHours = "0" + strHours;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + "T" + strHours + seperator2 + strMinutes;
            //+ seperator2 + date.getSeconds();
    return currentdate;
}
