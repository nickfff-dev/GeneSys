from django.conf.urls import url, include
from django.urls import path, re_path
from . import views
urlpatterns = [
    path('', views.index),
    re_path(r'^patients', views.index),

    # re_path(r'^', views.index, name="homePage"),
    # re_path(r'^(?:.*)/?$', views.index),
    # path('/patients', views.index),
    
    # path('patients/', views.index),
    # path('dashboard/', views.index),
    # url(r'^(?:.*)?/$', views.index)
]