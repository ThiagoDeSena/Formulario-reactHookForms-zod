import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material"
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
    })

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
                        />
                    )} />

                    <Controller control={control} name="email" render={({ field, fieldState }) => (
                        <TextField
                            label="Email"
                            placeholder="Digite seu email"
                            autoCapitalize="none"
                            type="email"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                        />
                    )} />

                    <Controller control={control} name="password" render={({ field, fieldState }) => (
                        <TextField
                            label="Senha"
                            placeholder="Digite sua senha"
                            autoCapitalize="none"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
                        />
                    )} />

                    <Controller control={control} name="confirmPassword" render={({ field, fieldState }) => (
                        <TextField
                            label="Confirmar Senha"
                            placeholder="Digite sua senha novamente"
                            autoCapitalize="none"
                            type="password"
                            value={field.value}
                            onChange={field.onChange}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{ mt: 2 }}
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
    )
};