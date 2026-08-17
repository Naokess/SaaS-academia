import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenantSlug = "academia-demo";

  // Re-executável: apaga dados do tenant demo antes de recriar
  const existing = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
  if (existing) {
    await prisma.payment.deleteMany({ where: { tenantId: existing.id } });
    await prisma.checkIn.deleteMany({ where: { tenantId: existing.id } });
    await prisma.membership.deleteMany({ where: { tenantId: existing.id } });
    await prisma.member.deleteMany({ where: { tenantId: existing.id } });
    await prisma.plan.deleteMany({ where: { tenantId: existing.id } });
    await prisma.user.deleteMany({ where: { tenantId: existing.id } });
    await prisma.tenant.delete({ where: { id: existing.id } });
  }

  const tenant = await prisma.tenant.create({
    data: {
      name: "Academia Demo",
      slug: tenantSlug,
      cnpj: "00.000.000/0001-00",
      users: {
        create: {
          name: "Administrador",
          email: "admin@demo.com",
          passwordHash: await bcrypt.hash("admin123", 10),
          role: "owner",
        },
      },
      plans: {
        create: [
          {
            name: "Mensal",
            priceCents: 14900,
            billingCycle: "monthly",
            durationMonths: 1,
            features: ["Acesso Total", "Sem Fidelidade"],
          },
          {
            name: "Trimestral",
            priceCents: 12900,
            billingCycle: "quarterly",
            durationMonths: 3,
            features: ["Acesso Total", "Fidelidade 3m"],
          },
          {
            name: "Pro Anual",
            priceCents: 9900,
            billingCycle: "annual",
            durationMonths: 12,
            features: ["Acesso Total", "Avaliação Inclusa", "Fidelidade 12m"],
            highlight: "Mais Popular",
          },
          {
            name: "Personal",
            priceCents: 29900,
            billingCycle: "monthly",
            durationMonths: 1,
            features: ["Tudo do Pro Anual", "2x Personal / semana"],
            highlight: "Recomendado",
          },
        ],
      },
    },
    include: { plans: true },
  });

  const baseDate = new Date();
  const members = await prisma.member.createManyAndReturn({
    data: [
      { tenantId: tenant.id, name: "João Silva", email: "joao@email.com", phone: "(11) 99999-0001", document: "111.111.111-11", qrSecret: "qr-joao-silva" },
      { tenantId: tenant.id, name: "Maria Souza", email: "maria@email.com", phone: "(11) 99999-0002", document: "222.222.222-22", qrSecret: "qr-maria-souza" },
      { tenantId: tenant.id, name: "Carlos Pereira", email: "carlos@email.com", phone: "(11) 99999-0003", document: "333.333.333-33", qrSecret: "qr-carlos-pereira" },
    ],
  });

  const mensal = tenant.plans.find((p) => p.name === "Mensal")!;
  const trimestral = tenant.plans.find((p) => p.name === "Trimestral")!;

  // 2 assinaturas ativas + 1 inadimplente (para testar bloqueio no check-in)
  const m1 = members[0];
  const m2 = members[1];
  const m3 = members[2];

  await prisma.membership.create({
    data: {
      tenantId: tenant.id,
      memberId: m1.id,
      planId: mensal.id,
      status: "active",
      startDate: baseDate,
      endDate: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.membership.create({
    data: {
      tenantId: tenant.id,
      memberId: m2.id,
      planId: trimestral.id,
      status: "active",
      startDate: baseDate,
      endDate: new Date(baseDate.getTime() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.membership.create({
    data: {
      tenantId: tenant.id,
      memberId: m3.id,
      planId: mensal.id,
      status: "overdue",
      startDate: new Date(baseDate.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: baseDate,
    },
  });

  // Alguns check-ins de hoje (frequência)
  const today = new Date();
  today.setHours(8, 30, 0, 0);
  await prisma.checkIn.createMany({
    data: [
      { tenantId: tenant.id, memberId: m1.id, createdAt: new Date(today) },
      { tenantId: tenant.id, memberId: m2.id, createdAt: new Date(today.getTime() + 45 * 60 * 1000) },
      { tenantId: tenant.id, memberId: m1.id, createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000) },
      { tenantId: tenant.id, memberId: m2.id, createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000) },
    ],
  });

  console.log("Seed concluído!");
  console.log("  Academia: Academia Demo");
  console.log("  Login:    admin@demo.com / admin123");
  console.log(`  Planos:   ${tenant.plans.map((p) => p.name).join(", ")}`);
  console.log(`  Alunos:   ${members.length} (2 ativos, 1 inadimplente)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());