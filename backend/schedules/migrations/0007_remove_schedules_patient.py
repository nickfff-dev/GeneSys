# Generated by Django 3.0.5 on 2020-07-26 06:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('schedules', '0006_auto_20200726_1347'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='schedules',
            name='patient',
        ),
    ]
