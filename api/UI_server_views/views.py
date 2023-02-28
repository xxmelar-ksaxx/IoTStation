from time import sleep
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
#        User Authentication


class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        user = self.request.user

        try:
            isAuthenticated = user.is_authenticated

            if isAuthenticated:
                return Response({ 'isAuthenticated': 'success' })
            else:
                return Response({ 'isAuthenticated': 'error' })
        except:
            return Response({ 'error': 'Something went wrong when checking authentication status' })


@method_decorator(csrf_protect, name='dispatch')
class SignupView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        re_password  = data['re_password']

        try:
            if password == re_password:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' })
                else:
                    if len(password) < 6:
                        return Response({ 'error': 'Password must be at least 6 characters' })
                    else:
                        user = User.objects.create_user(username=username, password=password)
                        user.save()

                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering account' })

@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'User authenticated' })
            else:
                return Response({ 'error': 'Error Authenticating' })
        except:
            return Response({ 'error': 'Something went wrong when logging in' })

class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({ 'success': 'Loggout Out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })


@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes=(permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})

@method_decorator(csrf_protect, name='dispatch')
class DeleteAccountView(APIView):
    permission_classes = (permissions.AllowAny, )
    def delete(self, request, format=None):
        user_id = self.request.data['id']

        try:
            User.objects.filter(id=user_id).delete()

            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'Something went wrong when trying to delete user' })


@method_decorator(csrf_protect, name='dispatch')
class GetUsersView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None):
        try:
            users = User.objects.all().values('id','username')
            # username = user.username

            return Response({ 'Users': users})
        except:
            return Response({ 'error': 'Something went wrong when retrieving profile' })

# ---------------------------------------------------------
#        User Profile

class GetUserProfileView(APIView):
    def get(self, request, format=None):
        try:
            username = self.request.user.username
            # user_profile = User.objects.get(username=username)
            # user_profile = UserProfileSerializer(user_profile)

            # used for additional User_Profile data [new model]
            # return Response({ 'profile': user_profile.data, 'username': str(username) })
            return Response({ 'username': str(username) })
        except:
            return Response({ 'error': 'Something went wrong when retrieving profile' })

# ---------------------------------------------------------
#        User Devices

class UserDevices(APIView):
    def get(self, request, format=None):
        try:
            user = self.request.user
            data=self.request.GET

            if(data and (data.get('type') == 'device')):
                try:
                    user_devices = DLDevice.objects.get(user=user, hw_id=data.get('namekey'))
                    user_devices = DeviceSerializer(user_devices)
                except Exception as e:
                    return Response({ 'error': str(e) })
            elif (data and (data.get('type') == 'has_update')):
                has_update=Device_Services.has_update(user,data.get('date'))
                
                return Response(has_update)
            else:
                try:
                    user_devices = DLDevice.objects.filter(user=user)
                    user_devices = DeviceSerializer(user_devices, many=True)
                except Exception as e:
                    return Response({ 'error': str(e) })
            return Response({ 'devices': user_devices.data })
        except:
            return Response({ 'error': 'Something went wrong when retrieving devices' })
    
    def post(self, request, format=None):
        # add new device
        try:
            user = self.request.user
            data = self.request.data
            label = data['label']
            hw_id = data['hw_id']
            device_access_key = data['access_key']
        
            new_device= DLDevice.objects.create(user=user, label=label, hw_id=hw_id, device_access_key=device_access_key)
            new_device.save()
            
            return Response({ 'success': 'Added new Device successfully'})
        except Exception as e:
            print(e)
            return Response({ 'error': 'Something went wrong when adding new device' })
    
    def label_or_UI_update(data):
        try:
            if(data['hw_id'] and data['label']):
                return "label"
        except:
            pass
        try:
            if(data['hw_id'] and data['u']):
                return "u"
        except:
            pass
        return False

    def put(self, request, format=None):
        # update device state & lable
        user = request.user
        data = request.data
        if(UserDevices.label_or_UI_update(data)=="u"):
            try:
                device= DLDevice.objects.get(user=user,hw_id=data['hw_id'])
                device.UI_updates=data['u']
                device.save()
                Device_Services.update_occurs(user)
            except:
                return Response({ 'error': 'Something went wrong when updating device' })
        elif(UserDevices.label_or_UI_update(data)=="label"):
            try:
                device= DLDevice.objects.get(user=user,hw_id=data['hw_id'])
                device.label=data['label']
                device.save()
                Device_Services.update_occurs(user)
            except:
                return Response({ 'error': 'Something went wrong when updating device' })
        else:
            return Response({ 'error': 'Something went wrong when updating device' })

        return Response({ 'success': 'Update Device successfully'})


    def delete(self, request, format=None):
        try:
            user = self.request.user
            data = self.request.data
            DLDevice.objects.filter(user=user, hw_id=data['namekey']).delete()

            return Response({ 'success': 'Device Deleted successfully'})
        except:
            return Response({ 'error': 'Something went wrong when deleting a device' })

class UserDevicesUpdates(APIView):
    

    pass
