import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AlunosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;
  const { q } = await searchParams;

  const alunos = await prisma.member.findMany({
    where: {
      tenantId,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
              { document: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { memberships: { include: { plan: true } } },
    take: 50,
  });

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
      active: { label: "Ativo", variant: "default" },
      inactive: { label: "Inativo", variant: "secondary" },
      blocked: { label: "Bloqueado", variant: "destructive" },
    };
    const s = map[status] ?? { label: status, variant: "secondary" as const };
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alunos</h1>
          <p className="text-sm text-muted-foreground">
            {alunos.length} aluno(s) cadastrados
          </p>
        </div>
        <Link href="/dashboard/alunos/novo">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Novo aluno
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  Nenhum aluno encontrado.
                </TableCell>
              </TableRow>
            ) : (
              alunos.map((aluno) => {
                const membershipAtiva = aluno.memberships.find(
                  (m) => m.status === "active"
                );
                return (
                  <TableRow key={aluno.id}>
                    <TableCell className="font-medium text-foreground">
                      {aluno.name}
                    </TableCell>
                    <TableCell>
                      {membershipAtiva ? membershipAtiva.plan.name : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {aluno.email ?? "—"}
                    </TableCell>
                    <TableCell>{statusBadge(aluno.status)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
