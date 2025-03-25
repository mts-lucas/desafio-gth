import { useState } from 'react';
import api from "@/app/services/api";
import type Pessoa from "@/app/types/person";

interface ModalCriarPessoaProps {
  onClose: () => void;
  onPessoaCriada: (pessoa: Pessoa) => void;
}

export default function ModalCriarPessoa({ onClose, onPessoaCriada }: ModalCriarPessoaProps) {
  const [formData, setFormData] = useState<Omit<Pessoa, 'id'>>({
    nome: '',
    data_nac: new Date().toISOString().split('T')[0],
    cpf: '',
    sexo: 'M',
    altura: '',
    peso: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'altura' || name === 'peso' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const response = await api.post('/pessoas/', formData);
      onPessoaCriada(response.data);
      onClose();
    } catch (error) {
      setErro('Erro ao criar nova pessoa');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-950">Cadastrar Nova Pessoa</h2>
          
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  name="data_nac"
                  value={formData.data_nac}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Altura (m)</label>
                <input
                  type="number"
                  step="0.01"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded bg-red-500 hover:bg-red-700 transition"
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}