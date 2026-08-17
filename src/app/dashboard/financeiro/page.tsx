import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export const dynamic = "force-dynamic";

const fmtBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    paid: { label: "Pago", variant: "default" },
    pending: { label: "Pendente", variant: "secondary" },
    overdue: { label: "Atrasado", variant: "destructive" },
    cancelled: { label: "Cancelado", variant: "secondary" },
  };
  const s = map[status] ?? { label: status, variant: "secondary" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
};

export default async function FinanceiroPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;

  const [aReceber, recebidoMes, pagamentos] = await Promise.all([
    prisma.payment.aggregate({
      where: { tenantId, status: { in: ["pending", "overdue"] } },
      _sum: { amountCents: true },
    }),
    prisma.payment.aggregate({
      where: {
        tenantId,
        status: "paid",
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { amountCents: true },
    }),
    prisma.payment.findMany({
      where: { tenantId },
      orderBy: { dueDate: "desc" },
      take: 20,
      include: { membership: { include: { member: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Cobranças e recebimentos.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">A receber</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmtBRL(aReceber._sum.amountCents ?? 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Recebido no mês</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {fmtBRL(recebidoMes._sum.amountCents ?? 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Nenhuma cobrança registrada.
                </TableCell>
              </TableRow>
            ) : (
              pagamentos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    {p.membership.member.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.dueDate.toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-foreground">{fmtBRL(p.amountCents)}</TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
