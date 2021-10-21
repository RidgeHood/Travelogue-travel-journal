from rest_framework import serializers
from .models import Mylatlng,UserStory
from user_profile.models import UserProfile


class MylatlngSerializer(serializers.ModelSerializer):
    class Meta:
        model=Mylatlng
        fields="__all__"


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields="__all__"


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model=UserStory
        fields="__all__"