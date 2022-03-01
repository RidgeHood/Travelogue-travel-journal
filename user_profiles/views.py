from django.http import request, response
from django.shortcuts import redirect, render
from django.contrib.auth import authenticate,login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from api.models import UserStory,Photos,TripReminder,like
from django.http import HttpResponse, HttpResponseRedirect

from django.core.files.storage import FileSystemStorage  

from user_profiles.models import Userprofile
from .forms import RegistrationForm
from django.http import JsonResponse
from django.urls import reverse
from django.views import View
# Create your views here.

def home(request):
    rem=TripReminder.objects.all().filter(user_id=request.user.id)
    
    if request.method=="POST":
        userpass=request.POST["password"]
        useremail=request.POST["email"]
        
        try:
            
            user_obj=authenticate(password=userpass,email=useremail)
            
            login(request,user_obj)
            request.session['email']=useremail
            
            return redirect('home')
        except:
            
            messages.add_message(request,messages.ERROR,"cant login")
            return render(request,"user_profile/home.html")

    else:
        return render(request,"user_profile/home.html",{"rem":rem})

    

def UserSettings(request):
    return render(request,"user_profile/user_settings.html")

def user_signup(request):
    if request.method=="POST":
        user_email=request.POST["email"]
        username=request.POST["username"]
        userpass=request.POST["password"]
        try:
            user_obj=Userprofile.objects.create(username=username,email=user_email)
            
            user_obj.set_password(userpass)
            user_obj.save()
            user_auth=authenticate(email=user_email,password=userpass)
            
            login(request,user_auth)
            return redirect('home')
        except Exception as e:
            print(e)
            
            messages.add_message(request,messages.ERROR,"cant signup")
            return render(request,"user_profile/signup.html")
    print("test")
    return render(request,"user_profile/signup.html")






def user_logout(request):
	try:
		logout(request)
		messages.add_message(request, messages.INFO, 'You\'re logged Out!')
	except:
		messages.add_message(request, messages.ERROR, "Unable to log out.")
	return redirect('home')



@login_required

def user_profile(request,user_id):
    totallikes=like.objects.all().filter(storyowner_id=request.user.id).count()
    id=request.user.id
    username=Userprofile.objects.get(id=request.user.id)
    totalposts=UserStory.objects.all().filter(user_id_id=request.user.id).count()
    jid={
        "id":f'{id}</script>&amp;'
    }
    allstory=UserStory.objects.filter(user_id_id=id)
    
    storynos=len(allstory)
    title=[]
    content=[]
    rem=TripReminder.objects.filter(user_id=id)

    for x in range(len(allstory)):
        title.append(allstory[x].title)
        content.append(allstory[x].story)
  
      
    return render(request,"user_profile/my_profile.html",{"allstory":allstory,"storynos":storynos,"jid":jid,"rem":rem,"likes":totallikes,"name":username.username,"posts":totalposts})


@login_required
def UserSettings(request):
    if request.method=="POST":
        print("itworked")
        user_profile_obj=Userprofile.objects.get(id=request.user.id)
        print(request.user.id)
        try:
            user_img=request.FILES["user_img"]
            fs_handle=FileSystemStorage()
            img_name=f"images/user_{request.user.id}"

            if fs_handle.exists(img_name):
                fs_handle.delete(img_name)

            fs_handle.save(img_name,user_img)
            user_profile_obj.profile_image=img_name
            user_profile_obj.save()
            user_profile_obj.refresh_from_db()
            
        except:
            
            messages.add_message(request, messages.ERROR, "Unable to update image..")

            return (request,"user_profile/my_profile.html",{'my_profile':user_profile_obj})
    
    return render(request,"user_profile/user_settings.html")


def register_view(request,*args,**kwargs):

    user=request.user
    if user.is_authenticated:
        return redirect('home')
    context={}

    if  request.POST:
        form=RegistrationForm(request.POST)
        print("ohoh")
        if form.is_valid():
            print("ohoh2")
            form.save()
            email=form.cleaned_data.get('email').lower()
            raw_password=form.cleaned_data.get('password1')
            print(raw_password,"raw")
            account=authenticate(email=email,password=raw_password)
            print(account,"heyhey")
            login(request,account,backend='django.contrib.auth.backends.ModelBackend')
            destination=kwargs.get("next")
            if destination:
                return redirect("destination")
            return redirect("home")
        
        else:
            context['Registration_form']=form

    else:
        form=RegistrationForm()
        context['Registration_form']=form
    return render(request,"user_profile/signup.html",context)



def PhotoFetch(request,story_id):
    photos=Photos.objects.all().filter(story_id=story_id)
    numph=len(photos)
    return JsonResponse({"photos":numph})

import random

class GlobalStory(View):
    def get(self,request):
        story=UserStory.objects.all()
        photos=Photos.objects.all()
        lis=[x.id for x in  story]
        random.shuffle(lis)
        

        def gencards(temp):
            i=0
            for storyID in temp:
                if i==10:
                    yield None
                st=UserStory.objects.get(id=storyID)
                totalposts=UserStory.objects.all().filter(user_id_id=st.user_id_id).count()
                phs=Photos.objects.all().filter(story_id=storyID)
                username=Userprofile.objects.get(id=st.user_id_id)
                likes=like.objects.all().filter(story_id=storyID).count()
                hov=like.objects.all().filter(story_id=storyID,user_id=request.user.id)
                totallikes=like.objects.all().filter(storyowner_id=st.user_id_id).count()
                if hov.exists():
                    boo=True
                else:
                    boo=False

                i=i+1
                yield {
                "story":st,
                "photos":phs,
                "username":username,
                "likes":likes,
                "hov":hov,
                "bool":boo,
                "postcount":totalposts,
                "likecount":totallikes 

                }
        a=gencards(lis)
        c=[]
        c.append(next(a))
        c.append(next(a)) 
        c.append(next(a)) 
        c.append(next(a)) 
        c.append(next(a)) 
        c.append(next(a))
        c.append(next(a))
        c.append(next(a))
        c.append(next(a))
        c.append(next(a)) 
        
               
        
      
        context={
            "gen2":c
        }
        return render(request,'user_profile/globalstory.html',context)
       
        