import json
from .models import Schedules, ScheduleStaff
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from .serializers import ScheduleSerializer, ScheduleStaffSerializer, ScheduleScheduleStaffSerializer
from patients.models import Patient

#Schedule Viewset
class ScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ScheduleScheduleStaffSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        scheduleDetails = Patient.objects.all()

        return scheduleDetails

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.save(validated_data=request.data, requester=request.user)
        staff = []
        for x in schedule['staff']:
            staff.append((ScheduleStaffSerializer(x, context=self.get_serializer_context()).data)['staffID'])

        return Response({
            "schedule": ScheduleSerializer(schedule['schedule'], context=self.get_serializer_context()).data,
            "staff": staff
        })

    def update(self, request, *args, **kwargs):

        instance = self.get_object()

        serializer = ScheduleScheduleStaffSerializer(instance=instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        schedule = serializer.update(instance, request.data)
        staff = []
        for x in schedule['staff']:
            staff.append((ScheduleStaffSerializer(x, context=self.get_serializer_context()).data)['staffID'])

        return Response({
            "schedule": ScheduleSerializer(schedule['schedule'], context=self.get_serializer_context()).data,
            "staff": staff
        })
        
    