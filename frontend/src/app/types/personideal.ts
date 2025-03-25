export default interface PessoaPesoIdeal {
    id?: number; 
    nome: string;
    data_nac: string;
    cpf: string;
    sexo: 'M' | 'F';
    altura: number | string;
    peso: number | string; 
    peso_ideal: number | string; 
  }