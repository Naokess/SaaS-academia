import { CheckCircle2, Dumbbell, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Check-in confirmado | FitFlow",
};

export default async function ConfirmadoPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; plano?: string; academia?: string }>;
}) {
  const params = await searchParams;
  const nome = params.nome ?? "Aluno";
  const plano = params.plano ?? "—";
  const academia = params.academia ?? "Sua academia";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>

        <span className="mb-2 inline-block rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
          Check-in realizado
        </span>

        <h1 className="text-3xl font-bold text-background">{nome}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Entrada confirmada em <span className="font-medium text-background">{academia}</span>
        </p>

        <div className="mt-8 mx-auto max-w-xs rounded-2xl border border-white/10 bg-card p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Plano ativo
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {plano}
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Aproveite o treino! 💪
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/checkin">
            <Button variant="outline" className="gap-2">
              <Dumbbell className="h-4 w-4" />
              Novo check-in
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}