import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { NovoAlunoForm } from "./novo-aluno-form";

export const dynamic = "force-dynamic";

export default async function NovoAlunoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;
  const planos = await prisma.plan.findMany({ where: { tenantId, active: true } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Novo aluno</h1>
        <p className="text-sm text-zinc-500">
          Cadastre um novo aluno e opcionalmente associe a um plano.
        </p>
      </div>
      <NovoAlunoForm planos={planos} />
    </div>
  );
}
