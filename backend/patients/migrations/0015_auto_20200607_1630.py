# Generated by Django 3.0.5 on 2020-06-07 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0014_auto_20200531_1213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patientclinical',
            name='attendingContact',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='attendingPhys',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='birthHospital',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='birthWeight',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='collectionDate',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='collectionHospital',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='diagnosis',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='diagnosisDate',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='gestationAge',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='note',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='rCollectionDate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='rSampleReceptionDate',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='sampleReceptionDate',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='specialistContact',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='specialistName',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='status',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='patientclinical',
            name='treatmentDate',
            field=models.DateField(blank=True),
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='altAddress',
            field=models.CharField(blank=True, default='test', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='altContactName',
            field=models.CharField(blank=True, default='test', max_length=75),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='altContactNumber',
            field=models.CharField(blank=True, default=0, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='fAddress',
            field=models.CharField(blank=True, default='test', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='fContactNumber',
            field=models.CharField(blank=True, default=0, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='fathersName',
            field=models.CharField(blank=True, default='test', max_length=75),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='mAddress',
            field=models.CharField(blank=True, default='test', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='mContactNumber',
            field=models.CharField(blank=True, default=0, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='patientcontact',
            name='mothersName',
            field=models.CharField(blank=True, default='test', max_length=75),
            preserve_default=False,
        ),
    ]
