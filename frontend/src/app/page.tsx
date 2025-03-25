'use client';

import { useState, useEffect } from 'react';
import api from "@/app/services/api";
import type Pessoa from "@/app/types/person";
import ModalEdicao from "@/app/components/ModalEdicao";
import Head from 'next/head';
import ModalCriarPessoa from "@/app/components/ModalCriarPessoa";
import ModalPesoIdeal from '@/app/components/ModalPesoIdeal';

export default function Home() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [pessoaEditando, setPessoaEditando] = useState<Pessoa | null>(null);
  const [mostrarModalCriar, setMostrarModalCriar] = useState(false);
  const [mostrarModalPesoIdeal, setMostrarModalPesoIdeal] = useState(false);
  const [pessoaParaCalculo, setPessoaParaCalculo] = useState<Pessoa | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const listarTodas = async () => {
    try {
      setCarregando(true);
      setErro('');
      const response = await api.get('/pessoas/');
      setPessoas(response.data);
    } catch (error) {
      setErro('Erro ao carregar pessoas');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const handlePessoaCriada = (novaPessoa: Pessoa) => {
    setPessoas([...pessoas, novaPessoa]);
    setMostrarModalCriar(false);
  };

  const pesquisarPorNome = async () => {
    if (!termoPesquisa.trim()) return;
    
    try {
      setCarregando(true);
      setErro('');
      const response = await api.get(`/pessoas/?nome=${termoPesquisa}`);
      setPessoas(response.data);
    } catch (error) {
      setErro('Erro ao pesquisar pessoas');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const deletarPessoa = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta pessoa?')) return;
    
    try {
      await api.delete(`/pessoas/${id}/`);
      setPessoas(pessoas.filter(p => p.id !== id));
    } catch (error) {
      setErro('Erro ao excluir pessoa');
      console.error(error);
    }
  };

  const handlePessoaAtualizada = (pessoaAtualizada: Pessoa) => {
    setPessoas(pessoas.map(p => p.id === pessoaAtualizada.id ? pessoaAtualizada : p));
    setPessoaEditando(null);
  };

  useEffect(() => {
    listarTodas();
  }, []);

  return (
    <div className="min-h-screen bg-black py-8">
      <Head>
        <title>Gestão de Pessoas</title>
        <meta name="description" content="Sistema de gestão de pessoas" />
      </Head>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Gestão de Pessoas</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                className="w-full p-3 border rounded-lg pl-10"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && pesquisarPorNome()}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={pesquisarPorNome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Pesquisar
          </button>
          <button
            onClick={listarTodas}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-3 rounded-lg transition"
          >
            Listar Todas
          </button>
          <button
          onClick={() => setMostrarModalCriar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
        >
          Criar Novo
        </button>
        </div>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}
        {carregando && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pessoas.map((pessoa) => (
            <div key={pessoa.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-blue-950">{pessoa.nome}</h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">CPF:</span> {pessoa.cpf}</p>
                  <p><span className="font-medium">Sexo:</span> {pessoa.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
                  <p><span className="font-medium">Data Nasc.:</span> {new Date(pessoa.data_nac).toLocaleDateString()}</p>
                  <p><span className="font-medium">Altura:</span> {pessoa.altura}m</p>
                  <p><span className="font-medium">Peso:</span> {pessoa.peso}kg</p>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setPessoaParaCalculo(pessoa);
                      setMostrarModalPesoIdeal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
                  >
                    Peso Ideal
                  </button>
                  <button
                    onClick={() => setPessoaEditando(pessoa)}
                    className="bg-blue-600 hover:bg-blue-900 text-white px-4 py-2 rounded transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => pessoa.id && deletarPessoa(pessoa.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!carregando && pessoas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma pessoa cadastrada encontrada
          </div>
        )}
      </div>


      {mostrarModalCriar && (
        <ModalCriarPessoa
          onClose={() => setMostrarModalCriar(false)}
          onPessoaCriada={handlePessoaCriada}
        />
      )}

      {pessoaEditando && (
        <ModalEdicao
          pessoa={pessoaEditando}
          onClose={() => setPessoaEditando(null)}
          onSave={handlePessoaAtualizada}
        />
      )}

      {mostrarModalPesoIdeal && pessoaParaCalculo && (
        <ModalPesoIdeal
          pessoa={pessoaParaCalculo}
          onClose={() => {
            setMostrarModalPesoIdeal(false);
            setPessoaParaCalculo(null);
          }}
        />
      )}
    </div>
    
  );
}