from rest_framework import routers
from .api import PatientViewSet

router = routers.DefaultRouter()
router.register('api/patients', PatientViewSet, 'patients')

urlpatterns = router.urls