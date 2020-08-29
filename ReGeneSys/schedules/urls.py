from rest_framework import routers
from .api import EventViewSet, ClinicScheduleViewSet, ClinicSchedulePatientViewSet

router = routers.DefaultRouter()
router.register('api/events', EventViewSet, 'events')
router.register('api/schedules', ClinicScheduleViewSet, 'schedules')
router.register('api/schedules/search_by_date/', ClinicScheduleViewSet,
                'schedules_by_date')
router.register('api/schedules/search_available_physicians/',
                ClinicScheduleViewSet, 'search_available_physicians')
router.register('api/scheduledpatients', ClinicSchedulePatientViewSet,
                'patients_by_schedule')
router.register('api/scheduledpatients/all', ClinicSchedulePatientViewSet,
                'patients_by_schedule')

urlpatterns = router.urls