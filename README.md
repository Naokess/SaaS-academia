# FitFlow — Gestão de Academia (SaaS)

Aplicação SaaS para gerenciamento de academias: dashboard administrativo,
cadastro de alunos, planos, relatórios e check-in por QR code.
Multi-tenant (cada academia é um tenant isolado), autenticação por credenciais.

> Projeto originalmente chamado "SaaS-academia" — a marca/identidade visual
> atual é **FitFlow** (spec em [`docs/design-fitflow.md`](docs/design-fitflow.md)).

## Funcionalidades

- **Autenticação** — Login com email + senha (Auth.js v5, sessão JWT,
  senha com hash bcrypt)
- **Dashboard** — Visão geral da operação da academia
- **Alunos** — Cadastro e gestão de alunos (com QR individual)
- **Planos** — Planos e features disponíveis por tenant
- **Relatórios** — Painéis de relatório da academia
- **Check-in por QR** — Página pública de check-in (`/checkin`) para alunos
- **Multi-tenant** — Usuários vinculados a um tenant (academia)

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), React 19 |
| Estilo | Tailwind CSS v4 (CSS-first) + shadcn/ui (Radix) |
| Backend | Server Actions e Route Handlers (`src/app/api`) |
| Banco | PostgreSQL 16 + Prisma 6 (ORM) |
| Auth | Auth.js v5 (`next-auth` beta) com adapter Prisma |
| Validação | Zod + React Hook Form |
| Deploy | Docker + Docker Compose |

## Pré-requisitos

- **Node.js 20+** (para desenvolvimento local)
- **Docker + Docker Compose** (para o banco PostgreSQL e/ou o app empacotado)
- **Git** (para clonar o repositório)

## Como rodar

### Opção 1 — Docker Compose (recomendada, tudo de pé de uma vez)

Sobe o banco PostgreSQL **e** o app em modo produção, já rodando
migrações e seed automaticamente:

```bash
docker compose up -d --build
```

Acesse: <http://localhost:3000>

Login demo (criado pelo seed): **admin@demo.com** / **admin123**

### Opção 2 — Desenvolvimento local (editar código com hot reload)

#### 1. Suba só o banco (se ainda não tiver um Postgres rodando)

```bash
docker compose up -d postgres
```

#### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (nunca commite esse arquivo):

```env
# URL do banco (usuário/senha/banco do docker-compose.yml)
DATABASE_URL="postgresql://saas:saas_dev_password@localhost:5432/saas_academia"

# Segredo de assinatura da sessão (gere um novo: openssl rand -base64 32)
AUTH_SECRET="cole-aqui-um-segredo-aleatorio"
```

> Se o banco estiver em outra máquina (ex.: servidor da equipe via rede/Tailscale),
> troque `localhost` pelo endereço dessa máquina.

#### 3. Instale as dependências e prepare o banco

```bash
npm install
npx prisma migrate deploy   # aplica as migrações existentes
npx prisma db seed          # cria o usuário admin demo e dados de exemplo
```

#### 4. Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: <http://localhost:3000>

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | Lint com ESLint |
| `npx prisma migrate deploy` | Aplica migrações do banco |
| `npx prisma db seed` | Popula o banco com dados de exemplo |
| `npx prisma studio` | Interface web para inspecionar os dados |

## Estrutura do projeto

```
├── prisma/
│   ├── schema.prisma        # Modelos do banco (User, Tenant, Aluno, ...)
│   ├── migrations/          # Migrações versionadas
│   └── seed.ts              # Dados de exemplo (admin demo)
├── src/
│   ├── app/
│   │   ├── login/           # Página e action de login
│   │   ├── dashboard/       # Painel admin (alunos, planos, relatórios)
│   │   ├── checkin/         # Página pública de check-in por QR
│   │   └── api/             # Route handlers (auth, health)
│   ├── components/          # Componentes de UI (shadcn/ui)
│   ├── lib/                 # auth.ts (Auth.js), db.ts (Prisma), utils
│   ├── hooks/               # Hooks reutilizáveis
│   └── proxy.ts             # Proxy de segurança (equivalente ao middleware no Next 16)
├── docs/design-fitflow.md   # Identidade visual (Google Stitch)
├── docker-compose.yml       # Postgres + app
└── Dockerfile               # Imagem do app
```

## Deploy

O compose publicado inclui `restart: unless-stopped` — o app fica de pé
sozinho e reinicia com a máquina. As portas publicadas são `3000` (app) e
`5432` (banco).

No setup atual do projeto, o acesso remoto é feito via **Tailscale** (VPN
privada): o app roda num desktop da equipe e o notebook acessa pelo IP da
rede Tailscale — nada é exposto à internet pública.

## Documentação adicional

- [docs/design-fitflow.md](docs/design-fitflow.md) — identidade visual
  (paleta, tipografia) gerada no Google Stitch
- [AGENTS.md](AGENTS.md) — regras e fatos técnicos do projeto