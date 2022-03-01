from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate

from .models import Userprofile

class RegistrationForm(UserCreationForm):
	email = forms.EmailField(max_length=254, help_text='Required. Add a valid email address.', widget=forms.EmailInput(attrs={'class':'form-control',"placeholder":"Email"}))
	mobnum= forms.CharField(required=True,widget= forms.TextInput(attrs={'class':'form-control',"placeholder":"Mobile Number"}))
	password1=forms.CharField(max_length=100,required=True,widget= forms.TextInput(attrs={'class':'form-control',"placeholder":"Password"}))
	password2=forms.CharField(max_length=100,required=True,widget= forms.TextInput(attrs={'class':'form-control',"placeholder":"Confirm Password"}))
	
	class Meta:
		model = Userprofile
		fields = ('email', 'username','mobnum', 'password1', 'password2', )
		widgets={
        "username":forms.TextInput(attrs={'class':'form-control',"placeholder":"Username"})
            }

	def clean_email(self):
		email = self.cleaned_data['email'].lower()
		try:
			account = Userprofile.objects.exclude(pk=self.instance.pk).get(email=email)
		except Userprofile.DoesNotExist:
			return email
		raise forms.ValidationError('Email "%s" is already in use.' % account)

	def clean_username(self):
		username = self.cleaned_data['username']
		try:
			account = Userprofile.objects.exclude(pk=self.instance.pk).get(username=username)
		except Userprofile.DoesNotExist:
			return username
		raise forms.ValidationError('Username "%s" is already in use.' % username) 