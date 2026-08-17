import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dumbbell,
  Check,
  Star,
  Crown,
  ArrowRight,
  QrCode,
  CreditCard,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const fmtBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const cicloLabel: Record<string, string> = {
  monthly: "/mês",
  quarterly: "/mês",
  annual: "/mês",
};

export default async function Home() {
  const session = await auth();

  // Logado → painel
  if (session?.user) redirect("/dashboard");

  // Landing pública: busca os planos do tenant demo para o pricing
  let demoPlans: {
    id: string;
    name: string;
    priceCents: number;
    billingCycle: string;
    features: string[];
    highlight: string | null;
  }[] = [];
  try {
    const demo = await prisma.tenant.findUnique({
      where: { slug: "academia-demo" },
      include: {
        plans: { where: { active: true }, orderBy: { priceCents: "asc" } },
      },
    });
    demoPlans = demo?.plans ?? [];
  } catch {
    // banco indisponível → fallback estático
    demoPlans = [
      {
        id: "mensal",
        name: "Mensal",
        priceCents: 14900,
        billingCycle: "monthly",
        features: ["Acesso Total", "Sem Fidelidade"],
        highlight: null,
      },
      {
        id: "trimestral",
        name: "Trimestral",
        priceCents: 12900,
        billingCycle: "quarterly",
        features: ["Acesso Total", "Fidelidade 3m"],
        highlight: null,
      },
      {
        id: "pro-anual",
        name: "Pro Anual",
        priceCents: 9900,
        billingCycle: "annual",
        features: ["Acesso Total", "Avaliação Inclusa", "Fidelidade 12m"],
        highlight: "Mais Popular",
      },
      {
        id: "personal",
        name: "Personal",
        priceCents: 29900,
        billingCycle: "monthly",
        features: ["Tudo do Pro Anual", "2x Personal / semana"],
        highlight: "Recomendado",
      },
    ];
  }

  const destaques = demoPlans.filter((p) => p.highlight).map((p) => p.name);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              FitFlow
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#recursos" className="hover:text-foreground">Recursos</a>
            <a href="#planos" className="hover:text-foreground">Planos</a>
            <Link href="/checkin" className="hover:text-foreground">Check-in aluno</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="gap-1">
              <Link href="/login">
                Criar conta
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5">
          <ShieldCheck className="h-3 w-3" />
          O sistema definitivo para academias
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          O FitFlow é o sistema definitivo para donos de academia que exigem{" "}
          <span className="text-primary">controle total</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Métricas precisas, operação que não perde o ritmo e cobrança recorrente
          automatizada. Assuma o comando da sua academia.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild className="gap-2">
            <Link href="/login">
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/checkin">Check-in do aluno</Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Sem cartão de crédito para testar a demo
        </p>
      </section>

      {/* Recursos */}
      <section id="recursos" className="border-t bg-card/50 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: QrCode,
              title: "Check-in por QR",
              desc: "Aluno valida presença pelo celular em segundos, sem catraca.",
            },
            {
              icon: CreditCard,
              title: "Cobrança recorrente",
              desc: "Mensalidades automáticas via Asaas: Pix, boleto e cartão.",
            },
            {
              icon: BarChart3,
              title: "Relatórios de frequência",
              desc: "Presença por dia, top alunos e gestão de performance.",
            },
            {
              icon: ShieldCheck,
              title: "Multi-academia",
              desc: "Cada unidade com seu painel, planos e recebimentos isolados.",
            },
          ].map((r) => (
            <div key={r.title} className="rounded-2xl border bg-background p-6">
              <r.icon className="mb-4 h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Planos para cada ritmo
          </h2>
          <p className="mt-2 text-muted-foreground">
            A maioria dos alunos opta pelo plano Anual devido ao custo-benefício.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {demoPlans.map((plan) => {
            const destaque = plan.highlight !== null;
            return (
              <div
                key={plan.id}
                className={
                  destaque
                    ? "relative rounded-2xl border-2 border-primary bg-card p-6 shadow-xl shadow-primary/10"
                    : "relative rounded-2xl border bg-card p-6"
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
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {plan.name}
                </p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-foreground">
                    {fmtBRL(plan.priceCents)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {cicloLabel[plan.billingCycle] ?? "/mês"}
                  </span>
                </div>
                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={destaque ? "default" : "outline"}
                  asChild
                >
                  <Link href="/login">Assinar</Link>
                </Button>
              </div>
            );
          })}
        </div>
        {destaques.length > 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {destaques.join(" · ")} — escolha o que combina com você.
          </p>
        )}
      </section>

      {/* CTA final */}
      <section className="border-t bg-foreground py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-background">
            Pronto para assumir o comando?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Crie sua conta e veja a demo funcionando em minutos.
          </p>
          <Button size="lg" className="mt-6 gap-2" asChild>
            <Link href="/login">
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">FitFlow</span>
          </div>
          <p>© 2024 FitFlow. Performance em cada movimento.</p>
        </div>
      </footer>
    </div>
  );
}