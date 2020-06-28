from rest_framework import serializers
from .models import Patient, PatientContact, PatientClinical 

# Patient Serializer


class PatientContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientContact
        fields = ('mothersName','mAddress','mContactNumber','fathersName','fAddress','fContactNumber','altContactName','altAddress','altContactNumber')

class PatientClinicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientClinical
        fields = ('gestationAge' ,'birthWeight','birthHospital','collectionHospital','attendingPhys','attendingContact','specialistName','specialistContact','collectionDate','sampleReceptionDate','rCollectionDate','rSampleReceptionDate','diagnosis','diagnosisDate','treatmentDate','note', 'status')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('patientID','caseNumber','firstName','lastName','middleName','suffix','gender','DOB','POB','streetAdd','brgyAdd','cityAdd','region') 

class PatientContactClinicalSerializer(serializers.ModelSerializer):
    contact = PatientContactSerializer(required=True)
    clinical = PatientClinicalSerializer(required=True)
    class Meta:
        model = Patient
        fields = ('patientID','caseNumber','firstName','lastName','middleName','suffix','gender','DOB','POB','streetAdd','brgyAdd','cityAdd','region', 'contact', 'clinical')

    def save(self, validated_data):
        contactData = validated_data.pop('contact')
        clinicalData = validated_data.pop('clinical')
        patient = Patient.objects.create(patientID = validated_data['patientID'], caseNumber = validated_data['caseNumber'], firstName = validated_data['firstName'], lastName = validated_data['lastName'], middleName = validated_data['middleName'], suffix = validated_data['suffix'], gender = validated_data['gender'], DOB = validated_data['DOB'], POB = validated_data['POB'], streetAdd = validated_data['streetAdd'], brgyAdd = validated_data['brgyAdd'], cityAdd = validated_data['cityAdd'], region = validated_data['region'])
        contact = PatientContact.objects.create(patient=patient, mothersName=contactData['mothersName'], mAddress=contactData['mAddress'], mContactNumber=contactData['mContactNumber'], fathersName=contactData['fathersName'], fAddress=contactData['fAddress'], fContactNumber=contactData['fContactNumber'], altContactName=contactData['altContactName'], altAddress=contactData['altAddress'], altContactNumber=contactData['altContactNumber'])
        clinical = PatientClinical.objects.create(patient= patient, gestationAge=clinicalData['gestationAge'], birthWeight=clinicalData['birthWeight'], birthHospital=clinicalData['birthHospital'], collectionHospital=clinicalData['collectionHospital'], attendingPhys=clinicalData['attendingPhys'], attendingContact=clinicalData['attendingContact'], specialistName=clinicalData['specialistName'], specialistContact=clinicalData['specialistContact'], collectionDate=clinicalData['collectionDate'], sampleReceptionDate=clinicalData['sampleReceptionDate'], rCollectionDate=clinicalData['rCollectionDate'], rSampleReceptionDate=clinicalData['rSampleReceptionDate'], diagnosis=clinicalData['diagnosis'], diagnosisDate=clinicalData['diagnosisDate'], treatmentDate=clinicalData['treatmentDate'], note=clinicalData['note'], status=clinicalData['status'])
        validated_data['contact']=contactData
        validated_data['clinical']=clinicalData
        print(validated_data)
        return validated_data

    def update(self, instance, validated_data):
        contact_data = validated_data.pop('contact')
        clinical_data = validated_data.pop('clinical')

        instance.caseNumber = validated_data.get('caseNumber', instance.caseNumber)
        instance.firstName = validated_data.get('firstName', instance.firstName)
        instance.lastName = validated_data.get('lastName', instance.lastName)
        instance.middleName = validated_data.get('middleName', instance.middleName)
        instance.suffix = validated_data.get('suffix', instance.suffix)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.DOB = validated_data.get('DOB', instance.DOB)
        instance.POB = validated_data.get('POB', instance.POB)
        instance.streetAdd = validated_data.get('streetAdd', instance.streetAdd)
        instance.brgyAdd = validated_data.get('brgyAdd', instance.brgyAdd)
        instance.cityAdd = validated_data.get('cityAdd', instance.cityAdd)
        instance.region = validated_data.get('region', instance.region)
        instance.save()

        nested_serializer_contact = self.fields['contact']
        nested_serializer_clinical = self.fields['clinical']
        
        nested_serializer_contact.update(instance.contact, contact_data)
        nested_serializer_clinical.update(instance.clinical, clinical_data)


        print(instance)





        # contact = instance.contact

        # contact.mothersName = validated_data.get('mothersName', contact.mothersName)
        # contact.mAddress= validated_data.get('mAddress', contact.mAddress)
        # contact.mContactNumber= validated_data.get('mContactNumber', contact.mContactNumber)
        # contact.fathersName= validated_data.get('fathersName', contact.fathersName)
        # contact.fAddress= validated_data.get('fAddress', contact.fAddress)
        # contact.fContactNumber= validated_data.get('fContactNumber', contact.fContactNumber)
        # contact.altContactName= validated_data.get('altContactName', contact.altContactName)
        # contact.altAddress= validated_data.get('altAddress', contact.altAddress)
        # contact.altContactNumber= validated_data.get('altContactNumber', contact.altContactNumber)
        # instance.save()


        # contact = patient.contact
        # clinical = patient.clinical


        return instance
    
    






    
