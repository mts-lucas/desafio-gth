export default interface Pessoa {
    id?: number; 
    nome: string;
    data_nac: string;
    cpf: string;
    sexo: 'M' | 'F';
    altura: number | string;
    peso: number | string; 
  }
