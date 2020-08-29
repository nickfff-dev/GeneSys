import json
from .models import Event, ClinicSchedule, ClinicSchedulePatient
from rest_framework import generics, viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import EventSerializer, ClinicScheduleSerializer, ClinicSchedulePatientSerializer
from patients.models import Patient
from accounts.serializers import UserSerializer
from django.contrib.auth.models import User


#Event Viewset
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer

    queryset = Event.objects.all()

    permissionclasses = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        request.data['created_by'] = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        event = serializer.save(validated_data=request.data)
        return Response(
            EventSerializer(event,
                            context=self.get_serializer_context()).data, )


class ClinicScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = ClinicScheduleSerializer

    queryset = ClinicSchedule.objects.all()

    permissionclasses = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        request.data['event']['created_by'] = request.user
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        clinic_schedule = serializer.save(validated_data=request.data)
        return Response(
            ClinicScheduleSerializer(
                clinic_schedule, context=self.get_serializer_context()).data, )

    def update(self, request, *args, **kwargs):

        instance = self.get_object()
        serializer = ClinicScheduleSerializer(instance=instance,
                                              data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(instance, request.data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def search_by_date(self, request, pk=None):
        schedule_list = []
        date = request.GET.get('date')

        schedule = ClinicSchedule.objects.filter(event__date=date,
                                                 event__event_type='clinic')
        print(schedule)

        return Response(ClinicScheduleSerializer(schedule, many=True).data)

    @action(detail=False, methods=['get'])
    def search_available_physicians(self, request, pk=None):
        physician_list = []
        date = request.GET.get('date')
        print(date)

        physicians = User.objects.all().filter(permissions__is_doctor=True)
        print(physicians)

        scheduled_physicians = ClinicSchedule.objects.filter(
            event__date=date).values('physician')
        print(scheduled_physicians)

        available_physicians = physicians.exclude(id__in=scheduled_physicians)

        print(available_physicians)

        # return Response(UserSerializer(available_physicians, many=True).data)

        return Response()


class ClinicSchedulePatientViewSet(viewsets.ModelViewSet):
    serializer_class = ClinicSchedulePatientSerializer

    queryset = ClinicSchedulePatient.objects.all()

    permissionclasses = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def all(self, request, pk=None):

        date = request.GET.get('schedule')

        schedule = ClinicSchedulePatient.objects.filter(schedule__pk=date)
        print(date)

        return Response(
            ClinicSchedulePatientSerializer(schedule, many=True).data)


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
