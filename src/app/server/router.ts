import { randomUUID } from 'node:crypto';
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  dataCriacao: number;
};

const memoria = globalThis as typeof globalThis & {
  tarefasDoGerenciador?: Tarefa[];
};
const tarefas = (memoria.tarefasDoGerenciador ??=[]);
const t = initTRPC.create();

const dadosTarefa = z.object({
  titulo: z.string().trim().min(1, 'Informe o título da tarefa.'),
  descricao: z.string().trim().optional(),
});

const porId = z.object({
    id: z.uuid('ID de tarefa inválida.'),
})

function buscarIndice(id: string){
    const indice = tarefas.findIndex((tarefa) => tarefa.id === id);
    if(indice === -1){
        throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tarefa não encontrada.'
        })
    }
    return indice;
}

export const appRouter = t.router({
  listar: t.procedure.query(() => tarefas),
  obter: t.procedure.input(porId).query(({ input }) => {
    return tarefas[buscarIndice(input.id)];
  }),
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
  atualizar: t.procedure.input(dadosTarefa.extend(porId.shape)).mutation(({ input }) => {
    const indice = buscarIndice(input.id);
    const tarefa = {
        ...tarefas[indice],
        titulo: input.titulo, 
        descricao: input.descricao,
    };
    tarefas[indice] = tarefa;
    return tarefa;
  }),
  deletar: t.procedure.input(porId).mutation(({ input }) => {
    const indice = buscarIndice(input.id);
    tarefas.splice(indice, 1);
    return { id: input.id };
  })
});

export type AppRouter = typeof appRouter;
export const chamarTarefas = appRouter.createCaller({});