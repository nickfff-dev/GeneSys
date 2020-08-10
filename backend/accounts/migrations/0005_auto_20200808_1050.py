# Generated by Django 3.0.7 on 2020-08-08 02:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('accounts', '0004_permissions_is_doctor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='permissions',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='permissions', to=settings.AUTH_USER_MODEL),
        ),
    ]
