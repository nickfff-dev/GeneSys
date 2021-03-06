# Generated by Django 3.0.5 on 2021-02-12 03:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0032_auto_20200806_1146'),
    ]

    operations = [
        migrations.AlterField(
            model_name='patient',
            name='region',
            field=models.CharField(choices=[('NCR', 'NCR'), ('Region I', 'Region I'), ('CAR', 'CAR'), ('Region II', 'Region II'), ('Region III', 'Region III'), ('Region IV-A', 'Region IV-A or CALABARZON'), ('MIMAROPA Region', 'MIMAROPA Region'), ('Region V', 'Region V'), ('Region VI', 'Region VI'), ('Region VII', 'Region VII'), ('Region VIII', 'Region VIII'), ('Region IX', 'Region IX)'), ('Region X', 'Region X'), ('Region XI', 'Region XI'), ('Region XII', 'Region XII'), ('Region XIII', 'Region XIII'), ('BARMM', 'BARMM')], max_length=15),
        ),
        migrations.AlterField(
            model_name='patient',
            name='sex',
            field=models.CharField(choices=[('', 'Choose...'), ('Male', 'Male'), ('Female', 'Female'), ('Ambiguous', 'Ambiguous')], max_length=9),
        ),
    ]
