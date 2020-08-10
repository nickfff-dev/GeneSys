import json
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, ClinicSchedule, PatientClinicSchedule
from patients.models import Patient
from patients.serializers import PatientSerializer


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('name','date', 'location', 'event_type', 'time_start', 'time_end', 'description', 'attendees', 'createdBy')

    # def save(self, validated_data, requester)

class ClinicScheduleSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=True)
    class Meta:
        model = ClinicSchedule
        fields = ('event', 'physician')

class PatientClinicScheduleSerializer(serializers.ModelSerializer):
    clinic_schedule = ClinicScheduleSerializer(required=True)
    class Meta:
        model = PatientClinicSchedule
        field = ('clinic_schedule', 'patient', 'time_start', 'time_end', 'status')




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



        
        
