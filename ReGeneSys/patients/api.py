import time
import datetime
import math
import re

from patients.models import Patient
from rest_framework import generics, viewsets, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q

from django.contrib.postgres.search import SearchVector, SearchQuery

from .serializers import PatientSerializer, PatientContactClinicalSerializer


def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):
    ''' Splits the query string in invidual keywords, getting rid of unecessary spaces
        and grouping quoted words together.
        Example:

        >>> normalize_query('  some random  words "with   quotes  " and   spaces')
        ['some', 'random', 'words', 'with quotes', 'and', 'spaces']

    '''
    return [
        normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)
    ]


def get_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.

    '''
    query = None  # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None  # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})
            if or_query is None:
                or_query = q
            else:
                or_query = or_query | q
        if query is None:
            query = or_query
        else:
            query = query & or_query
    return query


#Patient Viewset
class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientContactClinicalSerializer

    queryset = Patient.objects.filter(clinical__status="active")

    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):

        instance = self.get_object()
        serializer = PatientContactClinicalSerializer(instance=instance,
                                                      data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.update(instance, request.data)
        print(serializer.data)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        print(request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        patient = serializer.save(validated_data=request.data,
                                  requester=request.user)
        return Response(
            PatientContactClinicalSerializer(
                patient, context=self.get_serializer_context()).data, )

    # def search(request):
    #     query_string = ''
    #     found_entries = None
    #     if ('q' in request.GET) and request.GET['q'].strip():
    #         query_string = request.GET['q']

    #         entry_query = get_query(query_string, ['title', 'body',])

    #         found_entries = Entry.objects.filter(entry_query).order_by('-pub_date')

    #     return render_to_response('search/search_results.html',
    #                         { 'query_string': query_string, 'found_entries': found_entries },
    #                         context_instance=RequestContext(request))

    @action(detail=False, methods=['get'])
    def search_patients(self, request, pk=None):
        query_string = ''
        found_entries = None
        if ('query' in request.GET) and request.GET['query'].strip():
            query_string = request.GET['query']

            entry_query = get_query(query_string, [
                'birth_date', 'birth_place', 'brgy_add', 'city_add',
                'first_name', 'last_name', 'middle_name', 'patient_id',
                'region', 'sex', 'street_add', 'suffix',
                'clinical__patient_type'
            ])

            found_entries = Patient.objects.filter(entry_query).order_by()

        print(found_entries)

        return Response(
            PatientContactClinicalSerializer(found_entries, many=True).data)


rn = datetime.datetime.now()
epoch = datetime.datetime.utcfromtimestamp(0)


# @method_decorator(csrf_exempt)
@api_view(['GET'])
def generatePatientID(request):
    rn = datetime.datetime.now()
    epoch = datetime.datetime.utcfromtimestamp(0)

    def unix_time_millis(dt):
        return (dt - epoch).total_seconds() * 1000.0

    def microtime(get_as_float=False):
        t = time.mktime(rn.timetuple())
        if get_as_float:
            return t
        else:
            ms = rn.microsecond / 1000000.
            return '%f' % (ms)

    userCount = Patient.objects.all().count()
    patientID = str("CLNGN-" + str(int(math.floor(unix_time_millis(rn)))) +
                    microtime()[2:6] + str((userCount + 1)))

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
