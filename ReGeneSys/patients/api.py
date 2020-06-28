from patients.models import Patient
from rest_framework.response import Response
from rest_framework import generics, viewsets, permissions
from .serializers import PatientSerializer, PatientContactClinicalSerializer

#Patient Viewset
class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientContactClinicalSerializer

    queryset = Patient.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    
    def update(self, request, *args, **kwargs):

        instance = self.get_object()
        instance = request.data

        instance = self.get_object()
        serializer = PatientContactClinicalSerializer(
        instance=instance,
        data=request.data
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(instance, request.data)
        return Response(serializer.data)
        
        # return Response(PatientContactClinicalSerializer(instance, context=self.get_serializer_context()).data,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save(validated_data=request.data)
        return Response(PatientContactClinicalSerializer(patient, context=self.get_serializer_context()).data,
        )


