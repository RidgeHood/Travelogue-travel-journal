from django.db import models
from user_profile.models import UserProfile

# Create your models here.
class Mylatlng(models.Model):
    user=models.ForeignKey(UserProfile,null=True,on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()
    def __str__(self):
        return f"{self.id}{self.user},{self.latitude},{self.longitude}"
    
    

class UserStory(models.Model):
    user_id=models.ForeignKey(UserProfile,null=True,on_delete=models.CASCADE)
    latlng=models.OneToOneField(Mylatlng,null=True,on_delete=models.CASCADE)
    story=models.TextField()