# Generated by Django 3.0.5 on 2020-07-06 12:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0018_auto_20200706_1850'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='gender',
            new_name='sex',
        ),
    ]