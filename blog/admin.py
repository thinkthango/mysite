from django.contrib import admin

# Register your models here.
from blog.models import BlogsPost
from blog.models import TaskInfo


class BlogsPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'body', 'timestamp']

class TaskInfoAdmin(admin.ModelAdmin):
    def formfield_for_dbfield(self, db_field, **kwargs):
        field =  super(TaskInfoAdmin, self).formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'tasktipflg':
            field.initial = 0
        return field

admin.site.register(BlogsPost, BlogsPostAdmin)
# admin.site.register(TaskInfo, TaskInfoAdmin)
