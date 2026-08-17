import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  CalendarCheck,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  QrCode,
  ReceiptText,
  UserPlus,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;

  const [totalAlunos, ativos, checkinsHoje, inadimplentes, receitaMes, aReceber] =
    await Promise.all([
      prisma.member.count({ where: { tenantId } }),
      prisma.member.count({ where: { tenantId, status: "active" } }),
      prisma.checkIn.count({
        where: {
          tenantId,
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.member.count({ where: { tenantId, status: "inactive" } }),
      prisma.payment.aggregate({
        where: { tenantId, status: "paid" },
        _sum: { amountCents: true },
      }),
      prisma.payment.aggregate({
        where: { tenantId, status: "pending" },
        _sum: { amountCents: true },
      }),
    ]);

  const formatBRL = (cents: number) =>
    (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const stats = [
    {
      label: "A receber",
      value: formatBRL(aReceber._sum.amountCents ?? 0),
      hint: "cobranças pendentes",
      icon: CreditCard,
    },
    {
      label: "Recebido no mês",
      value: formatBRL(receitaMes._sum.amountCents ?? 0),
      hint: "pagamentos quitados",
      icon: TrendingUp,
    },
    {
      label: "Alunos ativos",
      value: ativos,
      hint: `${totalAlunos} cadastrados`,
      icon: Users,
    },
    {
      label: "Check-ins hoje",
      value: checkinsHoje,
      hint: "frequência do dia",
      icon: CalendarCheck,
    },
    {
      label: "Inadimplência",
      value: inadimplentes,
      hint: "alunos inativos",
      icon: AlertCircle,
    },
  ];

  const acoes = [
    {
      href: "/dashboard/alunos/novo",
      label: "Novo Aluno",
      icon: UserPlus,
      desc: "Cadastrar matrícula",
    },
    {
      href: "/dashboard/checkins",
      label: "Simular Check-in",
      icon: QrCode,
      desc: "QR / manual",
    },
    {
      href: "/dashboard/financeiro",
      label: "Cobrar Inadimplentes",
      icon: ReceiptText,
      desc: "Notificações em massa",
    },
    {
      href: "/dashboard/planos",
      label: "Configurar Gateway",
      icon: Settings2,
      desc: "Métodos de pagamento",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Visão geral do faturamento e recebimentos
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o movimento da sua academia hoje.
          </p>
        </div>
        <Link href="/dashboard/alunos/novo">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Novo aluno
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.slice(0, 4).map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.length > 4 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.slice(4).map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Ações rápidas</CardTitle>
          <CardDescription>
            Tudo o que você precisa para operar o dia.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {acoes.map((acao) => (
            <Link
              key={acao.label}
              href={acao.href}
              className="group rounded-lg border p-4 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">{acao.label}</p>
                <acao.icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{acao.desc}</p>
              <ArrowUpRight className="mt-2 h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}