# -*- coding:utf-8 -*-
# __author__ :kusy
# __content__:文件说明
# __date__:2018/8/30 15:36
from django.conf import settings
from django.http import HttpResponsePermanentRedirect


class SecureRequiredMiddleware(object):

    def __init__(self):
        self.paths = getattr(settings, 'SECURE_REQUIRED_PATHS')
        self.enabled = self.paths

    def process_request(self, request):
        if self.enabled and not request.is_secure():
            for path in self.paths:
                if request.get_full_path().startswith(path):
                    request_url = request.build_absolute_uri(request.get_full_path())
                    secure_url = request_url.replace('http://', 'https://')
                    return HttpResponsePermanentRedirect(secure_url)
        return request