# Generated by Django 3.0.5 on 2020-07-25 03:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='schedules',
            old_name='patientId',
            new_name='patientID',
        ),
        migrations.RenameField(
            model_name='schedulestaff',
            old_name='scheduleId',
            new_name='scheduleID',
        ),
    ]