# Execution Scripts — StashSaarthi Automation Layer

> **Layer 3 — Deterministic Scripts**

This directory houses all automation scripts for the StashSaarthi platform.

## Planned Scripts

| Script              | Language       | Purpose                                                       |
| ------------------- | -------------- | ------------------------------------------------------------- |
| `inventory_scraper` | Python/Node.js | Scrape and sync local inventory data from partner nodes       |
| `node_auditor`      | Python         | Automated audit checks for stash node capacity and compliance |
| `data_sync`         | Node.js        | Sync Supabase data with local caches / analytics              |
| `financial_model`   | Python         | Monthly P&L generation using pricing engine formulas          |
| `whatsapp_triggers` | Node.js        | Automated WhatsApp notifications via Twilio                   |
| `email_triggers`    | Node.js        | Automated email notifications via Resend                      |

## Guidelines

1. All scripts must be **deterministic** — no LLM-generated outputs in production paths
2. Environment variables must come from `.env.local`, never hardcoded
3. Each script must have clear input/output specs documented in its header
4. Error handling must follow the Self-Annealing Protocol (see `directives/`)
5. Test scripts locally before deploying to Supabase Edge Functions
