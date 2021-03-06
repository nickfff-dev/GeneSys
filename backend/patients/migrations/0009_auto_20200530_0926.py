# Generated by Django 3.0.5 on 2020-05-30 01:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0008_patientclinical_status'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patient',
            old_name='BrgyAdd',
            new_name='brgyAdd',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='CaseNumber',
            new_name='caseNumber',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='CityAdd',
            new_name='cityAdd',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='CreatedBy',
            new_name='createdBy',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='DateCreated',
            new_name='dateCreated',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='FirstName',
            new_name='firstName',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='Gender',
            new_name='gender',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='LastName',
            new_name='lastName',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='MiddleName',
            new_name='middleName',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='PatientID',
            new_name='patientID',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='Region',
            new_name='region',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='StreetAdd',
            new_name='streetAdd',
        ),
        migrations.RenameField(
            model_name='patient',
            old_name='Suffix',
            new_name='suffix',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='AttendingContact',
            new_name='attendingContact',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='AttendingPhys',
            new_name='attendingPhys',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='BirthHospital',
            new_name='birthHospital',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='BirthWeight',
            new_name='birthWeight',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='CollectionDate',
            new_name='collectionDate',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='CollectionHospital',
            new_name='collectionHospital',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='Diagnosis',
            new_name='diagnosis',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='DiagnosisDate',
            new_name='diagnosisDate',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='GestationAge',
            new_name='gestationAge',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='Note',
            new_name='note',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='PatientID',
            new_name='patientID',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='RCollectionDate',
            new_name='rCollectionDate',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='SampleReceptionDate',
            new_name='sampleReceptionDate',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='SpecialistContact',
            new_name='specialistContact',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='SpecialistName',
            new_name='specialistName',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='Status',
            new_name='status',
        ),
        migrations.RenameField(
            model_name='patientclinical',
            old_name='TreatmentDate',
            new_name='treatmentDate',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='AltAddress',
            new_name='altAddress',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='AltContactName',
            new_name='altContactName',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='AltContactNumber',
            new_name='altContactNumber',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='FAddress',
            new_name='fAddress',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='FContactNumber',
            new_name='fContactNumber',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='FathersName',
            new_name='fathersName',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='MAddress',
            new_name='mAddress',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='MContactNumber',
            new_name='mContactNumber',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='MothersName',
            new_name='mothersName',
        ),
        migrations.RenameField(
            model_name='patientcontact',
            old_name='PatientID',
            new_name='patientID',
        ),
    ]
