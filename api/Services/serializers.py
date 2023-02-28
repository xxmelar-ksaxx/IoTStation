from rest_framework import serializers
from api.models import User
from api.models import DLDevice

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):
    # last_update = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S %Z")

    class Meta:
        model = DLDevice
        # fields = '__all__'

        exclude = ['device_access_key']
