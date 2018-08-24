import json

from django.http import HttpResponse
from django.shortcuts import render
from django.db import connection

from blog.models import BlogsPost
from blog.models import UserInfo

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

def add(request,a,b):
    # a = request.GET.get('a')
    # b = request.GET.get('b')
    c = int(a) + int(b)
    return HttpResponse(c)
