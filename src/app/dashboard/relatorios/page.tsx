import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BarChart3, CalendarCheck, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;
  const agora = new Date();
  const inicioHoje = new Date(agora);
  inicioHoje.setHours(0, 0, 0, 0);

  const [ativos, checkinsHoje, checkinsSemana] = await Promise.all([
    prisma.member.count({ where: { tenantId, status: "active" } }),
    prisma.checkIn.count({
      where: { tenantId, createdAt: { gte: inicioHoje } },
    }),
    prisma.checkIn.count({
      where: {
        tenantId,
        createdAt: { gte: new Date(agora.getTime() - 7 * 864e5) },
      },
    }),
  ]);

  // Frequência por dia (últimos 14 dias) — para o gráfico
  const desde = new Date(agora.getTime() - 13 * 864e5);
  desde.setHours(0, 0, 0, 0);
  const recentes = await prisma.checkIn.findMany({
    where: { tenantId, createdAt: { gte: desde } },
    select: { createdAt: true },
  });

  const porDia = new Map<string, number>();
  for (const c of recentes) {
    const chave = c.createdAt.toISOString().slice(0, 10);
    porDia.set(chave, (porDia.get(chave) ?? 0) + 1);
  }
  const dias: { dia: string; total: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(agora.getTime() - i * 864e5);
    const chave = d.toISOString().slice(0, 10);
    dias.push({
      dia: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      total: porDia.get(chave) ?? 0,
    });
  }
  const maxDia = Math.max(1, ...dias.map((d) => d.total));

  // Top alunos por frequência
  const top = await prisma.checkIn.groupBy({
    by: ["memberId"],
    where: { tenantId },
    _count: { _all: true },
    orderBy: { _count: { memberId: "desc" } },
    take: 5,
  });
  const topComNomes = await prisma.member.findMany({
    where: { id: { in: top.map((t) => t.memberId) } },
    select: { id: true, name: true },
  });
  const nomePorId = new Map(topComNomes.map((m) => [m.id, m.name]));
  const topLinhas = top.map((t, i) => ({
    pos: i + 1,
    nome: nomePorId.get(t.memberId) ?? "Aluno",
    total: t._count._all,
  }));

  const stats = [
    { label: "Total Check-ins hoje", value: checkinsHoje, icon: CalendarCheck },
    { label: "Check-ins (7 dias)", value: checkinsSemana, icon: TrendingUp },
    { label: "Alunos ativos", value: ativos, icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios de Frequência</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe a presença da academia.
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Visualizar Relatório
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Check-ins por dia (últimos 14 dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-end gap-2">
            {dias.map((d) => (
              <div key={d.dia} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-foreground">{d.total}</span>
                <div
                  className="w-full rounded-t bg-primary/80"
                  style={{ height: `${Math.max(4, (d.total / maxDia) * 100)}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{d.dia}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top alunos por frequência</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead className="text-right">Check-ins</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topLinhas.map((linha) => (
                <TableRow key={linha.pos}>
                  <TableCell className="text-muted-foreground">{linha.pos}</TableCell>
                  <TableCell className="font-medium text-foreground">
                    {linha.nome}
                  </TableCell>
                  <TableCell className="text-right text-foreground">
                    {linha.total}
                  </TableCell>
                </TableRow>
              ))}
              {topLinhas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Nenhum check-in registrado ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}