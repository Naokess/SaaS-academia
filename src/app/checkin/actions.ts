"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export type CheckinState = { error: string | null };

export async function checkinAluno(
  _prevState: CheckinState,
  formData: FormData
): Promise<CheckinState> {
  const busca = String(formData.get("busca") ?? "").trim();
  if (!busca) return { error: "Informe seu e-mail ou documento." };

  // Web app do aluno: busca global (demo) — identifica pelo e-mail ou documento
  const member = await prisma.member.findFirst({
    where: {
      OR: [
        { email: { equals: busca, mode: "insensitive" } },
        { document: busca },
      ],
    },
    include: {
      memberships: {
        where: { status: "active" },
        include: { plan: true },
        orderBy: { endDate: "desc" },
        take: 1,
      },
      tenant: { select: { name: true } },
    },
  });

  if (!member) {
    return {
      error: "Aluno não encontrado. Confira o e-mail/documento ou fale com a recepção.",
    };
  }

  const assinatura = member.memberships[0];
  if (!assinatura) {
    return {
      error: `${member.name}, você não tem uma assinatura ativa. Procure a recepção.`,
    };
  }

  // Registra o check-in
  await prisma.checkIn.create({
    data: { tenantId: member.tenantId, memberId: member.id },
  });

  const plano = assinatura.plan?.name ?? "plano";
  redirect(
    `/checkin/confirmado?nome=${encodeURIComponent(member.name)}&plano=${encodeURIComponent(
      plano
    )}&academia=${encodeURIComponent(member.tenant.name)}`
  );
}