from django.urls import path
from django.views.generic import RedirectView
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)

from .views import PessoaDetailView, PessoaListCreateView

#  Swagger e Redoc
urlpatterns = [
    path('', RedirectView.as_view(url='schema/swagger/')),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Urls de pessoas
urlpatterns = [
    path('pessoas/', PessoaListCreateView.as_view(), name='pessoas-list'),
    path('pessoas/<int:id>/', PessoaDetailView.as_view(), name='pessoa-detail'),
]