# Generated by Django 3.0.7 on 2020-08-06 03:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0029_patient_patientclinical_patientcontact'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='dob',
            new_name='birth_date',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='pob',
            new_name='birth_place',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='patient_nype',
            new_name='patient_type',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='altcontact_ame',
            new_name='alt_contact_name',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='altcontact_number',
            new_name='alt_contact_number',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='faddress',
            new_name='f_address',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='fcontactNumber',
            new_name='f_contact_number',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='mAddress',
            new_name='m_address',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='mContact_number',
            new_name='m_contact_number',
        ),
    ]
