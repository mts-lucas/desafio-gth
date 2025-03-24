import django_filters
from .models import Pessoa

class PessoaFilter(django_filters.FilterSet):
    nome = django_filters.CharFilter(lookup_expr='icontains')
    idade = django_filters.NumberFilter()

    class Meta:
        model = Pessoa
        fields = ['nome', 'idade']