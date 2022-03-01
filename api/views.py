from django.shortcuts import render
from django.http import JsonResponse, request, response
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.files.storage import FileSystemStorage
from .serializers import MylatlngSerializer,UserStorySerializer,PhotosSerializer

from .models import Mylatlng, Photos,UserStory,TripReminder,like
from user_profiles.models import Userprofile

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


    newdata=Mylatlng.objects.filter(latitude=request.POST["latitude"],longitude=request.POST["longitude"],user_id=request.user.id)
    
    if newdata.exists() :
        return Response("exist")
    else:
        print("dosent exist")
        newlatlng=Mylatlng(latitude=request.POST["latitude"],longitude=request.POST["longitude"],user_id=request.user.id)
        newlatlng.save()
        cordid=Mylatlng.objects.get(latitude=request.POST["latitude"],longitude=request.POST["longitude"],user_id=request.user.id)
        newstory=UserStory(story=request.POST["storyct"],title=request.POST["storytitle"],latlng_id=cordid.id,user_id_id=request.user.id)
        newstory.save()

        print(request.POST)
        for img in request.FILES.keys():
            print(img)

        stories=UserStory.objects.all()
        test=UserStory.objects.all().last()
        photos=Photos.objects.all()
        idname=len(photos)+1
       
        
        storyid=test.id
       
        i=0
        for image in request.FILES.keys():
            
            fs_handle=FileSystemStorage()
            image_name=f"images/user/story_{storyid}.{i}"
            i=i+1 
            if fs_handle.exists(image_name):
                fs_handle.delete(image_name)

            fs_handle.save(image_name,request.FILES[f"{image}"])
            if not storyid==0:
                photosOBJ=Photos(photoUrl=image_name,story_id=storyid)
            if Photos.objects.all().filter(photoUrl=image_name).exists():
                print("ERROR ALREADY EXIST")
            else:
                if not storyid==0:
                    photosOBJ.save()
                    photosOBJ.refresh_from_db()
        
        return Response("new cord uploaded")
    

@api_view(['GET'])
def getid(request):
    
    return Response(request.user.id)



@api_view(['post'])
def UserStoryView(request):
    serializer=UserStorySerializer(data=request.data)
    print(request.data,"FROM UserStoryView ")
    st=UserStory(title=request.data["title"],story=request.data["story"],latlng_id=request.data["latlng"],user_id_id=request.data["user_id"])
    st.save()
    return Response("new story added")

    


@api_view(['GET'])
def getstory(request):
    id=request.user.id
    allstory=UserStory.objects.all().filter(user_id_id=id)

    serializer=UserStorySerializer(allstory,many=True)
    print(serializer.data)
    return Response(serializer.data)

@api_view(['post'])
def CordToCordId(request):
    serializer=MylatlngSerializer(data=request.data)
    if  serializer.is_valid():
        newdata=Mylatlng.objects.filter(latitude=request.data["latitude"],longitude=request.data["longitude"],user_id=request.user.id)
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


@api_view(['post'])
def LatLngToIdToStory(request):
    if request.method=="POST":
        lat=request.data["lat"]
        lng=request.data["lng"]
        userid=request.user.id
        latlngID=Mylatlng.objects.get(latitude=lat,longitude=lng,user_id=userid)
        mystory=UserStory.objects.all().filter(user_id_id=userid,latlng_id=latlngID)
        print(mystory[0].title,"from Latlngtoid")
    return Response(mystory[0].title)


@api_view(['post'])
def PhotoPerStory(request):
    if request.method=="POST":
        story_id=request.data["id"]
        total=len(Photos.objects.all().filter(story_id=story_id))
        return Response(total)


@api_view(['DELETE'])
def DeleteStory(request):
    if request.method=="DELETE":
        errs=Mylatlng.objects.all()
        stors=UserStory.objects.values("latlng_id")
        arr=[stor["latlng_id"] for stor in stors]

        
        for x in errs:
            if x.id not in arr :
                x.delete()
                

        storyID=request.data["id"]
        res=UserStory.objects.all().filter(id=storyID)
       
        cord=Mylatlng.objects.all().filter(id=res[0].latlng_id)
        cord.delete()
        return Response("Deleted")



@api_view(['post','delete'])
def setTrip(request):
    if request.method=="DELETE":
        tr=TripReminder.objects.filter(id=request.data["id"])
        tr.delete()
        return Response("trip deleted")

    if request.method=="POST":
        getrem=TripReminder.objects.filter(user_id=request.user.id,place_name=request.data["placename"],latitude=request.data["lat"],longitude=request.data["lng"])
        if getrem.exists():
            return Response("exist")
        else:
            rem=TripReminder(user_id=request.user.id,place_name=request.data["placename"],latitude=request.data["lat"],longitude=request.data["lng"])
            rem.save()
            print(request.data)
            return Response("trip added")
    

@api_view(['post'])
def Like(request):
    if request.method=="POST":
        storyowner=UserStory.objects.get(id=request.data["story_id"])
        likecheck=like.objects.filter(story_id=request.data["story_id"],user_id=request.user.id,storyowner_id=storyowner.user_id_id) 
        if likecheck.exists():
            likecheck.delete()
            likecount=like.objects.filter(story_id=request.data["story_id"]).count()
            return Response({"status":"unliked","count":likecount})
        else:
            print(request.data)
            likeinf=like(story_id=request.data["story_id"],user_id=request.user.id,storyowner_id=storyowner.user_id_id)
            likeinf.save()
            likecount=like.objects.filter(story_id=request.data["story_id"]).count()
            return Response({"status":"liked","count":likecount})
        
    


