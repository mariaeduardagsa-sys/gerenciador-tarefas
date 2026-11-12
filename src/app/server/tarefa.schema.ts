import { z } from 'zod';

export const dadosTarefa = z.object({
  titulo: z.string().trim().min(1, 'Informe o título da tarefa.'),
  descricao: z.string().trim().optional(),
});