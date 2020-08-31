from django.contrib import admin
from .models import Event, ClinicSchedule, ClinicSchedulePatient
# Register your models here.


class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'event_type')


# class ClinicScheduleAdmin(admin.ModelAdmin):
#     list_display = ('event', 'physician')


class ClinicSchedulePatientAdmin(admin.ModelAdmin):
    list_display = ('schedule', 'patient', 'physician', 'time_start', 'time_end')


admin.site.register(Event, EventAdmin)
admin.site.register(ClinicSchedule, )
admin.site.register(ClinicSchedulePatient, ClinicSchedulePatientAdmin)
