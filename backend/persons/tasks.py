from .models import Pessoa
from django.http import Http404

class Task:
    @staticmethod
    def create(data):
        pessoa = Pessoa.objects.create(**data)
        return pessoa
    
    @staticmethod
    def retrieve_one(id):
        try:
            pessoa = Pessoa.objects.get(pk=id)
        except Pessoa.DoesNotExist:
            raise Http404
        return pessoa
    
    def retrieve_all(filters):
        if filters:
            pessoas = Pessoa.objects.filter(**filters)
        else:
            pessoas = Pessoa.objects.all()

        return pessoas


    @staticmethod
    def update(pessoa, pessoa_data):
        for field, value in pessoa_data.items():
            setattr(pessoa, field, value)
        pessoa.save()
        return pessoa

    @staticmethod
    def delete(pessoa):
        pessoa_id = pessoa.id
        pessoa.delete()
        return pessoa_id

    

