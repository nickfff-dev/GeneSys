# Generated by Django 3.0.7 on 2020-08-31 01:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('schedules', '0028_auto_20200831_0944'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='clinicschedulepatient',
            name='physician',
        ),
        migrations.AddField(
            model_name='clinicschedulepatient',
            name='physician',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='scheduled_physician', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
