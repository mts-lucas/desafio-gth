from rest_framework import serializers
from .models import Pessoa

class PessoaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pessoa
        fields = '__all__'

class PessoaComPesoIdealSerializer(PessoaSerializer):
    peso_ideal = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    
    class Meta(PessoaSerializer.Meta):
        fields = ['id', 'nome', 'altura', 'sexo', 'peso_ideal']

