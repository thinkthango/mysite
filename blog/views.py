import json

from django.http import HttpResponse
from django.shortcuts import render
from django.db import connection

from blog import models
from blog.models import BlogsPost

# Create your views here.

user_list = []

def blog_index(request):
    blog_list = BlogsPost.objects.all()  # 获取所有数据
    return render(request,'index.html', {'blog_list':blog_list})   # 返回index.html页面

def login_index(request):
    global user_list
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        models.UserInfo.objects.create(user=username, pwd=password)
        user_list = models.UserInfo.objects.all()

        for u in user_list:
            print(u.user,u.pwd)

    if not user_list:
        return render(request,'login.html')
    else:
        return render(request,'login.html',{'data':user_list})


def register_index(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        models.UserInfo.objects.create(user=username, pwd=password)

    return render(request,'register.html')


def register_check(request):
    result = {}
    username = request.POST.get('username')
    # password = request.POST.get('password')

    # queryStr = 'select count(*) from UserInfo where user = \'%s\' and pwd = \'%s\'' %(username,password)
    queryStr = 'select count(*) cnt from blog_userinfo where user = \'%s\'' %(username)
    cursor = connection.cursor()
    cursor.execute(queryStr)
    rec = cursor.fetchone()
    print(queryStr)
    print(rec)

    if rec[0] == 0:
        result['result'] = 'OK'
        # result['status'] = '200'
        return HttpResponse(json.dumps(result))
    else:
        result['result'] = 'NG'
        # result['status'] = '200'
        return HttpResponse(json.dumps(result))
