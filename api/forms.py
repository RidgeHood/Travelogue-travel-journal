from django import forms
from django.forms import widgets

class ReviewForm(forms.Form):
    review_text=forms.CharField(label="Your Notes",widget=forms.Textarea,max_length=200,min_length=1)