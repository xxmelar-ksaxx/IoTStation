from django.urls import path
from .views import GetCSRFToken, testCalls, SignupView, LoginView, LogoutView, GetUserProfileView, CheckAuthenticatedView, GetUsersView, DeleteAccountView
from .views import UserDevices, HWSU
urlpatterns =[
    
    path('test', testCalls.as_view()),
    path('csrf_cookie', GetCSRFToken.as_view()),
    path('is_auth', CheckAuthenticatedView.as_view()),
    path('register', SignupView.as_view()),
    path('login', LoginView.as_view()),
    path('logout', LogoutView.as_view()),
    path('userprofile', GetUserProfileView.as_view()),
    path('delete', DeleteAccountView.as_view()),
    path('getusers', GetUsersView.as_view()),
    
    # Devices
    path('devices', UserDevices.as_view()),
    path('hwsu', HWSU.as_view()),
    
    
    # path('testcall',views.testCall, name='testCall'),
    # path('updateState',views.updateState, name='updateState'),


]