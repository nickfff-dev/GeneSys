# Generated by Django 3.0.7 on 2020-08-31 01:44

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('schedules', '0027_auto_20200831_0918'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinicschedulepatient',
            name='physician',
            field=models.ManyToManyField(related_name='scheduled_physician', to=settings.AUTH_USER_MODEL),
        ),
        migrations.RemoveField(
            model_name='clinicschedule',
            name='physician',
        ),
        migrations.AddField(
            model_name='clinicschedule',
            name='physician',
            field=models.ManyToManyField(related_name='attending_physician', to=settings.AUTH_USER_MODEL),
        ),
    ]
