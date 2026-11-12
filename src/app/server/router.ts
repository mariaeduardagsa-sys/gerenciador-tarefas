import { randomUUID } from 'node:crypto';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

const tarefas: Tarefa[] = [];
const t = initTRPC.create();

const dadosTarefa = z.object({
  titulo: z.string().trim().min(1, 'Informe o título da tarefa.'),
  descricao: z.string().trim().optional(),
});

export const appRouter = t.router({
  listar: t.procedure.query(() => tarefas),
  criar: t.procedure.input(dadosTarefa).mutation(({ input }) => {
    const tarefa: Tarefa = {
      id: randomUUID(),
      titulo: input.titulo,
      descricao: input.descricao,
      dataCriacao: Date.now(),
    };

    tarefas.push(tarefa);
    return tarefa;
  }),
});

export type AppRouter = typeof appRouter;