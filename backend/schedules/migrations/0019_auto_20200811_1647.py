# Generated by Django 3.0.5 on 2020-08-11 08:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('patients', '0032_auto_20200806_1146'),
        ('schedules', '0018_auto_20200811_1646'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClinicSchedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='PatientClinicSchedule',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_start', models.TimeField()),
                ('time_end', models.TimeField()),
                ('status', models.CharField(max_length=2)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='scheduled_patient', to='patients.Patient')),
                ('schedule', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clinic_schedule', to='schedules.ClinicSchedule')),
            ],
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=75)),
                ('date', models.DateField()),
                ('location', models.CharField(max_length=75)),
                ('event_type', models.CharField(max_length=75)),
                ('time_start', models.TimeField()),
                ('time_end', models.TimeField()),
                ('description', models.TextField(max_length=225)),
                ('attendees', models.ManyToManyField(related_name='attendees', to=settings.AUTH_USER_MODEL)),
                ('created_by', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='clinicschedule',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event', to='schedules.Event'),
        ),
        migrations.AddField(
            model_name='clinicschedule',
            name='physician',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attending_physician', to=settings.AUTH_USER_MODEL),
        ),
    ]
