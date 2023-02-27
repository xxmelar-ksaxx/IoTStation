from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib import auth
from rest_framework.response import Response
from api.models import UserProfile, DLDevice
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
                    device= DLDevice.objects.get(device_access_key=data['passkey'], hw_id=data['namekey'])
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

    def is_auth_client(request):
        # compares client access_token with db_user access_token
        # also, device ID and access_key
        try:
            access_token=request.META["CSRF_COOKIE"]
            if(request.method=="GET"):
                hw_id = request.GET.get("id")
            else:    
                hw_id = request.data['auth']['id']
                device_access_key = request.data['auth']['key']
        except:
            return JsonResponse({ 'error': 'JSON denied' })
        try:
            user_profile=UserProfile.objects.get(access_token=access_token)
            if(request.method=="GET"):
                device=DLDevice.objects.get(user=user_profile.user,
                hw_id=hw_id)
            else:    
                device=DLDevice.objects.get(user=user_profile.user,
                    hw_id=hw_id, 
                    device_access_key=device_access_key)
            return device
        except:
            return JsonResponse({ 'error': 'CSRF denied' })
    
    def get(self, request, format=None):
        device=HWSU.is_auth_client(request)
        if(type(device) == JsonResponse ):
            return device
        has_update={
            "t":device.updated
        }
        return JsonResponse(has_update)

    def post(self, request, format=None):
        device=HWSU.is_auth_client(request)
        if(type(device) == JsonResponse ):
            return device
        
        # set HW updates
        try:
            if(device.HW_updates!=request.data['data']):
                device.HW_updates=request.data['data']
                device.last_update=device.updated
            device.save()
            Device_Services.update_occurs(device.user)
        except:
            return JsonResponse({ 'error': 'JSON denied' })
        
        # get UI updates
        updates_dic={
            "t":device.updated, # t = device last update time
            "u":device.UI_updates # device controller states update
        }

        return JsonResponse(updates_dic)