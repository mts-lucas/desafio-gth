export default interface Pessoa {
    id?: number; 
    nome: string;
    data_nac: Date | string;
    cpf: string;
    sexo: 'M' | 'F';
    altura: number | string;
    peso: number | string; 
  }
