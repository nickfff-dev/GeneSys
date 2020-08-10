import json
from .models import Event, ClinicSchedule, PatientClinicSchedule
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from .serializers import EventSerializer, ClinicScheduleSerializer, PatientClinicScheduleSerializer
from patients.models import Patient

#Event Viewset
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permissionclasses = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        events = Event.objects.all()

        return events

    def create(self, request, *args, **kwargs):
        request.data['createdBy'] = request.user
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(validated_data=request.data)
        return Response(EventSerializer(event, context=self.get_serializer_context()).data,
        )

#Schedule Viewset
# class ScheduleViewSet(viewsets.ModelViewSet):
#     serializer_class = ScheduleScheduleStaffSerializer
#     permission_classes = [
#         permissions.IsAuthenticated
#     ]

#     def get_queryset(self):
#         scheduleDetails = Patient.objects.all()

#         return scheduleDetails

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         schedule = serializer.save(validated_data=request.data, requester=request.user)
#         staff = []
#         for x in schedule['staff']:
#             staff.append((ScheduleStaffSerializer(x, context=self.get_serializer_context()).data)['staffID'])

#         return Response({
#             "schedule": ScheduleSerializer(schedule['schedule'], context=self.get_serializer_context()).data,
#             "staff": staff
#         })

#     def update(self, request, *args, **kwargs):

#         instance = self.get_object()

#         serializer = ScheduleScheduleStaffSerializer(instance=instance, data=request.data)
#         serializer.is_valid(raise_exception=True)
#         schedule = serializer.update(instance, request.data)
#         staff = []
#         for x in schedule['staff']:
#             staff.append((ScheduleStaffSerializer(x, context=self.get_serializer_context()).data)['staffID'])

#         return Response({
#             "schedule": ScheduleSerializer(schedule['schedule'], context=self.get_serializer_context()).data,
#             "staff": staff
#         })
        
    