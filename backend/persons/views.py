from django.http import Http404
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (OpenApiParameter,
                                   extend_schema)
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PessoaComPesoIdealSerializer, PessoaSerializer
from .services import Service


class PessoaListCreateView(APIView):


    @extend_schema(
        description="Lista todas as pessoas e aplica algum filtro caso pedido",
        parameters=[
            OpenApiParameter(name='nome', description='Filtrar por nome', required=False, type=str),
        ],
        responses={
            200: PessoaSerializer(many=True),
            400: OpenApiTypes.OBJECT
        }
    )
    def get(self, request):
        """
        Lista todas as pessoas e aplica algum filtro caso pedido
        """
        nome_filtro = request.query_params.get('nome', None)
        pessoas_data = Service.search(nome_filtro)
        return Response(pessoas_data, status=status.HTTP_200_OK)
    
    @extend_schema(
        description="Cria uma nova pessoa na base de dados",
        request=PessoaSerializer,
        responses={
            201: PessoaSerializer,
            400: OpenApiTypes.OBJECT
        },
    )
    def post(self, request):
        """
        Cria uma nova pessoa na base de dados
        """
        pessoa = Service.create(request.data)
        if 'error' in pessoa:
            return Response(pessoa, status=status.HTTP_400_BAD_REQUEST)
        return Response(pessoa, status=status.HTTP_201_CREATED)



class PessoaDetailView(APIView):

    @extend_schema(
        description="Busca e retorna uma pessoa específica pelo ID",
        responses={
            200: PessoaSerializer,
            404: OpenApiTypes.OBJECT
        }
    )
    def get(self, request, id):
        """
        Busca e retorna uma instancia unica da pessoa pelo id
        """
        try:
            pessoa_data = Service.get_by_id(id)
            return Response(pessoa_data, status=status.HTTP_200_OK)
        except Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        description="Edita os dados de uma instancia unica da pessoa pelo id",
        request=PessoaSerializer,
        responses={
            200: PessoaSerializer,
            400: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT
        }
    )
    def patch(self, request, id):
        """
        Edita os dados de uma instancia unica da pessoa pelo id
        """
        result = Service.update(id, request.data)
        if isinstance(result, dict) and 'error' in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        elif result == Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(result, status=status.HTTP_200_OK)


    @extend_schema(
        description="Deleta a instancia de pessoa de acordo com o ID informado",
        responses={
            200: OpenApiTypes.OBJECT,
            404: OpenApiTypes.OBJECT
        }
    )
    def delete(self, request, id):
        """
        Deleta a instancia de pessoa de acordo com o ID informado
        """
        result = Service.exclude(id)
        if result == Http404:
            return Response(
                {"error": "Pessoa não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(result, status=status.HTTP_200_OK)
    

class CalcularPesoIdealView(APIView):

    @extend_schema(
        description="Calcula o peso ideal para uma pessoa baseado em sua altura e sexo",
        responses={
            200: PessoaComPesoIdealSerializer,
            404: OpenApiTypes.OBJECT,
            500: OpenApiTypes.OBJECT
        },
    )
    def get(self, request, id):
        try:
            result = Service.calcular_peso_ideal(id)
            if 'error' in result:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            return Response(result)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)