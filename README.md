# Gerenciador de tarefas

Aplicação do desafio prático feita com Next.js 15, React, TypeScript, tRPC e Zod.

## Como executar

Requer Node.js 22 ou superior e npm.

```sh
npm ci
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para testar o build de produção:

```sh
npm run build
npm start
```

## Como funciona

- A página inicial usa SSR para carregar as tarefas a cada requisição.
- A API tRPC permite listar, consultar, criar, editar e excluir tarefas.
- O formulário valida o título, e o backend valida os dados recebidos com Zod.
- A interface mostra feedback ao salvar ou excluir. A lista exibe até 10 tarefas inicialmente e revela mais ao rolar ou clicar em **Mostrar mais tarefas**.
- As tarefas ficam na memória do processo Node.js e são apagadas quando o servidor reinicia. Use dados fictícios nos testes.

## Testes

```sh
npm test
```

Os testes verificam a validação do título com Zod e o fluxo de criação, atualização, exclusão e consulta pelo roteador tRPC. Eles rodam com o servidor Next.js desligado.

## Vídeo de apresentação

No vídeo, demonstro como criar, listar, editar e excluir tarefas e explico as escolhas técnicas do projeto, incluindo SSR com Next.js 15, a API tRPC e o armazenamento em memória.

[Assista à apresentação do desafio técnico da Artefact no YouTube](https://youtu.be/NfaVnGgz7Co)
