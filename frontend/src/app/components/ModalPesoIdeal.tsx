// components/ModalPesoIdeal.tsx
'use client';

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import type PessoaPesoIdeal from '@/app/types/personideal';
import type Pessoa from '@/app/types/person';

interface ModalPesoIdealProps {
  pessoa: Pessoa;
  onClose: () => void;
}

export default function ModalPesoIdeal({ pessoa, onClose }: ModalPesoIdealProps) {
  const [pesoIdealData, setPesoIdealData] = useState<PessoaPesoIdeal | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const calcularPesoIdeal = async () => {
      if (!pessoa.id) return;
      
      try {
        setCarregando(true);
        setErro('');
        const response = await api.get(`/pessoas/${pessoa.id}/calcular/`);
        setPesoIdealData(response.data);
      } catch (error) {
        setErro('Erro ao calcular peso ideal');
        console.error(error);
      } finally {
        setCarregando(false);
      }
    };

    calcularPesoIdeal();
  }, [pessoa.id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-950">Peso Ideal</h2>
          
          {carregando && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {erro}
            </div>
          )}

          {pesoIdealData && (
            <div className="space-y-4">
              <p className='text-gray-600'><span className="font-medium text-blue-950">Nome:</span > {pesoIdealData.nome}</p>
              <p className='text-gray-600'><span className="font-medium text-blue-950">Sexo:</span> {pesoIdealData.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
              <p className='text-gray-600'><span className="font-medium text-blue-950">Altura:</span> {pesoIdealData.altura}m</p>
              <p className="text-lg font-semibold text-gray-600">
                <span className="font-medium text-blue-950">Peso Ideal:</span> {typeof pesoIdealData.peso_ideal === 'number' 
                  ? pesoIdealData.peso_ideal.toFixed(2) 
                  : pesoIdealData.peso_ideal}kg
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}