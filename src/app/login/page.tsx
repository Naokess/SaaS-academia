import { Dumbbell } from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata = {
  title: "Entrar | FitFlow",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Dumbbell className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            FitFlow
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestão de alunos, planos e cobrança para sua academia
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo: admin@demo.com / admin123
        </p>
      </div>
    </div>
  );
}