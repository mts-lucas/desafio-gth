import { useState, useEffect } from 'react';
import api from "@/app/services/api";
import type Pessoa from "@/app/types/person";


interface ModalEdicaoProps {
  pessoa: Pessoa;
  onClose: () => void;
  onSave: (pessoa: Pessoa) => void;
}

export default function ModalEdicao({ pessoa, onClose, onSave }: ModalEdicaoProps) {
  const [formData, setFormData] = useState<Pessoa>(pessoa);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    setFormData(pessoa);
  }, [pessoa]);

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
      const response = await api.patch(`/pessoas/${pessoa.id}/`, formData);
      onSave(response.data);
    } catch (error) {
      setErro('Erro ao atualizar pessoa');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const formatarDataParaInput = (data: Date | string) => {
    if (typeof data === 'string') {
      return data.split('T')[0];
    }
    return data.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-950">Editar Pessoa</h2>
          
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-gray-700 mb-1">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="sexo" className="block text-gray-700 mb-1">Sexo</label>
                <select
                  id="sexo"
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
                <label htmlFor="data_nac" className="block text-gray-700 mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  id="data_nac"
                  name="data_nac"
                  value={formatarDataParaInput(formData.data_nac)}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="altura" className="block text-gray-700 mb-1">Altura (m)</label>
                <input
                  type="number"
                  id="altura"
                  name="altura"
                  step="0.01"
                  value={formData.altura}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="peso" className="block text-gray-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  id="peso"
                  name="peso"
                  step="0.1"
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
                className="px-4 py-2 border  bg-red-500 rounded hover:bg-red-700 transition"
                disabled={carregando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-700 transition"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}