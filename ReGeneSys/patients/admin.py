from django.contrib import admin
from .models import Patient, PatientContact, PatientClinical
# Register your models here.

admin.site.register(Patient)

class PatientContactInline(admin.StackedInline):
    model = PatientContact
    can_delete = False
    verbose_name_plural = 'Contact'

class PatientClinicalInline(admin.StackedInline):
    model = PatientClinical
    can_delete = False
    verbose_name_plural = 'Clinical'

class PatientAdmin(admin.ModelAdmin):
   inlines = [PatientContactInline,PatientClinicalInline]

admin.site.unregister(Patient)
admin.site.register(Patient, PatientAdmin)

