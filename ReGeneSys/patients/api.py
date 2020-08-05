import time
import datetime
import math

from patients.models import Patient
from rest_framework import generics, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PatientSerializer, PatientContactClinicalSerializer

from ReGeneSys.common.mixins import FromCamelCase, ToCamelCase


#Patient Viewset
class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientContactClinicalSerializer

    queryset = Patient.objects.all()
    permission_classes = [
        permissions.IsAuthenticated
    ]
    
    
    def update(self, request, *args, **kwargs):

        # instance = self.get_object()
        # instance = request.data

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

rn = datetime.datetime.now()
epoch = datetime.datetime.utcfromtimestamp(0)


# @method_decorator(csrf_exempt)
@api_view(['GET'])
def generatePatientID(request):
    rn = datetime.datetime.now()
    epoch = datetime.datetime.utcfromtimestamp(0)

    def unix_time_millis(dt):
        return (dt - epoch).total_seconds() * 1000.0

    def microtime(get_as_float = False) :
        t = time.mktime(rn.timetuple())
        if get_as_float:
            return t
        else:
            ms = rn.microsecond / 1000000.
            return '%f' % (ms)

    userCount = Patient.objects.all().count()
    patientID = str("CLNGN-"+str(int(math.floor(unix_time_millis(rn)))) + microtime()[2:6] + str((userCount + 1)))
    
    return Response(patientID)


    
    
    # logger.info("Course Details API Called")
    # url = urlparse(request.META['HTTP_REFERER'])
    # course_id = str(url.path.split("/")[2])
    # course_details = SetCoursePrice.objects.filter(course_id = course_id).first()
    # if course_details:
    #     course_price = course_details.price
    # else:
    #     course_price = "Free"
    # response_data = {}
    # response_data['course_price'] = str(course_price)
    # response_data['course_currency'] = str(course_details.currency)
    # return HttpResponse(json.dumps(response_data), content_type="application/json")


