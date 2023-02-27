from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # <- # (CASCADE) when paren recod deleted, this recored will be deleted also.

    access_token=models.CharField(max_length=100, default=False) # required for all HW Devices to update their status for this specific user

    updated = models.DateTimeField(auto_now=True)

class DLDevice(models.Model):
    # Auth
    user = models.ForeignKey(User, on_delete=models.CASCADE) # <- # (CASCADE) when paren recod deleted, this recored will be deleted also.
    hw_id = models.CharField(max_length=6)
    device_access_key = models.CharField(max_length=6)
    # UI
    label = models.CharField(max_length=40)

    # Data
    UI_updates= models.JSONField(default=dict) # updates going to HW device
    HW_updates= models.JSONField(default=dict) # updates going to UI

    type = models.CharField(max_length=30)
    is_closed = models.CharField(max_length=30, default=False)
    is_locked = models.CharField(max_length=30, default=False)

    last_update = models.DateTimeField()
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label
