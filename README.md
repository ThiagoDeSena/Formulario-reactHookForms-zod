---

# Form Integration Masterclass: React, TypeScript, RHF, Zod & Material UI

Este repositório foi desenvolvido com o objetivo de consolidar e documentar o ecossistema padrão ouro do mercado de desenvolvimento front-end para criação, validação e gerenciamento de formulários robustos, fortemente tipados e de alta performance.

A aplicação simula um fluxo real de cadastro de usuário aplicando os conceitos de **Clean Architecture** e separação de responsabilidades por módulos (features).

---

## 🛠️ Tecnologias e Papéis no Ecossistema

Para entender como essas ferramentas se conectam em uma requisição de formulário, cada uma possui uma responsabilidade muito bem definida dentro da aplicação:

| Tecnologia | Papel Principal | Responsabilidade |
| --- | --- | --- |
| **React** | Estrutura Base | Gerencia o ciclo de vida dos componentes e a renderização da interface na árvore do DOM. |
| **Material UI (MUI)** | Interface Visual | Fornece componentes de UI prontos, elegantes e acessíveis (`TextField`, `Button`, `Paper`) e cuida do estado visual de erro (remover/adicionar bordas vermelhas). |
| **Zod** | Validação de Dados | Atua como a "Fonte Única da Verdade" para as regras de negócio (tamanho mínimo de string, formato de e-mail, igualdade de senhas) e gera os tipos estritos do TypeScript automaticamente. |
| **React Hook Form (RHF)** | Motor de Performance | Gerencia o estado interno do formulário de forma *uncontrolled* (otimizando re-renders), conecta os campos visuais do MUI às regras do Zod e intercepta o envio dos dados. |

---

## 🏗️ Arquitetura e Estrutura de Pastas

O projeto foi estruturado utilizando uma abordagem baseada em **Features/Domínios** (Screaming Architecture), garantindo escalabilidade, baixo acoplamento e alta coesão:

```text
src/
├── features/               # Domínios isolados da aplicação
│   └── auth-cadastro/      # Módulo exclusivo de Cadastro/Autenticação
│       ├── components/     # Componentes visuais da feature (ex: UserForm.tsx)
│       └── schemas/        # Schemas de validação e tipos (ex: userSchema.ts)
├── pages/                  # Pontos de entrada das rotas (ex: RegisterPage.tsx)
└── App.tsx                 # Raiz da aplicação (onde os providers globais se encontram)

```

---

## 🔗 Como a Conexão Acontece? (Fluxo Técnico de Submissão)

A integração e a comunicação entre as bibliotecas seguem os seguintes passos lógicos durante o uso da aplicação:

1. **A Ponte RHF + Zod (`resolver`):** Ao inicializar o hook `useForm`, passamos o `zodResolver(userSchema)`. Isso ensina o React Hook Form a validar cada campo com base nas regras estritas definidas no Zod.
2. **A Ponte RHF + Material UI (`<Controller />`):** Componentes do Material UI como o `<TextField />` são controlados e não podem ser lidos nativamente por *refs* comuns do HTML. O `<Controller />` atua como um **adaptador**, expondo o evento `onChange` e `value` para o RHF, e o estado `fieldState.error` para alimentar as propriedades visuais de erro do MUI.
3. **Interceptação do Submit (`handleSubmit`):**
* O usuário clica no botão com `type="submit"`.
* O `handleSubmit` do RHF captura o evento de submit do HTML e aciona o Zod em segundo plano.
* **Se houver falha:** O envio é bloqueado imediatamente, o RHF injeta o erro nos campos correspondentes e o MUI exibe o texto em vermelho usando as propriedades `error` e `helperText`. Nenhuma requisição de rede ou lógica externa é disparada.


* **Se passar na validação:** O RHF empacota os dados 100% validados e tipados e os envia para a nossa função de callback (prop `onSubmit`), que repassa à página para realizar a requisição HTTP final (via Axios/Fetch).



---

## 💻 Implementação do Código

### 1. Schema de Validação e Tipagem (`src/features/auth-cadastro/schemas/userSchema.ts`)

```typescript
import { z } from 'zod';

export const userSchema = z.object({
    name: z.string({ message: 'O nome é obrigatório' }).min(5, "Nome muito curto"),
    email: z.string({ message: 'O email é obrigatório' }).email("E-mail inválido"),
    password: z.string({ message: 'A senha é obrigatória' }).min(6, "Senha muito curta"),
    confirmPassword: z.string({ message: 'A confirmação de senha é obrigatória' }).min(6, "Senha muito curta"),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type UserSchema = z.infer<typeof userSchema>;

```

### 2. Componente do Formulário (`src/features/auth-cadastro/components/UserForm.tsx`)

```tsx
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserSchema } from "../schemas/userSchema";
import { Controller, useForm } from "react-hook-form";

type UserFormProps = {
    onSubmit: (data: UserSchema) => void;
};

export function UserForm({ onSubmit }: UserFormProps) {
    const { control, handleSubmit } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Cadastro de Usuário
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                    <Controller control={control} name="name" render={({ field, fieldState }) => (
                        <TextField
                            label="Nome"
                            placeholder="Digite seu nome"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                            fullWidth
                        />
                    )} />

                    <Controller control={control} name="email" render={({ field, fieldState }) => (
                        <TextField
                            label="Email"
                            placeholder="Digite seu email"
                            type="email"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                            fullWidth
                        />
                    )} />

                    <Controller control={control} name="password" render={({ field, fieldState }) => (
                        <TextField
                            label="Senha"
                            placeholder="Digite sua senha"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                            fullWidth
                        />
                    )} />

                    <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => (
                        <TextField
                            label="Confirmar Senha"
                            placeholder="Digite sua senha novamente"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                            fullWidth
                        />
                    )} />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Cadastrar
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

```

### 3. Componente de Página (`src/pages/RegisterPage.tsx`)

```tsx
import React from "react";
import { UserForm } from "../features/auth-cadastro/components/UserForm";
import type { UserSchema } from "../features/auth-cadastro/schemas/userSchema";

export function RegisterPage() {
  const handleRegisterSubmit = (data: UserSchema) => {
    console.log('Formulário enviado e validado:', data);
    window.alert(`Formulário enviado com sucesso! \nNome: ${data.name}\nEmail: ${data.email}`);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <UserForm onSubmit={handleRegisterSubmit} />
    </main>
  );
}

```

### 4. Arquivo Raiz (`src/App.tsx`)

```tsx
import React from "react";
import "./App.css";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <>
      <RegisterPage />
    </>
  );
}

export default App;

```

---

## ⚡ Principais Benefícios Técnicos Dessa Solução

* **Performance Otimizada:** O React Hook Form trabalha de forma *uncontrolled* por baixo dos panos através de referências (`refs`). Isso evita re-renderizações desnecessárias na página inteira a cada caractere digitado pelo usuário.
* **Single Source of Truth (Fonte Única de Verdade):** Toda a regra de validação nasce em um único lugar no `userSchema` do Zod, evitando ifs e códigos espalhados no meio do HTML/JSX.
* **Tipagem Ponta a Ponta (End-to-End Typing):** Utilizando o `z.infer<typeof userSchema>`, o TypeScript herda automaticamente os tipos gerados pelo Zod, impedindo erros de tipagem entre formulário, validação e requisição HTTP.
* **Clean Architecture:** Desacoplamento completo entre a camada visual (MUI), a camada de controle de estado do formulário (RHF), a camada de validação (Zod) e a lógica de negócios da rota (`RegisterPage`).
