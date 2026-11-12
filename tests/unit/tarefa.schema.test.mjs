import assert from 'node:assert';
import { dadosTarefa } from '../../src/app/server/tarefa.schema.ts';
import { test } from 'node:test';

test('rejeita um título vazio', () => {
    const resultado = dadosTarefa.safeParse({
        titulo: ''
    })

    assert.equal(resultado.success, false);
})

test('rejeita um título com apenas espaços', () => {
    const resultado = dadosTarefa.safeParse({
        titulo: '   '
    })

    assert.equal(resultado.success, false);
})

test('aceita uma tarefa sem descrição e remove espaços do título', () => {
  const tarefa = dadosTarefa.parse({ titulo: '  Organizar livros  ' });

  assert.deepEqual(tarefa, { titulo: 'Organizar livros' });
});
