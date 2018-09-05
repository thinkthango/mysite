"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from blog import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', views.blog_index),
    path('login/', views.login_index),
    path('register/', views.register_index),
    path('userinfo/check', views.userinfo_check),
    path('', views.login_index),
    path('taskmanage/', views.taskmanage_index),
    path('taskmanage/add', views.taskmanage_add),
    path('taskmanage/search', views.taskmanage_search),
    path('taskmanage/select_taskbyno', views.taskmanage_select_taskbyno),
    path('taskmanage/delete_taskbyno', views.taskmanage_delete_taskbyno),
    path('taskmanage/update_taskbyno', views.taskmanage_update_taskbyno),
    path('taskmanage/tasktip', views.taskmanage_tasktip),
    path('add/<int:a>/<int:b>', views.add),
]
