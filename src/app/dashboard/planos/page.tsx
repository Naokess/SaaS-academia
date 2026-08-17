import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plus, Crown, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const fmtBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const cycleLabel: Record<string, string> = {
  monthly: "/mês",
  quarterly: "/mês",
  annual: "/mês",
};

const cycleTotal: Record<string, string> = {
  quarterly: "Total R$ 300 cobrado a cada 3 meses",
  annual: "Total R$ 960 cobrado anualmente",
};

export default async function PlanosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const tenantId = session.user.tenantId;
  const plans = await prisma.plan.findMany({
    where: { tenantId, active: true },
    orderBy: { priceCents: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Planos de Assinatura
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os planos, preços e benefícios oferecidos.
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const destaque =
            plan.highlight === "Recomendado" || plan.highlight === "Mais Popular";
          return (
            <Card
              key={plan.id}
              className={
                destaque
                  ? "relative border-primary shadow-lg shadow-primary/10"
                  : "relative"
              }
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-4 gap-1 bg-primary text-primary-foreground">
                  {plan.highlight === "Recomendado" ? (
                    <Star className="h-3 w-3" />
                  ) : (
                    <Crown className="h-3 w-3" />
                  )}
                  {plan.highlight}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-base uppercase tracking-wide text-muted-foreground">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {fmtBRL(plan.priceCents)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {cycleLabel[plan.billingCycle] ?? "/mês"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {cycleTotal[plan.billingCycle] && (
                  <p className="text-xs text-muted-foreground">
                    {cycleTotal[plan.billingCycle]}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button
                    variant={destaque ? "default" : "ghost"}
                    size="sm"
                    className="flex-1"
                  >
                    Ver alunos
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Por que o plano Anual é o favorito?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          A maioria dos alunos opta pelo plano Anual devido ao custo-benefício.
        </CardContent>
      </Card>
    </div>
  );
}