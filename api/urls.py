from django.conf.urls import url
from django.urls import path
from . import views

urlpatterns = [
    path('',views.test),
    path('cords/',views.cordlist,name="cordlist"),
    path('postcord/',views.postcord,name="postcordt"),
    path('getid/',views.getid,name="getuserid"),
    path('addstory/',views.UserStoryView,name="addstory"),
    path('getstory/',views.getstory,name="getstory"),
    path('cordtoid/',views.CordToCordId,name="cordtoid"),
    path('markerstory/',views.markerstory,name="markerstory")
    
]