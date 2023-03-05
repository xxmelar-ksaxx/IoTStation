from django.urls import path
from .UI_server_views.views import *
from .HW_server_views.views import HWSU
urlpatterns =[
    
    # Front-end
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('is_auth', CheckAuthenticatedView.as_view()),
    path('register', SignupView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('userprofile', UserProfileView.as_view()),
    path('delete', DeleteAccountView.as_view()),
    path('getusers', GetUsersView.as_view()),
    path('devices', UserDevices.as_view()),
    
    # HW Devices
    path('hwsu', HWSU.as_view()),

]