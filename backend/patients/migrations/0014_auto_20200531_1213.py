# Generated by Django 3.0.5 on 2020-05-31 04:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0013_auto_20200530_1345'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientclinical',
            name='patient',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='clinical', to='patients.Patient'),
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='patient',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='contact', to='patients.Patient'),
        ),
    ]