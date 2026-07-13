import {z} from 'zod';

export const userSchema = z.object({
    name: z.string({message: 'O nome é obrigatório'}).min(5, "nome muito curto"),
    email: z.string({message: 'O email é obrigatório'}).email("email inválido"),
    password: z.string({message:  'A senha é obrigatória'}).min(6, "senha muito curta"),
    confirmPassword: z.string({message: 'A confirmação de senha é obrigatória'}).min(6, "senha muito curta"),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

export type UserSchema = z.infer<typeof userSchema>;