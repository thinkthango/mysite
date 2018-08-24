from django.test import TestCase

# Create your tests here.

from blog.models import UserInfo

UserInfo.objects.create(user='user', pwd='pwd')

