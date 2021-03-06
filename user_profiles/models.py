from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.contrib.auth.models import PermissionsMixin
# Create your models here.

class MyAccountManager(BaseUserManager):
    def create_user(self,email,username,password=None):
        if not email:
            raise ValueError("user must have an email address")
        if not  username:
            raise ValueError("user must have an email username")
        user=self.model(email=self.normalize_email(email),username=username,password=password)
        #user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self,email,username,password):
        user=self.create_user(email=self.normalize_email(email),username=username,password=password)
        user.is_active=True
        user.is_admin=True
        user.is_staff=True
        user.is_superuser=True
        user.save(using=self._db)
        return user

        


def get_profile_image_filepath(self,filename):
    return f'profile_image/{self.pk}/{profile_image.png}'


class Userprofile(AbstractBaseUser):
    email=models.EmailField(verbose_name="email",max_length=60,unique=True)
    username=models.CharField(max_length=30,unique=True)
    is_admin=models.BooleanField(default=False)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    is_superuser=models.BooleanField(default=False)
    profile_image=models.ImageField(null=True,blank=True,default='images/default.png')
    mobnum=models.CharField(max_length=15,null=True)
    


    objects=MyAccountManager()

    USERNAME_FIELD="email"
    REQUIRED_FIELDS=['username']

    def __str__(self):
        return self.username

    def has_perm(self,perm,obj=None):
        return self.is_admin

    def has_module_perms(self,app_label):
        return True


    def get_profile_image_filename(self):
        return str(self.profile_image)[str(self.profile_image).index(f'profile_images/{self.pk}'):]