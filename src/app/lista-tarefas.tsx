'use client';

import { createTRPCClient, httpLink, TRPCClientError } from '@trpc/client';
import type { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { AppRouter } from '@/app/server/router';

type Tarefa = inferRouterOutputs<AppRouter>['listar'][number];

const cliente = createTRPCClient<AppRouter>({
  links: [httpLink({ url: '/api/trpc' })],
});

const formatoData = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Fortaleza',
});

export default function ListaTarefas({ tarefas }: { tarefas: Tarefa[] }) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const [removidas, setRemovidas] = useState<string[]>([]);
  const [sucesso, setSucesso] = useState('');
  const [erro, setErro] = useState('');

  const visiveis = tarefas.filter((tarefa) => !removidas.includes(tarefa.id));

  async function excluir(id: string) {
    setExcluindo(id);
    setSucesso('');
    setErro('');

    try {
      await cliente.deletar.mutate({ id });
      setRemovidas((atuais) => [...atuais, id]);
      setSucesso('Tarefa excluída.');
      router.refresh();
    } catch (falha) {
      setErro(
        falha instanceof TRPCClientError && falha.data
          ? falha.message
          : 'Não foi possível excluir a tarefa. Tente novamente.',
      );
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <>
      {sucesso && <p role="status">{sucesso}</p>}
      {erro && <p role="alert">{erro}</p>}

      {visiveis.length === 0 ? (
        <p>Nenhuma tarefa cadastrada.</p>
      ) : (
        <ul>
          {visiveis.map((tarefa) => (
            <li key={tarefa.id}>
              <h2>{tarefa.titulo}</h2>
              {tarefa.descricao && <p>{tarefa.descricao}</p>}
              <time dateTime={new Date(tarefa.dataCriacao).toISOString()}>
                Criada em {formatoData.format(tarefa.dataCriacao)}
              </time>
              {' '}
              <button
                type="button"
                disabled={excluindo !== null}
                onClick={() => excluir(tarefa.id)}
              >
                {excluindo === tarefa.id ? 'Excluindo…' : 'Excluir'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}