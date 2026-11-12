import { TRPCError } from '@trpc/server';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { chamarTarefas } from '@/app/server/router';
import FormularioTarefa from '../../formulario-tarefa';

export const dynamic = 'force-dynamic';

export default async function EditarTarefa({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!z.uuid().safeParse(id).success){
        notFound();
    }

    try{
        const tarefa = await chamarTarefas.obter({ id });
        return <FormularioTarefa key={tarefa.id} tarefa={tarefa} />
    } catch (erro) {
        if (erro instanceof TRPCError && erro.code === 'NOT_FOUND'){
            notFound();
        }
        throw erro;
    }
}