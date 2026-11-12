import { chamarTarefas } from '@/app/server/router';
import ListaTarefas from './lista-tarefas';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tarefas = await chamarTarefas.listar();

  return (
    <main>
      <h1>Minhas tarefas</h1>
      <Link href="/tarefas/nova">Nova tarefa</Link>
      <ListaTarefas tarefas={tarefas} />
    </main>
  );
}