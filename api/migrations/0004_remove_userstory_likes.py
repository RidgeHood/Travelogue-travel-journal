# Generated by Django 2.2.24 on 2021-11-19 11:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_userstory_likes'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userstory',
            name='likes',
        ),
    ]