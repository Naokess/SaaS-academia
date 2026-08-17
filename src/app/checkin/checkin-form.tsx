"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScanLine } from "lucide-react";
import { checkinAluno } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full gap-2" disabled={pending}>
      <ScanLine className="h-4 w-4" />
      {pending ? "Validando..." : "Validar meu check-in"}
    </Button>
  );
}

export function CheckinForm() {
  const [state, formAction] = useActionState(checkinAluno, { error: null });

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-2xl border border-white/10 bg-card p-6 shadow-2xl"
    >
      <div className="space-y-2">
        <Label htmlFor="busca">E-mail ou documento</Label>
        <Input
          id="busca"
          name="busca"
          placeholder="voce@email.com ou CPF"
          required
          autoFocus
        />
      </div>
      {state?.error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-400">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}