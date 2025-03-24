from django.http import Http404

from .serializers import PessoaSerializer
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
            serializer = PessoaSerializer(pessoa, data=data)
            if serializer.is_valid():
                pessoa_atualizada = Task.update(pessoa, update_data)
                novo_serializer = PessoaSerializer(pessoa_atualizada)
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
            pessoa = Task.create(pessoa_data)
            return serializer.data
        else:
            return {'error': serializer.errors}

    