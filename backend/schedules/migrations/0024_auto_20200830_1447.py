# Generated by Django 3.0.7 on 2020-08-30 06:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('schedules', '0023_auto_20200823_1226'),
    ]

    operations = [
        migrations.AddField(
            model_name='clinicschedulepatient',
            name='physician',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='atttending_physician', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='clinicschedule',
            name='physician',
        ),
        migrations.AddField(
            model_name='clinicschedule',
            name='physician',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='attending_physician', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
