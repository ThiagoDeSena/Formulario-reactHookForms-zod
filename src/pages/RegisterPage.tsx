import { UserForm } from "../features/auth-cadastro/components/UserForm";
import type { UserSchema } from "../features/auth-cadastro/schemas/userSchema";
import { authService } from "../features/auth-cadastro/services/authService";

export function RegisterPage() {
    const handleRegisterSubmit = (data: UserSchema) => {
        authService.register(data);
    };

    return (
        <main style={{minHeight:"100vh", display:'flex',alignItems:"center"}}>
            <UserForm onSubmit={handleRegisterSubmit}/>
        </main>
    )
}