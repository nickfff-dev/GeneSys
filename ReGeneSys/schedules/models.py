from django.db import models
from django.conf import settings
from patients.models import Patient

# Create your models here.
class Schedules(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="patient")
    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    location = models.CharField(max_length=50)
    scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, editable=False, related_name="scheduler")

    def __str__(self):
        return self.patient.patientID + " - " + str(self.date) + " - " + str(self.timeStart) + " - " + str(self.timeEnd)


class ScheduleStaff(models.Model):
    schedule = models.ForeignKey(Schedules, on_delete=models.CASCADE, editable=False, related_name="schedule")
    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, editable=False, related_name="staff")

    def __str__(self):
        return str(self.schedule.date) + " - " + str(self.schedule.timeStart) + " - " +str(self.schedule.timeEnd) + " - " + str(self.staffID.email)