# Generated by Django 2.2.24 on 2021-11-19 14:36

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='like',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
