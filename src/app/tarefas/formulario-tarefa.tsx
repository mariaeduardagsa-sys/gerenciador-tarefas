'use client';

import { createTRPCClient, httpLink, TRPCClientError } from '@trpc/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import type { AppRouter } from '@/app/server/router';

const cliente = createTRPCClient<AppRouter>({
  links: [httpLink({ url: '/api/trpc' })],
});

type TarefaEditavel = {
  id: string;
  titulo: string;
  descricao?: string;
};

export default function FormularioTarefa({ tarefa }: { tarefa?: TarefaEditavel }) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(tarefa?.titulo ?? '');
  const [descricao, setDescricao] = useState(tarefa?.descricao ?? '');
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro('');
    setSucesso('');

    const tituloLimpo = titulo.trim();

    if (!tituloLimpo) {
      setErro('Informe o título da tarefa.');
      return;
    }

    setSalvando(true);

    try {
      const dados = {
        titulo: tituloLimpo,
        descricao: descricao.trim() || undefined,
      };

      if (tarefa) {
        await cliente.atualizar.mutate({ ...dados, id: tarefa.id });
        setSucesso('Tarefa atualizada com sucesso.');
      } else {
        await cliente.criar.mutate(dados);
        setTitulo('');
        setDescricao('');
        setSucesso('Tarefa criada com sucesso.');
      }

      router.refresh();
    } catch (falha) {
      setErro(
        falha instanceof TRPCClientError && falha.data
          ? falha.message
          : 'Não foi possível salvar a tarefa. Tente novamente.',
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main>
      <h1>{tarefa ? 'Editar tarefa' : 'Nova tarefa'}</h1>

      <form onSubmit={salvar} noValidate>
        <fieldset disabled={salvando}>
          <p>
            <label htmlFor="titulo">Título</label>
            <br />
            <input
              id="titulo"
              name="titulo"
              required
              value={titulo}
              onChange={(evento) => setTitulo(evento.target.value)}
            />
          </p>

          <p>
            <label htmlFor="descricao">Descrição (opcional)</label>
            <br />
            <textarea
              id="descricao"
              name="descricao"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
            />
          </p>

          <button type="submit">
            {salvando ? 'Salvando…' : tarefa ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </fieldset>
      </form>

      {erro && <p role="alert">{erro}</p>}
      {sucesso && <p role="status">{sucesso}</p>}
      <Link href="/">Voltar à lista</Link>
    </main>
  );
}
