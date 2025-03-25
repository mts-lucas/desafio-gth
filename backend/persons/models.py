from django.db import models

# Create your models here.

class Pessoa(models.Model):

    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Feminino'),
    ]

    nome = models.CharField(max_length=256, null=False, blank=False)
    data_nac = models.DateField()
    cpf = models.CharField(max_length=11, unique=True, null=False, blank=False)
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, null=False, blank=False)
    altura = models.DecimalField(max_digits=3, decimal_places=2, null=False, blank=False)
    peso = models.DecimalField(max_digits=5, decimal_places=2, null=False, blank=False)

    class Meta:
        verbose_name = 'Pessoa'
        verbose_name_plural = 'Pessoas'
        db_table = "pessoa"
        ordering = ["-id"]

    def __str__(self) -> str:
        return f"({self.nome}) - CPF: {self.cpf}"    
