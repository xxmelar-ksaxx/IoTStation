from django.test import TestCase
from .models import UserProfile, DLDevice
from django.contrib.auth.models import User
class DeviceModelTestCase(TestCase):
    def setUp(self):
        hw_id="111"
        device_access_key="222"
        
        self.user=User.objects.create(username="hgg")

        self.user_profile=UserProfile.objects.create(user=self.user,
        access_token="qqq"
        )

        self.device=DLDevice.objects.create(user=self.user,
        hw_id=hw_id,
        device_access_key=device_access_key,
        )
    def is_auth_client(self, token, hw_id, device_access_key):
            # compares client token with db_user token
            # also, device ID and access_key
            try:
                user_profile=UserProfile.objects.get(access_token=token)
                device= DLDevice.objects.get(user=user_profile.user,
                    hw_id=hw_id, device_access_key=device_access_key)
                return True
            except:
                return False
        
    def test_json_checks(self):
        # print(f"ui updates 1 :-{self.device.UI_updates}-")
        # print(f"user id:-{self.device.user}-")
        # self.device.UI_updates="hi all"
        # print(f"ui updates 2 :-{self.device.UI_updates}-")
        # self.device.UI_updates={"wrapp":"wssapp"}
        # print(f"ui updates 2 :-{self.device.UI_updates}-")
        # self.device.UI_updates="'this':'is normal'"
        print(f"access token :-{self.user_profile.access_token}-")

        token = "qqq"
        hw_id="111"
        device_access_key="222"

        # device=self.is_auth_client(token, hw_id, device_access_key)
        # print(f"Device is:-{device}-")
        # if(device):
        #     print(f"all good")

        # self.assertEqual(self.is_auth_client(token, hw_id, device_access_key), True)
       
