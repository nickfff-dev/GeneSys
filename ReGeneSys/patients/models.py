from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

SEXES = (
    ('', 'Choose...'),
    ('M', 'Male'),
    ('F', 'Female'),
    ('A', 'Ambiguous')
)

REGIONS = (
    ('NCR', 'NCR'),
    ('I', 'Region I'),
    ('CAR', 'CAR'),
    ('II', 'Region II'),
    ('III', 'Region III'),
    ('IV-A', 'Region IV-A or CALABARZON'),
    ('MIMAROPA', 'MIMAROPA Region'),
    ('V', 'Region V'),
    ('VI', 'Region VI'),
    ('VII', 'Region VII'),
    ('VIII', 'Region VIII'),
    ('IX', 'Region IX)'),
    ('X', 'Region X'),
    ('XI', 'Region XI'),
    ('XII', 'Region XII'),
    ('XIII', 'Region XIII'),
    ('BARMM', 'BARMM'),
)


# class Patient(models.Model):
#     PatientID = models.CharField(max_length=100, primary_key=True)
#     FirstName = models.CharField(max_length=100)
#     LastName = models.CharField(max_length=100)
#     MiddleName = models.CharField(max_length=50)
#     Suffix = models.CharField(max_length=5, null=True, blank=True)
#     DOB = models.DateField()
#     Gender = models.CharField(max_length=1, choices=GENDERS)
#     StreetAdd = models.CharField(max_length=255)
#     BrgyAdd = models.CharField(max_length=255)
#     CityAdd = models.CharField(max_length=255)
#     Region = models.CharField(max_length=8, choices=REGIONS)
#     ContactPerson = models.CharField(max_length=50)
#     ContactNumber = models.CharField(max_length=20)
#     DateCreated = models.DateTimeField(auto_now_add=True)
#     CreatedBy = models.ForeignKey(
#         settings.AUTH_USER_MODEL, on_delete=models.PROTECT, default=1, editable=False)

#     def __str__(self):
#         return self.FirstName
        

class Patient(models.Model):
    patient_id = models.CharField(max_length=30, primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=50, null=True, blank=True)
    suffix = models.CharField(max_length=5, null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEXES)
    birth_date = models.DateField()
    birth_place = models.CharField(max_length=75)
    street_add = models.CharField(max_length=255)
    brgy_add = models.CharField(max_length=255)
    city_add = models.CharField(max_length=255)
    region = models.CharField(max_length=8, choices=REGIONS)
    date_created = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, editable=False)

    def __str__(self):
        return self.first_name

class PatientContact(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="contact")
    mothers_name = models.CharField(max_length=75, blank=True)
    m_address= models.CharField(max_length=255, blank=True)
    m_contact_number = models.CharField(max_length=20, blank=True)
    fathers_name = models.CharField(max_length=75, blank=True)
    f_address= models.CharField(max_length=255, blank=True)
    f_contact_number = models.CharField(max_length=20, blank=True)
    alt_contact_name = models.CharField(max_length=75, blank=True)
    alt_address = models.CharField(max_length=255, blank=True)
    alt_contact_number = models.CharField(max_length=20, blank=True)

class PatientClinical(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="clinical")
    case_number = models.CharField(max_length=30, null=True, blank=True)
    patient_type = models.CharField(max_length=3, blank=True)
    referring_doctor = models.CharField(max_length=75, blank=True)
    referring_service = models.CharField(max_length=75, blank=True)
    referral_reason = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=10, blank=True)
    # workingImpression = models.CharField(max_length=255, blank=True)
    # medicalHistory = models.CharField(max_length=255, blank=True)
    # otherHistory = models.CharField(max_length=255, blank=True)
    # finalDiagnosis = models.CharField(max_length=255, blank=True)


# class PatientClinical(models.Model):
#     patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="clinical")
#     gestationAge = models.IntegerField(blank=True)
#     birthWeight = models.IntegerField(blank=True)
#     birthHospital = models.CharField(max_length=100, blank=True)
#     collectionHospital = models.CharField(max_length=100, blank=True)
#     attendingPhys = models.CharField(max_length=50, blank=True)
#     attendingContact = models.CharField(max_length=20, blank=True)
#     specialistName = models.CharField(max_length=50, blank=True)
#     specialistContact = models.CharField(max_length=20, blank=True)
#     collectionDate = models.DateField(blank=True)
#     sampleReceptionDate = models.DateField(blank=True)
#     rCollectionDate = models.DateField(null=True, blank=True)
#     rSampleReceptionDate = models.DateField(null=True, blank=True)
#     diagnosis = models.CharField(max_length=100, blank=True)
#     diagnosisDate = models.DateField(blank=True)
#     treatmentDate = models.DateField(blank=True)
#     note = models.CharField(max_length=255, blank=True)
#     