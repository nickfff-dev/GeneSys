import json
from rest_framework import serializers
from .models import Event, ClinicSchedule, ClinicSchedulePatient
from patients.models import Patient
from patients.serializers import PatientContactClinicalSerializer
from accounts.serializers import UserSerializer
from django.contrib.auth.models import User


class EventSerializer(serializers.ModelSerializer):
    attendees = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('pk', 'name', 'date', 'location', 'event_type', 'time_start',
                  'time_end', 'description', 'attendees')

    def save(self, validated_data):
        instance = Event.objects.create(
            name=validated_data['name'],
            date=validated_data['date'],
            location=validated_data['location'],
            event_type=validated_data['event_type'],
            time_start=validated_data['time_start'],
            time_end=validated_data['time_end'],
            description=validated_data['description'],
            created_by=validated_data['created_by'])
        instance.attendees.set(validated_data['attendees'])

        return instance


class PhysicianListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        physician_mapping = {physician.id: physician for physician in instance}
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for physician_id, data in data_mapping.items():
            physician = physician_mapping.get(physician_id, None)
            if physician is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(physician, data))

        # Perform deletions.
        for physician_id, physician in physician_mapping.items():
            if physician_id not in data_mapping:
                physician.delete()

        return ret


class ClinicScheduleSerializer(serializers.ModelSerializer):
    event = EventSerializer(required=True)
    physician = UserSerializer(many=True, read_only=True)

    class Meta:
        model = ClinicSchedule
        # list_serializer_class = PhysicianListSerializer
        fields = ('pk', 'event', 'physician')

    def save(self, validated_data):
        event_data = validated_data.pop('event')
        physician_data = validated_data.pop('physician')
        event_instance = Event.objects.create(
            name=event_data['name'],
            date=event_data['date'],
            location=event_data['location'],
            event_type=event_data['event_type'],
            time_start=event_data['time_start'],
            time_end=event_data['time_end'],
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
        print(nested_serializer_event)
        nested_serializer_physician.update(instance.physician, physician_data)

        return instance
        # instance.event.name = event_data.get('name', instance.event.name)
        # instance.event.date = event_data.get('date', instance.event.date)
        # instance.event.location = event_data.get('location',
        #                                          instance.event.location)
        # instance.event.event_type = event_data.get('event_type',
        #                                            instance.event.event_type)
        # instance.event.time_start = event_data.get('time_start',
        #                                            instance.event.time_start)
        # instance.event.time_end = event_data.get('time_end',
        #                                          instance.event.time_end)
        # instance.event.description = event_data.get('description',
        #                                             instance.event.description)

        # instance.save()


class ClinicSchedulePatientSerializer(serializers.ModelSerializer):
    schedule = ClinicScheduleSerializer(required=True)
    patient = PatientContactClinicalSerializer(required=True)

    class Meta:
        model = ClinicSchedulePatient
        fields = ('schedule', 'patient', 'time_start', 'time_end', 'status')


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
