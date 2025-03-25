from decimal import Decimal

from django.http import Http404

from .serializers import PessoaComPesoIdealSerializer, PessoaSerializer
from .tasks import Task


class Service:

    @staticmethod
    def search(filters = None):
        pessoas = Task.retrieve_all(filters=filters)
        serializer = PessoaSerializer(pessoas, many=True)
        return serializer.data
    
    @staticmethod
    def get_by_id(pessoa_id):
        try:
            pessoa = Task.retrieve_one(pessoa_id)
            serializer = PessoaSerializer(pessoa)
            return serializer.data
        except Http404:
            raise Http404
        
    @staticmethod
    def update(pessoa_id, data):
        try:
            pessoa = Task.retrieve_one(pessoa_id)
            serializer = PessoaSerializer(pessoa, data=data, partial=True)
            if serializer.is_valid():
                pessoa_atualizada = Task.update(pessoa, serializer.validated_data)
                novo_serializer = PessoaSerializer(instance=pessoa_atualizada)
                return novo_serializer.data
            else:
                return {'error': serializer.errors}
            
        except Http404:
            return Http404
        
    @staticmethod
    def exclude(pessoa_id):
        try:
            pessoa = Task.retrieve_one(pessoa_id)
            pessoa_deletada = Task.delete(pessoa)
            return {'message': f'Pessoa de identificador: {pessoa_deletada} excluída com sucesso'}
        except Http404:
            return Http404
        

    @staticmethod
    def create(pessoa_data):
        serializer = PessoaSerializer(data=pessoa_data)
        if serializer.is_valid():
            nova_pessoa = Task.create(pessoa_data)
            novo_serializer = PessoaSerializer(instance=nova_pessoa)
            return novo_serializer.data
        else:
            return {'error': serializer.errors}

    @staticmethod
    def calcular_peso_ideal(pessoa_id):
        try:
            pessoa = Task.retrieve_one(pessoa_id)      
            altura = pessoa.altura  # Já é Decimal
            sexo = pessoa.sexo
            
            if sexo == "M":
                peso_ideal = (Decimal('72.7') * altura) - Decimal('58')
            elif sexo == "F":
                peso_ideal = (Decimal('62.1') * altura) - Decimal('44.7')
            
            peso_ideal = round(peso_ideal, 2)
            pessoa.peso_ideal = peso_ideal

            return PessoaComPesoIdealSerializer(pessoa).data
            
        except Http404:
            return {'error': 'Pessoa não encontrada'}