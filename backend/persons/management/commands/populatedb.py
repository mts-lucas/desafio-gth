from django.core.management.base import BaseCommand
from django.utils import timezone
from random import choice, uniform
from persons.models import Pessoa
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Popula o banco de dados com 10 pessoas fictícias'

    def handle(self, *args, **options):

        nomes_masculinos = [
            'João Silva', 'Pedro Santos', 'Carlos Oliveira',
            'Lucas Pereira', 'Marcos Souza'
        ]
        
        nomes_femininos = [
            'Maria Oliveira', 'Ana Santos', 'Juliana Costa',
            'Fernanda Pereira', 'Patrícia Souza'
        ]
        

        for i in range(1, 11):
            if i % 2 == 0:
                sexo = 'F'
                nome = choice(nomes_femininos)
            else:
                sexo = 'M'
                nome = choice(nomes_masculinos)
            
            anos = random.randint(18, 70)
            dias = random.randint(0, 365)
            data_nasc = timezone.now().date() - timedelta(days=anos*365 + dias)
            

            cpf = ''.join([str(random.randint(0, 9)) for _ in range(11)])
            
            if sexo == 'M':
                altura = round(uniform(1.60, 1.90), 2)
                peso = round(uniform(60.0, 90.0), 2)
            else:
                altura = round(uniform(1.50, 1.80), 2)
                peso = round(uniform(50.0, 80.0), 2)
            
            Pessoa.objects.create(
                nome=nome,
                data_nac=data_nasc,
                cpf=cpf,
                sexo=sexo,
                altura=altura,
                peso=peso
            )
            
            self.stdout.write(self.style.SUCCESS(f'Pessoa {i} criada: {nome}'))
        
        self.stdout.write(self.style.SUCCESS('Banco de dados populado com sucesso!'))