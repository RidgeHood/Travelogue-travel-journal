from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns=[
    path("",views.home,name="home"),
    path("signup",views.user_signup,name="signup"),
    path('logout',views.user_logout,name="logout"),
    path("profile/<int:user_id>",views.user_profile,name="profile"),
    path("settings/",views.UserSettings,name="settings"),
    path("register/",views.register_view,name="register"),
    path('photos/<int:story_id>',views.PhotoFetch,name="photofetch"),
    path('global/',views.GlobalStory.as_view(),name="global")
    
    
]