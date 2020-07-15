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
    patientID = models.CharField(max_length=30, primary_key=True)
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    middleName = models.CharField(max_length=50, null=True, blank=True)
    suffix = models.CharField(max_length=5, null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEXES)
    DOB = models.DateField()
    POB = models.CharField(max_length=75)
    streetAdd = models.CharField(max_length=255)
    brgyAdd = models.CharField(max_length=255)
    cityAdd = models.CharField(max_length=255)
    region = models.CharField(max_length=8, choices=REGIONS)
    dateCreated = models.DateTimeField(auto_now_add=True)
    createdBy = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, default=1, editable=False)

    def __str__(self):
        return self.firstName

class PatientContact(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="contact")
    mothersName = models.CharField(max_length=75, blank=True)
    mAddress= models.CharField(max_length=255, blank=True)
    mContactNumber = models.CharField(max_length=20, blank=True)
    fathersName = models.CharField(max_length=75, blank=True)
    fAddress= models.CharField(max_length=255, blank=True)
    fContactNumber = models.CharField(max_length=20, blank=True)
    altContactName = models.CharField(max_length=75, blank=True)
    altAddress= models.CharField(max_length=255, blank=True)
    altContactNumber = models.CharField(max_length=20, blank=True)

class PatientClinical(models.Model):
    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name="clinical")
    caseNumber = models.CharField(max_length=30, null=True, blank=True)
    patientType = models.CharField(max_length=3, blank=True)
    referringDoctor = models.CharField(max_length=75, blank=True)
    referringService = models.CharField(max_length=75, blank=True)
    referralReason = models.CharField(max_length=255, blank=True)
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