# Generated by Django 3.0.5 on 2021-02-18 05:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0035_auto_20210212_1638'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientclinical',
            name='status',
            field=models.CharField(blank=True, max_length=17),
        ),
    ]
