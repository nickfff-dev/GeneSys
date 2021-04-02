from django.conf.urls import url
from . import views
from django.contrib import admin
from django.urls import path, re_path, include
from rest_framework import routers
from patients.api import generatePatientID

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('patients.urls')),
    path('', include('accounts.urls')),
    path('', include('schedules.urls')),
    url(r'^', views.FrontendAppView.as_view()),
    re_path(r'^api/patients/generateid', generatePatientID),
]
