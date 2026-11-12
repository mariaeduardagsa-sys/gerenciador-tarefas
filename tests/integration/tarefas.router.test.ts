import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TRPCError } from '@trpc/server';
import { appRouter } from '../../src/app/server/router';

test('atualiza e exclui uma tarefa criada pelo roteador', async (contexto) => {
  const caller = appRouter.createCaller({});
  const criada = await caller.criar({ titulo: 'Organizar livros' });
  let excluida = false;

  contexto.after(async () => {
    if (!excluida) {
      await caller.deletar({ id: criada.id });
    }
  });

  const atualizada = await caller.atualizar({
    id: criada.id,
    titulo: 'Organizar livros por categoria',
  });

  assert.equal(atualizada.titulo, 'Organizar livros por categoria');
  assert.equal(atualizada.id, criada.id);
  assert.equal(atualizada.dataCriacao, criada.dataCriacao);

  const resultado = await caller.deletar({ id: criada.id });
  excluida = true;
  assert.equal(resultado.id, criada.id);

  await assert.rejects(
    () => caller.obter({ id: criada.id }),
    (erro: unknown) => erro instanceof TRPCError && erro.code === 'NOT_FOUND',
  );
});