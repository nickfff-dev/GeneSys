from django.contrib import admin
from django.urls import path, re_path, include
from patients.api import generatePatientID

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('', include('patients.urls')),
    path('', include('accounts.urls')),
    path('', include('schedules.urls')),
    re_path(r'^api/patients/generateid', generatePatientID)

]
