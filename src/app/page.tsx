import { chamarTarefas } from '@/app/server/router';
import ListaTarefas from './lista-tarefas';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const tarefas = await chamarTarefas.listar();

  return (
    <main>
      <h1>Minhas tarefas</h1>
      <ListaTarefas tarefas={tarefas} />
    </main>
  );
}