# -*- coding:utf-8 -*-
# __author__ :kusy
# __content__:文件说明
# __date__:2018/8/30 15:36
from django.conf import settings
from django.http import HttpResponsePermanentRedirect


class SecureRequiredMiddleware(object):

    def __init__(self,get_response):
        # self.paths = getattr(settings, 'SECURE_REQUIRED_PATHS')
        self.get_response = get_response
        # self.enabled = self.paths

    def __call__(self, request):
        print(request.is_secure())
        # if not request.is_secure():
        print('full path',request.build_absolute_uri(request.get_full_path()))
        full_url = request.build_absolute_uri(request.get_full_path())
        if full_url.startswith('http://'):
            secure_url = full_url.replace('http://', 'https://')
            return HttpResponsePermanentRedirect(secure_url)
        return self.get_response(request)

    # def process_request(self, request):
    #     print('SecureRequiredMiddleware is called1')
    #     # if self.enabled and not request.is_secure():
    #     if not request.is_secure():
    #         # for path in self.paths:
    #         if request.get_full_path().startswith('http://'):
    #             request_url = request.build_absolute_uri(request.get_full_path())
    #             secure_url = request_url.replace('http://', 'https://')
    #             return HttpResponsePermanentRedirect(secure_url)
    #     return request
