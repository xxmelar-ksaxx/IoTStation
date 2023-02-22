from rest_framework import serializers
from .models import User
from .models import DLDevice

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class DeviceSerializer(serializers.ModelSerializer):

    

    updated = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S %Z")

    class Meta:
        model = DLDevice
        # fields = '__all__'

        exclude = ['passkey']
