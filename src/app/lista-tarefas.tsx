'use client';

import Link from 'next/link';
import { createTRPCClient, httpLink, TRPCClientError } from '@trpc/client';
import type { inferRouterOutputs } from '@trpc/server';
import { useRouter } from 'next/navigation';
import type { AppRouter } from '@/app/server/router';
import { useEffect, useRef, useState } from 'react';

type Tarefa = inferRouterOutputs<AppRouter>['listar'][number];

const tamanhoLote = 10;

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
  const [limite, setLimite] = useState(tamanhoLote);
  const marcador = useRef<HTMLDivElement>(null);

  const visiveis = tarefas.filter((tarefa) => !removidas.includes(tarefa.id));
  const temMais = visiveis.length > limite;

  useEffect(() => {
    const elemento = marcador.current;

    if (!temMais || !elemento || !('IntersectionObserver' in window)) {
      return;
    }

    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada.isIntersecting) {
        observer.disconnect();
        setLimite((atual) => atual + tamanhoLote);
      }
    });

    observer.observe(elemento);
    return () => observer.disconnect();
  }, [temMais, limite]);

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
          {visiveis.slice(0, limite).map((tarefa) => (
            <li key={tarefa.id}>
              <h2>{tarefa.titulo}</h2>
              {tarefa.descricao && <p>{tarefa.descricao}</p>}
              <time dateTime={new Date(tarefa.dataCriacao).toISOString()}>
                Criada em {formatoData.format(tarefa.dataCriacao)}
              </time>
              {' '}
              <Link href={`/tarefas/${tarefa.id}/editar`}>Editar</Link>
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
      {temMais && (
        <div ref={marcador}>
          <button
            type="button"
            onClick={() => setLimite((atual) => atual + tamanhoLote)}
          >
            Mostrar mais tarefas
          </button>
        </div>
      )}
    </>
  );
}
