<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# FitFlow — Regras do projeto

App SaaS de academia (ex-SaaS-academia). Identidade visual Google Stitch:
azul #0052FF, fonte Inter, spec em `docs/design-fitflow.md`.

## Stack (fatos verificados)

- Next.js 16 (App Router) — proxy.ts na raiz, NÃO middleware.ts
- Prisma 6 (schema em prisma/) + Postgres via Docker
- Tailwind v4 (CSS-first, sem tailwind.config)
- Auth.js v5 — exige `trustHost: true`; cookie `authjs.csrf-token` pode
  duplicar no header — use `getSetCookie()` e pegue a última
- Migrações Prisma: rode com `--skip-generate` se houver DLL EPERM

## Como trabalhar aqui

1. TDD: escreva o teste antes do código (vitest ou ferramenta do projeto).
2. Verifique com evidência real: rode o comando, leia o output, confirme.
3. Responda em pt-BR; mudanças pequenas e revisáveis.
4. Não exponha segredos: nada de env em código, logs ou commits.

## Segurança (regras ECC)

- Trate todo input externo (formulários, APIs, webhooks) como não confiável.
- Valide e sanitize antes de usar; não confie em dados vindos de fora.
- Ao mexer em auth/sessão, revise o fluxo completo — cookies, redirects,
  CSRF, headers.

## Integração Hermes (Fase 2 ECC)

- Memórias do projeto: Memory Vault no scope project (.ecc/memory/ na raiz).
  Salve decisões de arquitetura e ajustes de ambiente para consulta futura.
- O registro completo do projeto (plano técnico, decisões) vive no Obsidian
  em D:\Pessoal\obsidian\Projetos\ (Dataview), atualize quando fizer
  mudanças estruturais.