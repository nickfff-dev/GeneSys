# Generated by Django 3.0.7 on 2020-08-08 02:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0011_auto_20200808_1002'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedulestaff',
            name='schedule',
        ),
        migrations.RemoveField(
            model_name='schedulestaff',
            name='staff',
        ),
        migrations.DeleteModel(
            name='Schedules',
        ),
        migrations.DeleteModel(
            name='ScheduleStaff',
        ),
    ]
