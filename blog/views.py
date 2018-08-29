import json
import urllib

from django.http import HttpResponse
from django.shortcuts import render
from django.db import connection
from django.views.decorators.csrf import csrf_exempt

from blog.models import BlogsPost
from blog.models import UserInfo
from blog.models import TaskInfo

from datetime import datetime

# Create your views here.

user_list = []

def blog_index(request):
    blog_list = BlogsPost.objects.all()  # 获取所有数据
    return render(request,'index.html', {'blog_list':blog_list})   # 返回index.html页面

def login_index(request):
    print('fnc login_index() start')
    global user_list
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        UserInfo.objects.create(user=username, pwd=password)
        user_list = UserInfo.objects.all()

        for u in user_list:
            print(u.user,u.pwd)

    if not user_list:
        return render(request,'login.html')
    else:
        return render(request,'login.html',{'data':user_list})


def register_index(request):
    string = '持续学习ing...'
    stringlist = ['day day up' + str(i) for i in range(5)]
    print('fnc register_index() start')
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        UserInfo.objects.create(user=username, pwd=password)
        print('register_index',username,password)
        return render(request,'login.html')

    return render(request,'register.html',{'stringlist':stringlist,'strings':string})


def userinfo_check(request):
    print('fnc userinfo_check() start')
    result = {}
    username = request.POST.get('username')
    password = request.POST.get('password')
    flgstr = request.POST.get('flgstr')
    print('flgstr',flgstr)
    if flgstr == 'login':
        queryStr = 'select count(*) from blog_userinfo where user = \'%s\' and pwd = \'%s\'' %(username,password)
    else:
        queryStr = 'select count(*) cnt from blog_userinfo where user = \'%s\'' %(username)
    cursor = connection.cursor()
    cursor.execute(queryStr)
    rec = cursor.fetchone()
    print(queryStr)
    print(rec)

    if flgstr == 'login':
        if rec[0] != 0:
            result['result'] = 'OK'
            # result['status'] = '200'
            return HttpResponse(json.dumps(result))
        else:
            result['result'] = 'NG'
            # result['status'] = '200'
            return HttpResponse(json.dumps(result))
    else:
        if rec[0] == 0:
            result['result'] = 'OK'
            # result['status'] = '200'
            return HttpResponse(json.dumps(result))
        else:
            result['result'] = 'NG'
            # result['status'] = '200'
            return HttpResponse(json.dumps(result))


def taskmanage_index(request):
    print('fnc taskmanage_index() start')
    if request.method == 'POST':
        username = request.POST.get('username')
    else:
        if 'username' in request.COOKIES:
            username = request.COOKIES["username"]
        else:
            return render(request,'login.html')
    task_list = TaskInfo.objects.all()
    user_list = UserInfo.objects.all()

    # 任务编号设置（最大值+1）
    newtaskno = TaskInfo.objects.all().order_by('-taskno')[0].taskno + 1
    # 任务时间格式调整
    new_task_list = []
    for task in task_list:
        task.taskdate = task.taskdate.strftime('%Y-%m-%d %H:%M:%S')
        new_task_list.append(task)

    if not task_list:
        return render(request,'taskmanage.html',{'username':username,'user_list':user_list})
    else:
        return render(request,'taskmanage.html',
                      {'task_list':task_list,'username':username,
                       'user_list':user_list,'newtaskno':newtaskno}
                      )

@csrf_exempt
def taskmanage_add(request):
    print('fnc taskmanage_index() start')
    if request.method == 'POST':
        print('taskmanage_add',request.body.decode())
        req = json.loads(request.body.decode())
        taskno = req.get('taskno')
        taskcontent = req.get('taskcontent')
        taskdate = str.replace(req.get('taskdate'),'T',' ') + ':00'
        taskperson = req.get('taskperson')
        taskstatus = req.get('taskstatus')
        taskps = req.get('taskps')
        # print('taskno:',taskno)
        # print('taskcontent:',taskcontent)
        # print('taskdate:',taskdate)
        # print('taskperson:',taskperson)
        # print('taskstatus:',taskstatus)
        # print('taskps:',taskps)

        task = TaskInfo()
        task.taskno = taskno
        task.taskcontent = taskcontent
        task.taskdate = datetime.strptime(taskdate,'%Y-%m-%d %H:%M:%S')
        task.taskperson = taskperson
        task.taskstatus = taskstatus
        task.taskps = taskps
        task.save()
        return HttpResponse('OK')
    return HttpResponse('NG')

@csrf_exempt
def taskmanage_select_taskbyno(request):
    print('fnc taskmanage_select_taskbyno() start')
    if request.method == 'GET':
        taskno = request.GET.get('taskno')
        print('taskno',taskno)
        task_target = TaskInfo.objects.filter(taskno=taskno)
        task_dict = {}
        task_dict['taskno'] = task_target[0].taskno
        task_dict['taskcontent'] = task_target[0].taskcontent
        task_dict['taskdate'] = str.replace(task_target[0].taskdate.strftime('%Y-%m-%d %H:%M:%S')[:-3],' ','T')
        task_dict['taskperson'] = task_target[0].taskperson
        task_dict['taskstatus'] = task_target[0].taskstatus
        task_dict['taskps'] = task_target[0].taskps
        return HttpResponse(json.dumps(task_dict))

    return HttpResponse('NG')

@csrf_exempt
def taskmanage_update_taskbyno(request):
    print('fnc taskmanage_update_taskbyno() start')
    if request.method == 'POST':
        print(request.body.decode('utf-8'))
        # req = json.loads(urllib.parse.unquote(request.body, encoding='utf-8', errors='replace'))
        req = json.loads(request.body.decode('utf-8'))
        taskno = req.get('taskno')
        taskstatus = req.get('taskstatus')
        taskps = req.get('taskps')
        task = TaskInfo.objects.get(taskno=taskno)
        print('query sql :',str(task.query))
        task.taskstatus = taskstatus
        task.taskps = taskps
        task.save()
        return HttpResponse('OK')
    return HttpResponse('NG')

def add(request,a,b):
    # a = request.GET.get('a')
    # b = request.GET.get('b')
    c = int(a) + int(b)
    return HttpResponse(c)
