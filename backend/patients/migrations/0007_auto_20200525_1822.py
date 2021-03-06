# Generated by Django 3.0.5 on 2020-05-25 10:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0006_auto_20200525_1801'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientclinical',
            name='PatientID',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='clinical', to='patients.Patient'),
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='PatientID',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='contact', to='patients.Patient'),
        ),
    ]
