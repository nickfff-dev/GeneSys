# Generated by Django 3.0.5 on 2021-02-12 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0034_auto_20210212_1419'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientclinical',
            name='referral_reason',
            field=models.CharField(blank=True, max_length=500),
        ),
    ]
