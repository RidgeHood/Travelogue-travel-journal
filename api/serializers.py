from rest_framework import serializers
from .models import Mylatlng,UserStory,Photos
from user_profiles.models import Userprofile


class MylatlngSerializer(serializers.ModelSerializer):
    class Meta:
        model=Mylatlng
        fields="__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Userprofile
        fields="__all__"


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model=UserStory
        fields="__all__"

class PhotosSerializer(serializers.ModelSerializer):
    class Meta:
        model=Photos
        fields="__all__"