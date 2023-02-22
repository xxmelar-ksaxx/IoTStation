from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # <- # (CASCADE) when paren recod deleted, this recored will be deleted also.
    
    updated = models.DateTimeField(auto_now=True)
    trigger = models.CharField(max_length=6)



class DLDevice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE) # <- # (CASCADE) when paren recod deleted, this recored will be deleted also.
    label = models.CharField(max_length=40)
    namekey = models.CharField(max_length=6)
    passkey = models.CharField(max_length=6)

    type = models.CharField(max_length=30)
    is_closed = models.CharField(max_length=30, default=False)
    is_locked = models.CharField(max_length=30, default=False)
    
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label
