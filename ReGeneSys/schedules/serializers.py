import json
import pytz

from dateutil import tz, parser
from datetime import datetime, timezone

from rest_framework import serializers
from .models import Event, ClinicSchedule, ClinicSchedulePatient
from patients.models import Patient
from patients.serializers import PatientSerializer, PatientContactClinicalSerializer
from accounts.serializers import UserSerializer
from django.contrib.auth.models import User


def local_to_UTC(local_time):

    # utc_datetime = local_time.astimezone(tz.UTC)

    # test = datetime.strptime(local_time, '%Y-%m-%d %H:%M:%S.%f%Z')
    test = parser.parse(local_time)
    print(local_time)
    print(test)

    # utc_datetime = datetime.fromtimestamp(,                                          tz=timezone.utc)

    print(utc_datetime)

    return utc_datetime


class EventSerializer(serializers.ModelSerializer):
    attendees = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('pk', 'name', 'date', 'location', 'event_type', 'start_time',
                  'end_time', 'description', 'attendees')

    def save(self, validated_data):

        instance = Event.objects.create(
            name=validated_data['name'],
            date=validated_data['date'],
            location=validated_data['location'],
            event_type=validated_data['event_type'],
            start_time=validated_data['start_time'],
            end_time=validated_data['end_time'],
            description=validated_data['description'],
            created_by=validated_data['created_by'])
        instance.attendees.set(validated_data['attendees'])

        return instance


class ClinicScheduleSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=True)
    physician = UserSerializer(many=True, read_only=True)

    class Meta:
        model = ClinicSchedule
        fields = ('pk', 'event', 'physician')

    def save(self, validated_data):
        event_data = validated_data.pop('event')
        physician_data = validated_data.pop('physician')

        utc_date = datetime.strftime(
            datetime.strptime(event_data['start_time'],
                              "%Y-%m-%dT%H:%M:%S.%f%z"), "%Y-%m-%d")

        print(utc_date)

        event_instance = Event.objects.create(
            name=event_data['name'],
            date=utc_date,
            location=event_data['location'],
            event_type=event_data['event_type'],
            start_time=event_data['start_time'],
            end_time=event_data['end_time'],
            description=event_data['description'],
            created_by=event_data['created_by'])
        event_instance.attendees.set(event_data['attendees'])
        physicians = User.objects.all().filter(pk__in=physician_data)
        print(physicians)
        schedule_instance = ClinicSchedule.objects.create(event=event_instance)
        schedule_instance.physician.set(physician_data)
        print(schedule_instance)

        return schedule_instance

    def update(self, instance, validated_data):
        event_data = validated_data.pop('event')
        physician_data = validated_data.pop('physician')

        nested_serializer_event = self.fields['event']
        nested_serializer_physician = self.fields['physician']

        nested_serializer_event.update(instance.event, event_data)

        physicians = User.objects.all().filter(pk__in=physician_data)

        print(physician_data)

        instance.physician.set(physicians)

        print(instance)

        return instance


class ClinicSchedulePatientSerializer(serializers.ModelSerializer):
    schedule = ClinicScheduleSerializer(read_only=True)
    patient = PatientContactClinicalSerializer(read_only=True)

    class Meta:
        model = ClinicSchedulePatient
        fields = ('schedule', 'patient', 'physician', 'time_start', 'time_end',
                  'status')

    def save(self, validated_data):

        schedule = ClinicSchedule.objects.get(pk=validated_data['schedule'])
        patient = Patient.objects.get(patient_id=validated_data['patient'])
        physician = User.objects.get(pk=validated_data['physician'])

        patient_schedule_instance = ClinicSchedulePatient.objects.create(
            schedule=schedule,
            patient=patient,
            physician=physician,
            time_start=validated_data['time_start'],
            time_end=validated_data['time_end'],
            status=validated_data['status'])
        return patient_schedule_instance

    def update(self, instance, validated_data):

        print(self)

        validated_data['schedule'] = ClinicSchedule.objects.get(
            pk=validated_data['schedule'])
        validated_data['patient'] = Patient.objects.get(
            patient_id=validated_data['patient'])
        validated_data['physician'] = User.objects.get(
            pk=validated_data['physician'])

        instance.schedule = validated_data.get('schedule', instance.schedule)
        instance.patient = validated_data.get('patient', instance.patient)
        instance.physician = validated_data.get('physician',
                                                instance.physician)
        instance.time_start = validated_data.get('time_start',
                                                 instance.time_start)
        instance.time_end = validated_data.get('time_end', instance.time_end)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        return instance


# class PatientClinicScheduleSerializer(serializers.ModelSerializer):
#     patient_schedule = EventSerializer(many=True, required=True)
#     staff = ScheduleStaffSerializer(many=True, required=True)
#     class Meta:
#         model = Schedules
#         fields = ('schedule', 'staff')

#     def save(self, validated_data, requester):
#         scheduleData = validated_data.pop('schedule')
#         staffData = validated_data.pop('staff')
#         patient = Patient.objects.get(patientID = scheduleData['patient'])
#         schedule = Schedules.objects.create(patient=patient, date=scheduleData['date'], timeStart=scheduleData['timeStart'], timeEnd=scheduleData['timeEnd'], location=scheduleData['location'], scheduledBy=requester)
#         staff = []
#         for x in staffData['staffID']:
#             user = User.objects.get(id=x)
#             assignStaff = ScheduleStaff.objects.create(schedule=schedule, staffID=user)
#             staff.append(assignStaff)

#         validated_data['schedule'] = schedule
#         validated_data['staff'] = staff
#         return validated_data

#     def update(self, instance, validated_data):
#         staffData = validated_data.pop('staff')

#         old_data = ScheduleStaff.objects.filter(schedule=instance.id)

#         print(validated_data)

#         instance.date = validated_data['schedule'].get('date', instance.date)
#         instance.timeStart = validated_data['schedule'].get('timeStart', instance.timeStart)
#         instance.timeEnd = validated_data['schedule'].get('timeEnd', instance.timeEnd)
#         instance.location = validated_data['schedule'].get('location', instance.location)

#         instance.save()
#         old_data.delete()
#         staff = []

#         for x in staffData['staffID']:
#             user = User.objects.get(id=x)
#             assignStaff = ScheduleStaff.objects.create(schedule=instance, staffID=user)
#             staff.append(assignStaff)

#         validated_data['schedule'] = instance
#         validated_data['staff'] = staff

#         return validated_data
