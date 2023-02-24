from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib import auth
from rest_framework.response import Response
from api.models import DLDevice
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from api.Services.serializers import UserProfileSerializer,DeviceSerializer
from rest_framework.authentication import BasicAuthentication
from api.Services.Device_Services import Device_Services
import os

# ---------------------------------------------------------
#        Hardware State Update

#  here is the hardware side of model interactions


class HWSU(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [permissions.AllowAny]
    
    # random string, allow devices to access http requests (Auth stuff)
    allowed_cookie=str(os.environ.get('HW_ACCESS_KEY'))

    def put(self, request, format=None):
        cookie=request.META["CSRF_COOKIE"]
        if(HWSU.allowed_cookie==cookie):
            try:
                data = self.request.data
                print("data: ",data)
                if(data['namekey'] and data['passkey']):
                    device= DLDevice.objects.get(passkey=data['passkey'], namekey=data['namekey'])
                    device.is_closed=data['is_closed']
                    device.is_locked=data['is_locked']
                    device.save()
                    
                    Device_Services.update_occurs(device.user)

                return Response({ 'success': 'Update Device successfully'})
            except:
                return Response({ 'error': 'Something went wrong when updating device' })
        # else:
        #     return Response({ 'error': 'Something went wrong when updating device' })
    
    last_update_date="123"
    light_1=""
    def postman_test_update_controller():
        if(HWSU.last_update_date=="1"):
            HWSU.last_update_date="0"
            HWSU.light_1="false"
            return
        HWSU.last_update_date="1"
        HWSU.light_1="true"

    def get(self, request, format=None):
        
        has_update={
            "t":HWSU.last_update_date
        }
        return JsonResponse(has_update)
    
    def post(self, request, format=None):
        try:
            if (self.request.data["PU"]): 
                HWSU.postman_test_update_controller()
                return Response({ 'success': 'Update Device successfully'})
        except:
            pass
        cookie=request.META["CSRF_COOKIE"]
        if(HWSU.allowed_cookie==cookie):
            print(self.request.data)
            
            updates_dic={
                "t":HWSU.last_update_date, # t = device last update time
                "u":{ # device controller states update
                    "light_1":HWSU.light_1
                } 
            }

            return JsonResponse(updates_dic)
            # return JsonResponse({"bat":"hi"})
            
        return JsonResponse({ 'error': 'CSRF denied' })
        # return Response({ 'success': 'Update Device successfully'})

          