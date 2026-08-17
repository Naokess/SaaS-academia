"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createAluno } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Salvar aluno"}
    </Button>
  );
}

type Plano = { id: string; name: string; priceCents: number };

export function NovoAlunoForm({ planos }: { planos: Plano[] }) {
  const [state, formAction] = useActionState(createAluno, {
    error: null as string | null,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do aluno</CardTitle>
        <CardDescription>
          Preencha as informações do novo aluno.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input id="name" name="name" placeholder="Maria da Silva" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="maria@email.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" name="phone" placeholder="(11) 99999-0000" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="document">CPF</Label>
              <Input id="document" name="document" placeholder="000.000.000-00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Nascimento</Label>
              <Input id="birthDate" name="birthDate" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="planId">Plano (opcional)</Label>
            <select
              id="planId"
              name="planId"
              className="w-full rounded-md border border-muted bg-white px-3 py-2 text-sm text-foreground"
            >
              <option value="">Sem plano</option>
              {planos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — R$ {(p.priceCents / 100).toFixed(2).replace(".", ",")}
                </option>
              ))}
            </select>
          </div>
          {state?.error && (
            <p className="text-sm font-medium text-red-600">{state.error}</p>
          )}
          <div className="flex gap-2">
            <SubmitButton />
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
