from rest_framework import serializers
from .models import Patient, PatientContact, PatientClinical 

# Patient Serializer


class PatientContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientContact
        fields = ('mothers_name','m_address','m_contact_number','fathers_name','f_address','f_contact_number','alt_contact_name','alt_address','alt_contact_number')

class PatientClinicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientClinical
        # fields = ('gestationAge' ,'birthWeight','birthHospital','collectionHospital','attendingPhys','attendingContact','specialistName','specialistContact','collectionDate','sampleReceptionDate','rCollectionDate','rSampleReceptionDate','diagnosis','diagnosisDate','treatmentDate','note', 'status')
        fields = ('case_number', 'patient_type', 'referring_doctor', 'referring_service', 'referral_reason', 'status')

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('patient_id','first_name','last_name','middle_name','suffix','sex','birth_date','birth_place','street_add','brgy_add','city_add','region') 

class PatientContactClinicalSerializer(serializers.ModelSerializer):
    contact = PatientContactSerializer(required=True)
    clinical = PatientClinicalSerializer(required=True)
    class Meta:
        model = Patient
        fields = ('patient_id','first_name','last_name','middle_name','suffix','sex','birth_date','birth_place','street_add','brgy_add','city_add','region', 'contact', 'clinical')

    def save(self, validated_data, requester):
        contactData = validated_data.pop('contact')
        clinicalData = validated_data.pop('clinical')
        patient = Patient.objects.create(patient_id = validated_data['patient_id'], first_name = validated_data['first_name'], last_name = validated_data['last_name'], middle_name = validated_data['middle_name'], suffix = validated_data['suffix'], sex = validated_data['sex'], birth_date = validated_data['birth_date'], birth_place = validated_data['birth_place'], street_add = validated_data['street_add'], brgy_add = validated_data['brgy_add'], city_add = validated_data['city_add'], region = validated_data['region'], created_by = requester)
        contact = PatientContact.objects.create(patient=patient, mothers_name=contactData['mothers_name'], m_address=contactData['m_address'], m_contact_number=contactData['m_contact_number'], fathers_name=contactData['fathers_name'], f_address=contactData['f_address'], f_contact_number=contactData['f_contact_number'], alt_contact_name=contactData['alt_contact_name'], alt_address=contactData['alt_address'], alt_contact_number=contactData['alt_contact_number'])
        clinical = PatientClinical.objects.create(patient= patient, case_number=clinicalData['case_number'], patient_type=clinicalData['patient_type'], referring_doctor=clinicalData['referring_doctor'], referring_service=clinicalData['referring_service'], referral_reason=clinicalData['referral_reason'], status=clinicalData['status'])
        validated_data['contact']=contactData
        validated_data['clinical']=clinicalData
        print(validated_data)
        return validated_data

    def update(self, instance, validated_data):
        contact_data = validated_data.pop('contact')
        clinical_data = validated_data.pop('clinical')

        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.middle_name = validated_data.get('middle_name', instance.middle_name)
        instance.suffix = validated_data.get('suffix', instance.suffix)
        instance.sex = validated_data.get('sex', instance.sex)
        instance.birth_date = validated_data.get('birth_date', instance.birth_date)
        instance.birth_place = validated_data.get('birth_place', instance.birth_place)
        instance.street_add = validated_data.get('street_add', instance.street_add)
        instance.brgy_add = validated_data.get('brgy_add', instance.brgy_add)
        instance.city_add = validated_data.get('city_add', instance.city_add)
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
    
    






    
