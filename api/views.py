from django.shortcuts import render
from django.http import JsonResponse, request, response
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .serializers import MylatlngSerializer,UserStorySerializer

from .models import Mylatlng,UserStory
from user_profile.models import UserProfile

from .forms import ReviewForm

from django.http import HttpResponse

@api_view(['GET'])
def test(request):
    api_urls = {
		'List':'/task-list/',
		'Detail View':'/task-detail/<str:pk>/',
		'Create':'/task-create/',
		'Update':'/task-update/<str:pk>/',
		'Delete':'/task-delete/<str:pk>/',
		}
    return Response(api_urls)

@api_view(['GET'])
def cordlist(request):
    latlng=Mylatlng.objects.all()
    serializer=MylatlngSerializer(latlng,many=True)

    return Response(serializer.data)

@api_view(['post'])
def postcord(request):
    serializer=MylatlngSerializer(data=request.data)
    newdata=Mylatlng.objects.filter(latitude=request.data["latitude"],longitude=request.data["longitude"])
    if newdata.exists():
        return Response("exist")
    else:
        print("dosent exist")
        if serializer.is_valid():
            serializer.save()
            return Response("new cord uploaded")
    

@api_view(['GET'])
def getid(request):
    
    return Response(request.user.id)



@api_view(['post'])
def UserStoryView(request):
    serializer=UserStorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response("new story added")

    return Response(serializer.data)


@api_view(['GET'])
def getstory(request):
    id=request.user.id
    allstory=UserStory.objects.all().filter(user_id_id=id)
    
    serializer=UserStorySerializer(allstory,many=True)

    return Response(serializer.data)

@api_view(['post'])
def CordToCordId(request):
    serializer=MylatlngSerializer(data=request.data)
    if  serializer.is_valid():
        newdata=Mylatlng.objects.filter(latitude=request.data["latitude"],longitude=request.data["longitude"])
    return Response(newdata[0].id)


@api_view(['post'])
def markerstory(request):
    if request.method=="POST":
        cordid=request.data["latlng"]
        userid=request.user.id
        print(userid)
        print(cordid)
        mystory=UserStory.objects.all().filter(user_id_id=userid,latlng_id=cordid)
        print(mystory,"mystory")
    return Response(mystory[0].story)