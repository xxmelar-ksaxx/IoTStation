from .serializers import DeviceSerializer
from django.contrib.auth.models import User
from api.models import DLDevice
from api.models import UserProfile


class Device_Services():

    def get_updates(user):
        # returns all devices info.

        try:
            user_devices = DLDevice.objects.filter(user=user)
            user_devices = DeviceSerializer(user_devices, many=True)
            return { 'devices': user_devices.data }
        except Exception as e:
            return { 'error': str(e) }

    def update_occurs(user):
        # device status has changed.
        try:
            UserProfile.objects.get(user=user).save()
        except Exception as e:
            # when user hsa no profile yet, create one.
            UserProfile.objects.create(user=user).save()

    def has_update(user, date):
        # check if any device has an update.
        # update ckeck through [UserProfile] model with the [updated] attribute,
        # comparing front-end with back-end dates, if differ returns True.

        try:
            user_profile = UserProfile.objects.get(user=user)
        except Exception:
            # when user hsa no profile yet, create one.
            user_profile = UserProfile.objects.create(user=user)
            user_profile.save()
        
        if(str(user_profile.updated) != date):
            return {'update':True, 'date':str(user_profile.updated)}
        return {'update':False}

