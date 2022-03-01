from django.db import models
from user_profiles.models import Userprofile

# Create your models here.
class Mylatlng(models.Model):
    user=models.ForeignKey(Userprofile,null=True,on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    def __str__(self):
        return f"{self.id}{self.user},{self.latitude},{self.longitude}"
    
    

class UserStory(models.Model):
    user_id=models.ForeignKey(Userprofile,null=True,on_delete=models.CASCADE)
    latlng=models.OneToOneField(Mylatlng,null=True,on_delete=models.CASCADE)
    story=models.TextField()
    title=models.CharField(max_length=60)


class Photos(models.Model):
    story=models.ForeignKey(UserStory,null=True,on_delete=models.CASCADE)
    photoUrl=models.ImageField(null=True,blank=True,default='images/user/default.png',unique=True)

class TripReminder(models.Model):
    user=models.ForeignKey(Userprofile,null=True,on_delete=models.CASCADE)
    place_name=models.CharField(max_length=150)
    latitude = models.FloatField()
    longitude = models.FloatField()

class like(models.Model):
    story=models.ForeignKey(UserStory,null=True,on_delete=models.CASCADE)
    user=models.ForeignKey(Userprofile,null=True,on_delete=models.CASCADE)
    storyowner_id=models.IntegerField()
    created=models.DateTimeField(auto_now_add=True)