# Generated by Django 3.0.5 on 2020-07-26 05:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0005_auto_20200726_1120'),
    ]

    operations = [
        migrations.RenameField(
            model_name='schedulestaff',
            old_name='staffID',
            new_name='staff',
        ),
    ]
