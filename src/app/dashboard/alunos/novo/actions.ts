"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function createAluno(
  _prevState: { error: string | null },
  formData: FormData
) {
  const session = await auth();
  if (!session?.user) return { error: "Não autenticado." };

  const tenantId = session.user.tenantId;
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const document = (formData.get("document") as string)?.trim() || null;
  const planId = formData.get("planId") as string;
  const birthDateRaw = formData.get("birthDate") as string;

  if (!name) return { error: "O nome é obrigatório." };

  const qrSecret = crypto.randomUUID();

  try {
    await prisma.member.create({
      data: {
        tenantId,
        name,
        email,
        phone,
        document,
        qrSecret,
        birthDate: birthDateRaw ? new Date(birthDateRaw) : null,
        ...(planId
          ? {
              memberships: {
                create: {
                  tenantId,
                  planId,
                  status: "active",
                  startDate: new Date(),
                  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                },
              },
            }
          : {}),
      },
    });
  } catch {
    return { error: "Não foi possível cadastrar o aluno. Verifique os dados." };
  }

  redirect("/dashboard/alunos");
}
