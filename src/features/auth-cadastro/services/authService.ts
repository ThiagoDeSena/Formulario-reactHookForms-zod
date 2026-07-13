import type { UserSchema } from "../schemas/userSchema";

export const authService = {
    register: async (data: UserSchema) => {
        console.log('Formulário enviado:', data);
        window.alert(`Formulário enviado com sucesso! \nNome: ${data.name}\nEmail: ${data.email}\nSenha: ${data.password}`);
    }
}