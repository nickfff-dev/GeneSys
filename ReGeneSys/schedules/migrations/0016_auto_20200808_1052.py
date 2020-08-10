# Generated by Django 3.0.7 on 2020-08-08 02:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('schedules', '0015_auto_20200808_1050'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clinicschedule',
            name='physician',
            field=models.ForeignKey(limit_choices_to={'permissions': True}, on_delete=django.db.models.deletion.CASCADE, related_name='attending_physician', to=settings.AUTH_USER_MODEL),
        ),
    ]
