
$(document).ready(function(){
    turnGray(); //完成状态数据背景置灰
    replaceBr(); //内容中换行符显示
    movePage('.addHeader','.addBox');//移动新增窗口
    movePage('.editHeader','.editBox');//移动编辑窗口
    init();  //初始化设置
    setInterval('tipATask();', 5000);; //新任务通知
});

function init(){
    //搜索框回车事件
    $('.task_search_box').bind('keypress',function(event){
        if(event.keyCode == "13")
        {
            searchPerson();
        }
    });

    //点击一行，选择框自动勾选
    $('tr').bind('click',function(){
        $(this).find('input').prop('checked',true);
    });
}

function addClick(){
    $(".addForm input[name='taskdate']").val(getNowFormatDate());
    $('.addBox').css({'left': '45%','top': '25%','margin-left': '-250px'});
    $(".shadow").css({'display':'block'});
    $('.addBox').show();
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
    $(".shadow").css({'display':'block'});
    $('.editBox').show();
    return 0;
}

function addTask(){
    taskno = $("input[name='taskno']").val();
    taskcontent = $("textarea[name='taskcontent']").val();
    taskdate = $("input[name='taskdate']").val();
    taskperson = $("select[name='taskperson']").val();
    taskstatus = $("select[name='taskstatus']").val();
    taskps = $("input[name='taskps']").val();

    if(taskcontent==''){
        $('.addTips').text('请输入任务内容！');
        $("textarea[name='taskcontent']").focus();
        return false;
    }
    if(taskdate==''){
        $('.addTips').text('请选择任务时间！');
        $("input[name='taskdate']").focus();
        return false;
    }
    if(taskperson==''){
        $('.addTips').text('请选择执行人员！');
        $("select[name='taskperson']").focus();
        return false;
    }

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
    //新生成元素重新绑定事件
    //点击一行，选择框自动勾选
    $('tr').bind('click',function(){
        $(this).find('input').prop('checked',true);
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
    $('.addTips').text('');
}

//已完成状态数据背景色置灰
function turnGray(){
    $("#data_table tr").children().each(function(){
        if ($(this).text()=='已完成'){
            $(this).parent().css({"background":"gray","opacity":"0.7"});
        }
        if ($(this).text()=='已暂停'){
            $(this).parent().css({"background":"yellow","opacity":"0.7"});
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
var isMove = false;
var x = 0;
var y = 0;
var offx = 0;
var offy = 0;

function movePage(strHeader,strForm) {
//    strHeader = strForm;
    $(strHeader).mousedown(
        function(event) {
            isMove = true;
            x = event.clientX;
            y = event.clientY;
            offx = $(strForm).offset().left;
            offy = $(strForm).offset().top;
        }
    );
    $(document).mousemove(
        function(event) {
            if(isMove) {
                console.log('onmousemove isMove',isMove,event.clientX,event.clientY,offx,offy);
                $(strForm).css({
//                    'left': (event.clientX - (x-offx) ) + 'px',
//                    'top': (event.clientY - (y-offy) )  + 'px'
                    'left': (event.clientX - (0) ) + 'px',
                    'top': (event.clientY - (0) )  + 'px',
                    'cursor':'move'
                });
            }
        }
    );
    $(document).mouseup(
        function() {
            console.log('mouseup isMove',isMove);
            $(strForm).css({
                'cursor':'default'
            });
            isMove = false;
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


/******** 消息提醒 ***********/

var NotificationHandler = {
    isNotificationSupported : 'Notification' in window,
    isPermissionGranted : function() {
        return Notification.permission === 'granted';
    },
    requestPermission : function() {
        //验证浏览器是否支持Notification，如果不支持打印提示信息并返回
        if (!this.isNotificationSupported) {
            console.log('当前浏览器不支持Notification API');
            return;
        }
        //该方法将会询问用户是否允许显示通知,不能由页面调用(onload)，必须由用户主动事件触发(onclick等)
        //当用户同意之后，再次调用该方法则无效，即该方法仅对Notification.Permission不为'granted'的时候起作用
        Notification.requestPermission(function(status) {
            //status是授权状态，如果用户允许显示桌面通知，则status为'granted'
            console.log('status: ' + status);
            //permission只读属性:
            //    default 用户没有接收或拒绝授权 不能显示通知
            //    granted 用户接受授权 允许显示通知
            //    denied  用户拒绝授权 不允许显示通知
            var permission = Notification.permission;
            console.log('permission: ' + permission);
        });
    },
    showNotification : function() {
        if (!this.isNotificationSupported) {
            console.log('当前浏览器不支持Notification API');
            return;
        }
        if (!this.isPermissionGranted()) {
            console.log('当前页面未被授权使用Notification通知');
            return;
        }

        var n = new Notification("您有一条新消息", {
            icon : '../static/image/photo.jpg',
            body : '您有新的任务，请关注！'
        });

        //onshow函数在消息框显示时会被调用
        //可以做一些数据记录及定时操作等
        n.onshow = function() {
            console.log('显示通知信息');
            //5秒后自动关闭消息框
            setTimeout(function() {
                n.close();
            }, 5000);
        };

        //消息框被点击时被调用
        //可以打开相关的视图，同时关闭该消息框等操作
        n.onclick = function() {
            alert('打开相关视图');
            //opening the view...
            n.close();
        };

        //当有错误发生时会onerror函数会被调用
        //如果没有granted授权，创建Notification对象实例时，也会执行onerror函数
        n.onerror = function() {
            console.log('产生错误');
            //do something useful
        };

        //一个消息框关闭时onclose函数会被调用
        n.onclose = function() {
            console.log('关闭通知窗口');
            //do something useful
        };
    }
};
//此处无效，不能由页面调用(onload)
document.addEventListener('load', function() {
    NotificationHandler.requestPermission();
});

function tipATask(){
    currentuser = $("#loginuser").text();
    var isTip=false;
    //后台获取新任务信息
    $.ajax({
            type : "GET",
            async : false,
            cache : false,
            url : "./tasktip",
            data : "currentuser=" + currentuser,
            success:function(data){
                    if(data=='OK'){
                        isTip = true;
                    }
                },
            error :function(){alert('通知信息获取异常！');}
        });
    if(isTip){
        NotificationHandler.showNotification();
        //更新tipflg
        $.ajax({
                type : "POST",
                async : false,
                cache : false,
                url : "./tasktip",
                data : "currentuser=" + currentuser,
                success:function(data){},
                error :function(){alert('通知信息更新异常！');}
            });
    }
    return 0;
}
