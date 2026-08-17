# Design FitFlow — Spec extraído do Google Stitch

Fonte: https://stitch.withgoogle.com/projects/9968327832979861026
Extraído em 2026-08-16 via árvore AX (captura computer_use no Brave, sessão Google do usuário).
Status: referência para implementação no SaaS-academia (Next.js 16 + shadcn/ui + Tailwind v4).

## Identidade

- Nome: **FitFlow**
- Tagline: "© 2024 FitFlow. Performance em cada movimento."
- Hero landing: "O FitFlow é o sistema definitivo para donos de academia que exigem controle total, métricas precisas e uma operação que não perde o ritmo. Assuma o comando."
- (EN no design: "The high-performance operating system designed exclusively for disciplined gym environments and elite athletic facilities.")
- Fonte: **Inter**
- Logo: "FitFlow Logo" (ícone bolt/fitness_center + wordmark)

## Paleta (tokens T0–T100)

### Primary (azul)
| Token | Hex | Token | Hex |
|---|---|---|---|
| T0 | #000000 | T60 | #6a89ff |
| T10 | #001452 | T70 | #91a7ff |
| T20 | #002682 | T80 | #b7c4ff |
| T30 | #0038b6 | T90 | #d3e4fe |
| T40 | #004ced | T95 | #eaf1ff |
| T50 | #3c6aff | T100 | #ffffff |

### Neutral A (slate-azulado — usado em dark/sidebar)
| Token | Hex |
|---|---|
| T10 | #0b1c30 |
| T20 | #213145 |
| T30 | #38485d |
| T40 | #505f76 |
| T50 | #68788f |
| T60 | #8292aa |
| T70 | #9cacc5 |
| T80 | #b7c8e1 |
| T90 | #d8e3fb |
| T95 | #ecf1ff |

### Neutral B (gray frio — super admin / variante 3)
| Token | Hex |
|---|---|
| T10 | #191c1e |
| T20 | #2d3133 |
| T30 | #444749 |
| T40 | #5c5f61 |
| T50 | #747779 |
| T60 | #8e9193 |
| T70 | #a9abad |
| T80 | #c4c7c9 |
| T90 | #e0e3e5 |
| T95 | #eff1f3 |

### Neutral C (slate médio — variante 4)
T10 #111c2d · T20 #263143 · T30 #3c475a · T40 #545f73 · T50 #6c778d · T60 #8691a7 · T70 #a0acc2 · T80 #bcc7de · T90 #dde1ff · T95 #efefff

**Cores usadas em destaque no app (labels do design):** #0052FF (primary), #1E293B (foreground slate-800), #64748B (muted slate-500), #F8FAFC (background slate-50).

## Telas (12)

### 1. Login — FitFlow
- Card central, logo FitFlow, "Acesse seu painel" (EN: "Enter your credentials to access your workspace.")
- Campos: E-mail, Senha (com visibility toggle), "Manter conectado" (Remember me), "Esqueceu?"
- "Ainda não tem conta? Criar conta" · Botão primário "Entrar"
- Demo: Admin FitFlow / admin@fitflow.com

### 2. Dashboard — FitFlow
- Header: "Visão geral do faturamento e recebimentos."
- Cards de métrica: **A receber**, **Recebido no mês**, **Receita Prevista (Mês)**, **Receita Recorrente**, **Ativos** ("Ativo: 215 alunos"), **Inadimplência**, **Renovações Automáticas**, **Check-ins hoje** (CHECK-INS HOJE / Total Check-ins Today)
- Variações de crescimento: +12% este mês, +12.5%, −2.1%, + R$ 100,00
- Valores de exemplo: R$ 45.280,00 (receita), R$ 56.400 (prevista)
- Gráficos: "GESTÃO DE PERFORMANCE" — Compromisso médio, Consistência Operacional; "A maioria dos alunos opta pelo plano Anual devido ao custo-benefício."
- Ações rápidas: "add_circle Novo Aluno", "qr_code_scanner Simular Check-in", "notifications_active Cobrar Inadimplentes", "receipt_long Gerar Boletos em Massa", "settings_suggest Configurar Gateway", "Visualizar Relatório"

### 3. Dashboard da Unidade — FitFlow
- Multi-unidade: "Ativo: 45 alunos", "Ativo: 142 alunos", "Ativo: 350 alunos"
- "Configurar métodos de pagamento da unidade 2"
- Gestor: "Gerente de Unidade"

### 4. Gestão de Alunos — FitFlow
- Busca: "Buscar aluno..." / "Pesquisar alunos ou faturas..."
- Filtros (filter_list), "Somente Ativos", botão "add_circle Novo Aluno"
- Colunas: ALUNO · PLANO · STATUS · ID · (ações)
- Linhas: Marcus Silva, Thiago Junqueira, Elena R. Costa
- IDs: "#77412 • Cadastrado em Fev 2023", "#88392 • Cadastrado em Out 2023", "#99201 • Cadastrada em Jan 2024"
- Status: ATIVO / INATIVO · Planos: Basic Mensal, Pro Anual, Personal

### 5. Financeiro — FitFlow
- Header: "Cobranças e recebimentos." / "Visão geral do faturamento e recebimentos."
- Métricas: A receber, Recebido no mês, A Cobrar Agora, VENCENDO EM 7 DIAS, Vencido em 10 Jan, Inadimplência
- Botões: "download Exportar XLS", "add Nova Cobrança", "Ver todas as transações"
- Ações em linha: "Cobrar Inadimplentes", "Gerar Boletos em Massa", "Configurar Gateway"
- Tabela: Data (15 Fev 2024, 01 Mar 2024), Método (Boleto, Pix, Cartão de Crédito, "Cartão Final 4921"), Valor (R$ 100,00, R$ 120, R$ 299,00, R$ 3.150,00), Status
- Gráfico: "Receita Prevista (Mês)"

### 6. Planos de Assinatura — FitFlow
- Header: "Gerencie os planos, preços e benefícios oferecidos." · Botão "add Novo Plano"
- Cards de plano (3 colunas):
  - **MENSAL** — R$ 149/mês · Acesso Total · Sem Fidelidade
  - **TRIMESTRAL** — R$ 129/mês · Acesso Total · Fidelidade 3m
  - **PRO ANUAL** — R$ 99/mês · Acesso Total · Avaliação Inclusa · Fidelidade 12m · badge "Plano Atual"
  - **PERSONAL** — R$ 299/mês · Tudo do Pro Anual · 2x Personal/semana · badges "Recomendado" / "MELHOR VALOR"
- Detalhes: "Total R$ 300 cobrado a cada 3 meses", "Total R$ 960 cobrado anualmente"
- nota "MAIS POPULAR" / "O melhor custo-benefício"

### 7. Relatórios de Frequência — FitFlow
- Título: Relatórios de Frequência · botão "Visualizar Relatório" / "View Detailed Graph"
- Cards: CHECK-INS HOJE (1,248), Total Check-ins Today, 342, 412, 84
- Distribuição: 65%, 25%, 14%, 10%, "Somente Ativos" toggle, filtros

### 8. Landing Page e Planos — FitFlow
- Navbar: logo FitFlow, links (Dashboard, Alunos, Planos, Log in / Entrar)
- Hero com headline + copy + CTA
- Pricing grid com os 4 planos (Mensal/Trimestral/Pro Anual/Personal)
- Footer: "© 2024 FitFlow. Performance em cada movimento."

### 9. Login Aluno — Check-in Web App
- Marca "FITFLOW" + "ALUNO"
- "Faça login para validar seu check-in agora"
- Email/senha ou ID do aluno · link "Fale com a recepção"

### 10. Check-in Confirmado — Aluno
- Estado de sucesso: "Check-in realizado (Musculação)" / "Check-in realizado (Crossfit)"
- Ações: "how_to_reg Manual Check-in", "qr_code_scanner Simular Check-in"
- PWA standalone (sem lojas)

### 11. Super Admin — 3 telas
- **Visão Geral**: métricas do ecossistema (receita total, academias ativas, alunos, uptime), "SYSTEM ONLINE"
- **Gestão de Academias**: tabela de tenants — FitFlow (Ativo: 215), unidades com Ativo: 45/142/350; botões "Access Workspace"
- **Manutenção e Status**: "Monitor infrastructure vitality, manage global configurations, and deploy maintenance protocols across the FitFlow ecosystem." — "Maintenance Mode", "Save Configuration", "View Full Changelog", "Kinetic Logic — Estável", "3 Flash", status dos serviços, badges TJ (Thiago Junqueira — super admin)

### 12. Alteração de Plano — Aluno
- Fluxo: Seleção de Plano → Resumo da Alteração → Confirmar Alteração
- Seleção: placas MENSAL (R$149), TRIMESTRAL (R$129), PERSONAL (R$299), "Plano Atual PRO ANUAL (R$ 99)"
- Quando aplicar: **Imediato** ("Valor proporcional será cobrado.") vs **Próximo Ciclo** ("Início em 15/11/2023.")
- Resumo: De: PRO ANUAL → Para: PERSONAL · Diferença Proporcional (15 dias): + R$ 100,00 · Nova Mensalidade: R$ 299,00 · Mensalidade Atual: R$ 99,00 · Data de Início
- Botões: Confirmar Alteração / Cancelar · "Voltar para Perfil"
- Origem (prompt do usuário no Stitch): "gostaria que fizesse uma tela para a própria academia mudar os planos dos alunos na mesma" + "Criar histórico de alterações de plano do aluno"

## Ícones usados (Material Symbols)
dashboard · group · account_balance_wallet · payments · analytics · settings · notifications (cobrar inadimplentes) · receipt_long (boletos em massa) · settings_suggest (gateway) · qr_code_scanner (simular check-in) · how_to_reg (manual check-in) · add_circle (novo aluno) · autorenew (carregar mais) · trending_up · calendar_clock · search · filter_list · more_vert · visibility/visibility_off · bolt · fitness_center · sell · warning · check_circle · chevron_right · arrow_forward/back · download (exportar XLS) · delete · edit

## Mapeamento p/ implementação
- --primary → #0052FF (T40/T50 azul); hover → #004ced (T40)
- --foreground → #1E293B (slate-800); --muted-foreground → #64748B (slate-500)
- --background → #F8FAFC (slate-50) no modo claro; sidebar escura com Neutrals A
- Fonte: Inter (next/font/google)
- Novas rotas: /dashboard/planos, /dashboard/relatorios, /checkin, /checkin/sucesso, landing pública / com pricing
- Fluxo alteração de plano: criar/historico (schema MembershipChange ou reuso Payment)