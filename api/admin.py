from django.contrib import admin

from user_profile import models
from .models import Mylatlng,UserStory

# Register your models here.


admin.site.register(Mylatlng)
admin.site.register(UserStory)
