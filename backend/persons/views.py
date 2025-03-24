from django.http import Http404
from django_filters import rest_framework as filters
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import PessoaFilter
from .services import Service


class PessoaListCreateView(APIView):

    pagination_class = LimitOffsetPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PessoaFilter
    
    def get(self, request):
        """
        Lista todas as pessoas e aplica algum filtro caso pedido
        """
        pessoas_data = Service.search(request.query_params)
        return Response(pessoas_data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Cria uma nova pessoa na base de dados
        """
        pessoa = Service.create(request.data)
        if 'error' in pessoa:
            return Response(pessoa, status=status.HTTP_400_BAD_REQUEST)
        return Response(pessoa, status=status.HTTP_201_CREATED)



class PessoaDetailView(APIView):

    def get(self, request, pessoa_id):
        """
        Busca e retorna uma instancia unica da pessoa pelo id
        """
        try:
            pessoa_data = Service.get_by_id(pessoa_id)
            return Response(pessoa_data, status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pessoa_id):
        """
        Edita os dados de uma instancia unica da pessoa pelo id
        """
        result = Service.update(pessoa_id, request.data)
        if isinstance(result, dict) and 'error' in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        elif result == Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(result, status=status.HTTP_200_OK)

    def delete(self, request, pessoa_id):
        """
        Deleta a instancia de pessoa de acordo com o ID informado
        """
        result = Service.exclude(pessoa_id)
        if result == Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(result, status=status.HTTP_200_OK)