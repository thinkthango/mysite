from django.db import models

# Create your models here.


class BlogsPost(models.Model):
    title = models.CharField(max_length = 150)  # 博客标题
    body = models.TextField()                   # 博客正文
    timestamp = models.DateTimeField()          # 创建时间

class UserInfo(models.Model):
    user = models.CharField(max_length = 32)  # 用户名
    pwd = models.CharField(max_length = 32)  # 密码


class TaskInfo(models.Model):
    taskno = models.IntegerField()  # 任务编号
    taskcontent = models.TextField()  # 任务内容
    taskdate = models.DateTimeField()  # 任务时间
    taskperson = models.CharField(max_length=50)  # 执行人员
    taskstatus = models.CharField(max_length=1)  # 执行状态
    taskps = models.CharField(max_length=255)  # 备注信息
    tasktipflg = models.IntegerField(default=0)  # 新任务消息是否已推送
