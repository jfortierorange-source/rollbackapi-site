import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 },
  }),
};

const AUDIT_EVENTS = [
  {
    ts: "09:14:02.441",
    event: "ACCESS_GRANTED",
    principal: "svc/billing-agent",
    resource: "stripe:charges:read",
    scope: "customer_id=cus_Nb29f4",
    ttl: "120s",
    status: "ok",
  },
  {
    ts: "09:14:05.118",
    event: "ACCESS_DENIED",
    principal: "svc/billing-agent",
    resource: "stripe:refunds:create",
    scope: "policy:out_of_scope",
    ttl: "—",
    status: "deny",
  },
  {
    ts: "09:14:18.773",
    event: "APPROVAL_HELD",
    principal: "svc/ops-agent",
    resource: "aws:iam:role:assume",
    scope: "role=arn:aws:iam::prod-deploy",
    ttl: "pending",
    status: "hold",
  },
  {
    ts: "09:14:31.002",
    event: "TOKEN_REVOKED",
    principal: "svc/billing-agent",
    resource: "stripe:charges:read",
    scope: "ttl_expired",
    ttl: "0s",
    status: "expired",
  },
  {
    ts: "09:14:44.289",
    event: "ACCESS_GRANTED",
    principal: "svc/data-pipeline",
    resource: "pg:read",
    scope: "schema=analytics WHERE tenant_id=...",
    ttl: "60s",
    status: "ok",
  },
] as const;

const statusStyle = {
  ok: "text-emerald-400/75",
  deny: "text-red-400/70",
  hold: "text-amber-400/75",
  expired: "text-muted-foreground/45",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 border border-primary/25 bg-primary/[0.08] flex items-center justify-center rounded-[3px]">
              <KeyRound className="w-3 h-3 text-primary/80" />
            </div>
            <span className="font-semibold tracking-tight text-[13.5px] text-foreground/90">SecretsAPI</span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-[13px] text-muted-foreground/70">
            <a href="#how-it-works" className="hover:text-foreground/90 transition-colors duration-150">How it works</a>
            <a href="#specification" className="hover:text-foreground/90 transition-colors duration-150">Specification</a>
            <a href="#compliance" className="hover:text-foreground/90 transition-colors duration-150">Compliance</a>
            <a href="#acquisition" className="hover:text-foreground/90 transition-colors duration-150">Acquisition</a>
            <a href="#faq" className="hover:text-foreground/90 transition-colors duration-150">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <a href="#how-it-works" className="hidden lg:block text-[13px] text-muted-foreground/60 hover:text-foreground/80 transition-colors">Technical overview</a>
            <Button size="sm" className="font-medium text-[12.5px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-[3px] h-7.5 px-3.5">
              Request access
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-6 border-b border-border/30 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_460px] gap-14 xl:gap-20 items-start">

            <div className="min-w-0 w-full">
              <motion.p
                variants={fade} initial="hidden" animate="show"
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/55 mb-7 text-center md:text-left"
              >
                secretsapi.com · private access
              </motion.p>

              <motion.h1
                variants={fade} initial="hidden" animate="show" custom={1}
                className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold tracking-[-0.024em] leading-[1.1] mb-6 text-foreground/95 text-center md:text-left"
              >
                Credential access infrastructure for autonomous workloads.
              </motion.h1>

              <motion.p
                variants={fade} initial="hidden" animate="show" custom={2}
                className="text-[15.5px] text-muted-foreground/75 leading-[1.82] mb-10 w-full max-w-full md:max-w-[520px] text-center md:text-left"
              >
                SecretsAPI is credential access infrastructure: workloads request named credentials by scope, receive scoped ephemeral tokens, and the raw credential never leaves the vault. A billing agent verifying a charge receives a 120-second token scoped to <code className="text-[13.5px] font-mono text-primary/60 bg-primary/[0.07] px-1.5 py-0.5 rounded-sm">charges:read</code> for that customer only — not the Stripe master key. Every access event is policy-evaluated, signed, and logged.
              </motion.p>

              {/* Spec table */}
              <motion.div
                variants={fade} initial="hidden" animate="show" custom={3}
                className="border border-border/35 overflow-hidden mb-10 text-[13px]"
              >
                {[
                  { k: "Access model", v: "Brokered — workload receives scoped token, never raw credential" },
                  { k: "Token lifetime", v: "Configurable TTL, 15 s – 24 h. Cryptographically invalid after expiry." },
                  { k: "Policy evaluation", v: "Per principal, per resource, per operation. Evaluated at request time." },
                  { k: "Audit log", v: "HMAC-SHA256 signed, append-only. One entry per access event." },
                  { k: "Deployment", v: "Single-tenant VPC. Private link available." },
                ].map(({ k, v }, i) => (
                  <div
                    key={k}
                    className={`grid grid-cols-1 sm:grid-cols-[160px_1fr] ${i < 4 ? "border-b border-border/25" : ""}`}
                  >
                    <div className="px-4 pt-3 pb-0.5 sm:py-3 text-muted-foreground/55 font-mono uppercase tracking-[0.07em] text-[10.5px] flex items-center sm:border-r sm:border-border/25">{k}</div>
                    <div className="px-4 pt-0.5 pb-3 sm:py-3 text-foreground/72 leading-snug">{v}</div>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fade} initial="hidden" animate="show" custom={4}
                className="flex flex-wrap items-center gap-3 justify-center md:justify-start"
              >
                <Button className="rounded-[3px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 text-[13px]">
                  Request access <ArrowRight className="w-3 h-3 ml-1.5" />
                </Button>
                <a href="#how-it-works" className="text-[13px] text-muted-foreground/60 hover:text-muted-foreground/90 transition-colors">
                  Technical overview →
                </a>
              </motion.div>
            </div>

            {/* Audit log terminal */}
            <motion.div
              variants={fade} initial="hidden" animate="show" custom={2}
              className="lg:pt-7 min-w-0 w-full overflow-hidden"
            >
              <div className="border border-border/40 bg-[#060508] overflow-hidden overflow-x-auto">
                <div className="border-b border-border/30 px-4 py-2.5 flex items-center justify-between bg-[#09080c]">
                  <span className="text-[10.5px] font-mono text-muted-foreground/40 tracking-wide">access-event-log · live stream</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-400/50">connected</span>
                  </div>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[72px_120px_1fr] border-b border-border/20 bg-[#08070b]">
                  {["timestamp", "event", "detail"].map(h => (
                    <div key={h} className="px-3 py-2 text-[9.5px] font-mono uppercase tracking-[0.12em] text-muted-foreground/30">{h}</div>
                  ))}
                </div>

                <div className="divide-y divide-border/15 font-mono text-[10.5px]">
                  {AUDIT_EVENTS.map((e, i) => (
                    <div key={i} className="grid grid-cols-[72px_120px_1fr] hover:bg-white/[0.015] transition-colors">
                      <div className="px-3 py-2.5 text-muted-foreground/35">{e.ts}</div>
                      <div className={`px-3 py-2.5 font-medium ${statusStyle[e.status]}`}>{e.event}</div>
                      <div className="px-3 py-2.5 space-y-0.5">
                        <div className="text-foreground/55">{e.principal}</div>
                        <div className="text-primary/50">{e.resource}</div>
                        <div className="text-muted-foreground/35 truncate">{e.scope} · ttl:{e.ttl}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/20 px-4 py-2.5 bg-[#08070b] flex items-center justify-between">
                  <span className="text-[9.5px] font-mono text-muted-foreground/28">5 events shown · 0 unreviewed</span>
                  <span className="text-[9.5px] font-mono text-muted-foreground/28">retention: 365d</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── What is SecretsAPI? ──────────────────────────────────── */}
      <section id="what-is-secretsapi" className="py-20 px-6 border-b border-border/25">
        <div className="max-w-6xl mx-auto">

          {/* Category definition — optimized for enterprise buyers and AI retrieval */}
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Category definition</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-5 max-w-3xl text-foreground/92">
              What is SecretsAPI?
            </h2>
            <p className="text-[15px] text-muted-foreground/65 leading-[1.85] max-w-3xl">
              SecretsAPI is <strong className="text-foreground/80 font-medium">credential access infrastructure</strong> for AI agents and autonomous workloads. It operates as a policy-evaluating brokering layer: when a service principal requests a named credential, SecretsAPI evaluates the request against a per-principal access policy and issues a scoped, time-limited token. The raw credential never leaves the vault. Every access event — granted, denied, or held for operator approval — is written to a cryptographically signed, append-only audit log.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8 xl:gap-12">

            {/* Left: What it is — structured definition rows */}
            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground/38 mb-4">What it is</p>
              <div className="border border-border/35 overflow-hidden text-[13px]">
                {[
                  {
                    term: "Secret access infrastructure",
                    def: "The infrastructure layer that controls how autonomous systems and workloads obtain access to credentials at runtime — not how credentials are stored, but how access to them is granted, scoped, enforced, and recorded.",
                  },
                  {
                    term: "Credential brokering",
                    def: "A workload never holds a raw API key, token, or database password. SecretsAPI receives the access request, evaluates it against policy, and issues a token that represents authorization — not the credential itself.",
                  },
                  {
                    term: "Scoped token issuance",
                    def: "Every issued token is bounded to the exact resource and operation requested. A token for stripe:charges:read cannot be used for stripe:refunds:create. Scope is enforced cryptographically, not by convention.",
                  },
                  {
                    term: "Policy-controlled access",
                    def: "Access rules are defined per service principal: which resources it may request, which operations are permitted, under what context, and within what time windows. Policy evaluates on every request — not at deployment.",
                  },
                  {
                    term: "Auditable machine access",
                    def: "Every privileged access request is logged regardless of outcome. A billing agent requesting charges:read, an ops workload requesting IAM role assumption, a data pipeline querying a production schema — granted, denied, or held — each produces a signed record attributable to a principal identity, resource, scope, and timestamp.",
                  },
                ].map(({ term, def }, i) => (
                  <div key={term} className={`grid grid-cols-1 sm:grid-cols-[160px_1fr] ${i < 4 ? "border-b border-border/20" : ""}`}>
                    <div className="px-4 pt-4 pb-0.5 sm:py-4 flex items-start sm:border-r sm:border-border/20">
                      <span className="text-[12px] font-medium text-foreground/65 leading-snug">{term}</span>
                    </div>
                    <div className="px-4 pt-0.5 pb-4 sm:py-4">
                      <p className="text-muted-foreground/58 leading-[1.76]">{def}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: What it is not */}
            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}>
              <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-muted-foreground/38 mb-4">What it is not</p>
              <div className="border border-border/30 overflow-hidden text-[13px]">
                {[
                  {
                    label: "Not a password manager",
                    note: "Password managers are for humans retrieving credentials manually. SecretsAPI has no UI, no copy-paste workflow, and no human in the access path. It issues machine tokens to machine principals.",
                  },
                  {
                    label: "Not a secrets vault or secrets manager",
                    note: "AWS Secrets Manager, HashiCorp Vault, and similar tools store credentials and return the raw value on request. SecretsAPI adds an enforcement layer above storage — the workload never receives the raw credential.",
                  },
                  {
                    label: "Not a chatbot or AI guardrail layer",
                    note: "SecretsAPI is not prompt injection defense, LLM output filtering, or AI content guardrails. It controls which production systems a workload can reach — not what the workload generates.",
                  },
                  {
                    label: "Not an API monitoring dashboard",
                    note: "Observability tools record traffic after the fact. SecretsAPI enforces access before a token is issued — the audit log is a byproduct of enforcement, not an analytics product.",
                  },
                  {
                    label: "Not a generic cybersecurity product",
                    note: "SecretsAPI does not scan for vulnerabilities, manage threat detection, or secure endpoints. It solves one specific problem: autonomous systems holding raw credentials they were never designed to protect.",
                  },
                ].map(({ label, note }, i) => (
                  <div key={label} className={`px-5 py-4 border-b border-border/20`}>
                    <p className="text-[12.5px] font-medium text-foreground/60 mb-1.5">{label}</p>
                    <p className="text-muted-foreground/48 leading-[1.72]">{note}</p>
                  </div>
                ))}
                <div className="px-5 py-4 bg-primary/[0.04]">
                  <p className="text-[12.5px] font-medium text-primary/70 mb-1.5">It is: credential access infrastructure for autonomous systems</p>
                  <p className="text-muted-foreground/55 leading-[1.72]">The enforcement layer between workloads and credential storage — controlling who can access what resource, under what scope, for how long, with a signed record of every decision.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── The credential exposure problem ─────────────────────── */}
      <section className="py-20 px-6 border-b border-border/25 bg-card/[0.07]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">The problem</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-5 max-w-2xl text-foreground/92">
              Autonomous systems hold complete access to every operation their credential permits — not just the one they need.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/65 leading-[1.82] max-w-2xl mb-12">
              A payments automation agent configured with a Stripe secret key holds the master credential for every Stripe operation — charges, refunds, payouts, customer mutations. It needs read access to one endpoint. It has write access to everything. The database workload running alongside it has a PostgreSQL connection string that allows it to drop tables it was never meant to touch. This is the default: reusable, permanent, unscoped credentials giving every agent complete access to every system it touches.
            </p>
          </motion.div>

          {/* Operational cost by system */}
          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="border border-border/35 overflow-hidden text-[13px] mb-8"
          >
            <div className="hidden sm:grid sm:grid-cols-[156px_1fr_1fr] bg-card/20 border-b border-border/30">
              <div className="px-5 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/40 border-r border-border/20">System</div>
              <div className="px-5 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/40 border-r border-border/20">What the agent holds by default</div>
              <div className="px-5 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-red-400/45">What goes wrong</div>
            </div>
            {[
              {
                system: "Payment API\nStripe",
                holds: "Master key — charges, refunds, payouts, and all customer mutations in scope",
                consequence: "A logic error or prompt injection reaching stripe:refunds:create issues real refunds before the batch completes. Manual reversal required for every affected transaction.",
              },
              {
                system: "Production deploy\nAWS IAM",
                holds: "IAM access key valid between runs, readable by every process in the container",
                consequence: "One compromised dependency moves laterally to every role the key can assume. The blast radius is the full IAM permission surface — not just the deployment job.",
              },
              {
                system: "Database write\nPostgreSQL",
                holds: "Connection string with full schema access for the lifetime of the connection",
                consequence: "A missing WHERE clause or misconfigured migration runs without a time boundary. A DROP TABLE or unbounded UPDATE has no TTL to stop it mid-execution.",
              },
              {
                system: "Account ops\nCRM",
                holds: "Write access to the full account dataset — no approval gate, no volume cap",
                consequence: "A misconfigured batch run processes tier changes, cancellations, and adjustments at scale. The run completes before any operator sees what executed.",
              },
              {
                system: "API integrations\nOpenAI / Slack / GitHub",
                holds: "API keys for all external services injected as environment variables throughout the container lifetime",
                consequence: "One supply chain compromise in one dependency reaches every integration simultaneously. All keys rotate at once — the attacker had access to all of them during the window.",
              },
            ].map(({ system, holds, consequence }, i) => (
              <div
                key={system}
                className={`grid grid-cols-1 sm:grid-cols-[156px_1fr_1fr] sm:divide-x sm:divide-border/20 ${i < 4 ? "border-b border-border/20" : ""}`}
              >
                <div className="px-4 pt-4 pb-1 sm:py-4 text-primary/60 font-mono text-[10.5px] uppercase tracking-[0.08em] leading-[1.55] whitespace-pre-line">{system}</div>
                <div className="px-4 py-1 sm:py-4 text-muted-foreground/55 leading-snug text-[12.5px]">{holds}</div>
                <div className="px-4 pt-1 pb-4 sm:py-4 text-red-400/58 leading-snug text-[12.5px]">{consequence}</div>
              </div>
            ))}
          </motion.div>

          {/* Comparison table */}
          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="border border-border/35 overflow-hidden text-[13px]"
          >
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[180px_1fr_1fr] bg-card/20 border-b border-border/30">
              <div className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/40 border-r border-border/20" />
              <div className="hidden sm:block px-5 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-muted-foreground/40 border-r border-border/20">Raw credential</div>
              <div className="px-4 sm:px-5 py-3 text-[10px] font-mono uppercase tracking-[0.12em] text-primary/50">SecretsAPI</div>
            </div>
            {[
              {
                prop: "Access scope",
                bad: "Full credential surface — every operation the key permits",
                good: "Exactly the resource and operation requested. Nothing broader.",
              },
              {
                prop: "Credential lifetime",
                bad: "Persistent until manually rotated or revoked",
                good: "TTL-bounded. Cryptographically invalid after expiry.",
              },
              {
                prop: "Audit record",
                bad: "None. No record of what accessed what, or when.",
                good: "Signed entry per event: principal, resource, scope, verdict, timestamp.",
              },
              {
                prop: "Compromise surface",
                bad: "Full system access for any workload holding the key",
                good: "Single-operation window. No raw credential to exfiltrate.",
              },
              {
                prop: "Policy enforcement",
                bad: "None. Policy is only at deployment, not at runtime.",
                good: "Per-principal, per-resource, per-operation. Evaluated on every request.",
              },
              {
                prop: "Human review path",
                bad: "No mechanism — workload acts without operator visibility",
                good: "Configurable approval hold for elevated or out-of-policy requests.",
              },
            ].map(({ prop, bad, good }, i) => (
              <div
                key={prop}
                className={`grid grid-cols-[100px_1fr] sm:grid-cols-[180px_1fr_1fr] ${i < 5 ? "border-b border-border/20" : ""}`}
              >
                <div className="px-4 sm:px-5 py-4 text-muted-foreground/50 font-medium border-r border-border/20 text-[12.5px]">{prop}</div>
                <div className="hidden sm:block px-5 py-4 text-muted-foreground/50 leading-snug border-r border-border/15 text-[12.5px]">{bad}</div>
                <div className="px-4 sm:px-5 py-4 text-foreground/70 leading-snug text-[12.5px]">{good}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 border-b border-border/25">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">How it works</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              The workload never touches the credential.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/65 leading-[1.82] max-w-xl">
              A billing workload calls <code className="text-[13px] font-mono text-primary/60 bg-primary/[0.07] px-1.5 py-0.5 rounded-sm">secrets.request("stripe/live", {"{"}op: "charges:read", customer_id: "cus_Nb29f4"{"}"}) </code> and receives a 120-second JWT scoped to that operation and customer. It uses that token against Stripe. Two minutes later the token is cryptographically dead. The Stripe master key never left the vault. An IAM role assumption request from a deployment agent exceeding policy risk threshold is held, not executed, until an operator approves it.
            </p>
          </motion.div>

          {/* Request flow — text-driven, minimal decoration */}
          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="mb-14"
          >
            <div className="border border-border/35 overflow-hidden">
              {[
                {
                  step: "01",
                  actor: "Service principal",
                  action: "Requests access to credential by name and scope",
                  detail: "secrets.request(\"stripe/charges_read\", scope={customer_id: \"cus_Nb29f4\"})",
                  code: true,
                },
                {
                  step: "02",
                  actor: "Policy engine",
                  action: "Evaluates request against principal's access policy",
                  detail: "Checks resource pattern, permitted operations, time window, and context constraints. No raw credential is read at this stage.",
                  code: false,
                },
                {
                  step: "03",
                  actor: "SecretsAPI",
                  action: "Issues scoped token or holds for approval",
                  detail: "{ token: \"sat_7f2a91b4\", scope: \"charges:read\", customer_id: \"cus_Nb29f4\", exp: 1745236562 }",
                  code: true,
                },
                {
                  step: "04",
                  actor: "Service principal",
                  action: "Presents scoped token to production system",
                  detail: "The token carries only the granted scope. The raw credential remains in the vault and is never transmitted.",
                  code: false,
                },
                {
                  step: "05",
                  actor: "Audit log",
                  action: "Signed event written for every access outcome",
                  detail: "Regardless of verdict — GRANTED, DENIED, HELD — an HMAC-signed entry is appended immediately.",
                  code: false,
                },
              ].map(({ step, actor, action, detail, code }, i) => (
                <div key={step} className={`grid grid-cols-[56px_1fr] divide-x divide-border/20 ${i < 4 ? "border-b border-border/20" : ""}`}>
                  <div className="flex items-start justify-center pt-5 text-[11px] font-mono text-muted-foreground/30">
                    {step}
                  </div>
                  <div className="px-6 py-4">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-primary/55">{actor}</span>
                      <span className="text-[13.5px] font-medium text-foreground/82">{action}</span>
                    </div>
                    {code ? (
                      <code className="text-[11.5px] font-mono text-muted-foreground/50 bg-card/40 px-2.5 py-1.5 block leading-relaxed border border-border/20">{detail}</code>
                    ) : (
                      <p className="text-[13px] text-muted-foreground/55 leading-[1.78]">{detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Integration modes */}
          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
          >
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/40 mb-5">Integration modes</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "SDK",
                  desc: "Wrap any credential request with the SecretsAPI client. Available for Python and TypeScript. Go support in progress.",
                  note: "Recommended for new agent deployments",
                },
                {
                  title: "Network proxy",
                  desc: "Route outbound requests from existing workloads through the SecretsAPI proxy. No code changes required. Credentials are intercepted and brokered at the network layer.",
                  note: "Recommended for existing deployments",
                },
              ].map(({ title, desc, note }) => (
                <div key={title} className="border border-border/30 p-5 bg-card/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13.5px] font-semibold text-foreground/85 tracking-tight">{title}</span>
                    <span className="text-[10.5px] font-mono text-muted-foreground/40">{note}</span>
                  </div>
                  <p className="text-[13px] text-muted-foreground/60 leading-[1.76]">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Deployment Scenarios ─────────────────────────────────── */}
      <section className="py-20 px-6 border-b border-border/25 bg-card/[0.07]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Deployment scenarios</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              Five operational contexts where raw credential exposure creates material risk.
            </h2>
          </motion.div>

          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="grid md:grid-cols-2 gap-px bg-border/20 border border-border/25 overflow-hidden"
          >
            {[
              {
                category: "Payments / Stripe",
                title: "AI agent holds the master key to every Stripe operation it doesn't need",
                uncontrolled: "Agent configured with sk_live_... can read charges — but also create refunds, modify customers, and trigger payouts. A prompt injection or logic error that reaches a refund call executes against real accounts.",
                controlled: "Agent receives a 120-second token scoped to charges:read for the requested customer ID. No other operation is in scope. The Stripe secret key never leaves the vault.",
              },
              {
                category: "Database / PostgreSQL",
                title: "Schema migration agent connects with a credential that can drop tables it never touches",
                uncontrolled: "Migration workload holds a connection string with full schema access. A logic error, missing WHERE clause, or misconfigured migration script can run destructive queries — DROP TABLE, UPDATE without condition, cascading DELETE.",
                controlled: "Workload receives a 90-second write token scoped to the target schema and migration operation. No other tables are in scope. Token expires before the connection can be reused for anything else.",
              },
              {
                category: "Cloud / AWS IAM",
                title: "Deployment agent holds a persistent access key between runs",
                uncontrolled: "CI/CD agent is configured with an IAM access key that can assume multiple roles. Between deployments the key sits in environment variables — valid, reusable, and readable by any process in the container.",
                controlled: "Agent requests an STS-brokered role assumption token scoped to the specific deployment role, bounded to the deployment window. The IAM access key never leaves the vault.",
              },
              {
                category: "CRM / Account Operations",
                title: "Operations agent can mass-modify customer accounts without any approval gate",
                uncontrolled: "Automation agent with CRM write access can process tier changes, cancellations, and credit adjustments at scale — without operator review. A misconfigured run modifies thousands of accounts before anyone notices.",
                controlled: "Account mutations above a configurable risk threshold — by account tier, action type, or volume — are held and routed to an operator queue before a credential is issued. No action executes until the hold resolves.",
              },
              {
                category: "API Integration / Outbound",
                title: "OpenAI, Slack, and GitHub credentials injected as env vars are reachable by every process in the container",
                uncontrolled: "Persistent API keys stored as environment variables are accessible to any process in the runtime — including dependencies and supply chain code. A single compromise reaches all three integrations simultaneously.",
                controlled: "Each workload requests per-call tokens scoped to the specific operation: openai:completions, slack:messages:write, github:repo:read. No persistent secret exists in the runtime environment.",
              },
            ].map(({ category, title, uncontrolled, controlled }, i) => (
              <motion.div
                key={category}
                variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 2}
                className="bg-background p-6 flex flex-col gap-4"
              >
                <div>
                  <p className="text-[10.5px] font-mono text-primary/50 uppercase tracking-[0.12em] mb-2">{category}</p>
                  <p className="text-[13.5px] font-medium text-foreground/80 leading-snug">{title}</p>
                </div>
                <div className="space-y-2.5 pt-1 border-t border-border/15">
                  <div className="grid grid-cols-[14px_1fr] gap-2.5 items-start">
                    <span className="font-mono text-red-400/60 text-[11px] mt-[1px] shrink-0">×</span>
                    <p className="text-[12.5px] text-muted-foreground/50 leading-[1.72]">{uncontrolled}</p>
                  </div>
                  <div className="grid grid-cols-[14px_1fr] gap-2.5 items-start">
                    <span className="font-mono text-emerald-400/60 text-[11px] mt-[1px] shrink-0">→</span>
                    <p className="text-[12.5px] text-foreground/65 leading-[1.72]">{controlled}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Specification ────────────────────────────────────────── */}
      <section id="specification" className="py-20 px-6 border-b border-border/25 bg-card/[0.07]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Specification</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              Access control properties
            </h2>
          </motion.div>

          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="grid lg:grid-cols-2 gap-px bg-border/20 border border-border/30 overflow-hidden"
          >
            {[
              {
                prop: "Token scoping",
                value: "Resource pattern + operation allowlist + optional context constraints (customer_id, account, region, tag). Scope is specified at request time, bounded by policy ceiling.",
              },
              {
                prop: "Policy language",
                value: "JSON policy documents per principal. Supports resource glob patterns, operation arrays, time-of-day windows, IP CIDR constraints, and context key/value conditions.",
              },
              {
                prop: "Token format",
                value: "Signed JWT (RS256). Contains principal identity, granted scope, expiry, resource, and audit event ID. Verifiable by receiving system without calling SecretsAPI.",
              },
              {
                prop: "Vault encryption",
                value: "Secrets stored with AES-256-GCM and envelope encryption. Master keys managed by your KMS (AWS KMS, GCP KMS, or HashiCorp Vault). SecretsAPI never holds plaintext.",
              },
              {
                prop: "Approval workflow",
                value: "Requests exceeding risk threshold are held — not denied. Routed to operators via webhook, Slack, or PagerDuty. Configurable timeout. Unexpired holds are queued, not dropped.",
              },
              {
                prop: "Connectors",
                value: "Native connectors: Stripe, AWS (IAM, S3, RDS), PostgreSQL, OpenAI, Slack, GitHub. Generic connector handles any credential type not on the native list.",
              },
              {
                prop: "Token revocation",
                value: "TTL expiry is the primary mechanism. Manual revocation available per-token or per-principal. Revocation propagates to all receiving systems within one TTL cycle.",
              },
              {
                prop: "Audit log retention",
                value: "Configurable, default 365 days. Log is append-only, HMAC-SHA256 signed per entry. Exportable to S3, GCS, or Azure Blob. Tamper detection on read.",
              },
            ].map(({ prop, value }, i) => (
              <motion.div
                key={prop}
                variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 2}
                className="bg-background/60 p-6"
              >
                <p className="text-[11.5px] font-mono uppercase tracking-[0.1em] text-muted-foreground/45 mb-2.5">{prop}</p>
                <p className="text-[13.5px] text-foreground/70 leading-[1.76]">{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Connectors & Deployment ──────────────────────────────── */}
      <section className="py-20 px-6 border-b border-border/25">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">

            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">System connectors</p>
              <div className="border border-border/30 overflow-hidden text-[12.5px]">
                {[
                  { sys: "Stripe", creds: "Secret key, restricted key, webhook secret", ops: "read, write, webhook" },
                  { sys: "AWS", creds: "IAM access key, role ARN (STS)", ops: "assume-role, s3, rds, ec2" },
                  { sys: "PostgreSQL", creds: "Connection string, SSL certificate", ops: "read, write, schema-read" },
                  { sys: "OpenAI", creds: "API key, organization key", ops: "completions, embeddings, files" },
                  { sys: "Slack", creds: "Bot token, OAuth token", ops: "messages:write, channels:read" },
                  { sys: "GitHub", creds: "PAT, GitHub App installation token", ops: "repo:read, repo:write, actions" },
                  { sys: "Generic", creds: "Arbitrary key/value secret", ops: "read, rotate" },
                ].map(({ sys, creds, ops }, i) => (
                  <div key={sys} className={`grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr_120px] ${i < 6 ? "border-b border-border/20" : ""}`}>
                    <div className="px-3 py-2.5 font-medium text-foreground/70 border-r border-border/20">{sys}</div>
                    <div className="px-3 py-2.5 text-muted-foreground/50 leading-snug sm:border-r sm:border-border/20">{creds}</div>
                    <div className="hidden sm:block px-3 py-2.5 font-mono text-muted-foreground/40 text-[11px]">{ops}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
              <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Deployment</p>
              <div className="border border-border/30 overflow-hidden text-[13px] mb-6">
                {[
                  { label: "Architecture", value: "Single-tenant. No credential data traverses shared infrastructure." },
                  { label: "Deployment target", value: "Customer VPC (AWS, GCP, Azure). Managed cloud available." },
                  { label: "Connectivity", value: "Private link. No public endpoint required." },
                  { label: "High availability", value: "Active-active, two availability zones minimum." },
                  { label: "Data residency", value: "Configurable. EU, US, APAC regions available." },
                  { label: "Time to production", value: "2–4 weeks from contract execution." },
                ].map(({ label, value }, i) => (
                  <div key={label} className={`grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] divide-x divide-border/20 ${i < 5 ? "border-b border-border/20" : ""}`}>
                    <div className="px-4 py-3 text-muted-foreground/50 font-mono uppercase tracking-[0.07em] text-[10.5px] flex items-center">{label}</div>
                    <div className="px-4 py-3 text-foreground/68 leading-snug">{value}</div>
                  </div>
                ))}
              </div>
              <p className="text-[12px] font-mono text-muted-foreground/38">
                Architecture diagram and data flow documentation available under NDA on request.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── Compliance ───────────────────────────────────────────── */}
      <section id="compliance" className="py-20 px-6 border-b border-border/25 bg-card/[0.07]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-10">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Compliance &amp; security</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              Every credential access event is an evidence record.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/60 max-w-xl leading-[1.82]">
              When an AI agent calls a payments API, queries a production database, or assumes a cloud IAM role, that access event may need to be reported to a regulator, reviewed by a security team, or reconstructed during an incident. SecretsAPI logs every privileged access request — whether it was granted, denied, or held for operator approval.
            </p>
          </motion.div>

          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="border border-border/30 overflow-hidden text-[13px] mb-8"
          >
            {[
              {
                prop: "SOC 2 orientation",
                value: "Audit log and access control architecture designed to produce evidence for SOC 2 Type II access control requirements. No vendor certification is claimed — the design intent is to make your audit defensible.",
              },
              {
                prop: "Audit log integrity",
                value: "HMAC-SHA256 signed per entry at write time. Signature chain detectable on read. Modification to any historical entry invalidates the chain from that point forward.",
              },
              {
                prop: "Secret encryption",
                value: "AES-256-GCM at rest with envelope encryption. Customer-managed keys via AWS KMS, GCP KMS, or HashiCorp Vault. SecretsAPI never holds plaintext credential values.",
              },
              {
                prop: "Access pattern alerting",
                value: "Requests deviating from a principal's established access pattern — unfamiliar resources, unusually broad scopes, off-hours activity — can be configured to trigger alerts or automatic approval holds.",
              },
            ].map(({ prop, value }, i) => (
              <div key={prop} className={`grid grid-cols-1 sm:grid-cols-[180px_1fr] ${i < 3 ? "border-b border-border/20" : ""}`}>
                <div className="px-5 pt-4 pb-1 sm:py-4 text-muted-foreground/55 font-medium text-[12.5px] flex items-start sm:border-r sm:border-border/20">{prop}</div>
                <div className="px-5 pt-1 pb-4 sm:py-4 text-foreground/68 leading-[1.76]">{value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
            className="grid md:grid-cols-3 gap-4 text-[12.5px]"
          >
            {[
              { label: "Log format", value: "JSON, HMAC-SHA256 signed" },
              { label: "Log retention default", value: "365 days, configurable" },
              { label: "Key management", value: "Customer-managed (BYOK)" },
              { label: "Network isolation", value: "VPC + private link" },
              { label: "Encryption at rest", value: "AES-256-GCM" },
              { label: "Token signing", value: "RS256 JWT" },
            ].map(({ label, value }) => (
              <div key={label} className="border border-border/25 px-4 py-3 bg-card/[0.05] flex justify-between items-center">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-muted-foreground/45">{label}</span>
                <span className="text-foreground/65 font-mono text-[11px]">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Built for Controlled Access ─────────────────────────── */}
      <section className="py-20 px-6 border-b border-border/25">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Access properties</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              Built for controlled access.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/60 max-w-xl leading-[1.82]">
              Six properties that define how SecretsAPI handles credential access. Each is a deliberate design constraint, not a configuration toggle.
            </p>
          </motion.div>

          <motion.div
            variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-border/20 border border-border/25 overflow-hidden rounded-sm"
          >
            {[
              {
                term: "Ephemeral credential issuance",
                desc: "No issued token survives its task. TTL is set at issuance and encoded in the token itself. After expiry the token is cryptographically invalid — it cannot be renewed, replayed, or extended.",
                note: "TTL range: 15s – 86400s",
              },
              {
                term: "Scoped token access",
                desc: "Each token carries exactly the operation and resource it was issued for. A token for charges:read cannot be used for refunds:create. Scope is part of the token structure, not a server-side lookup.",
                note: "Scope: resource pattern + operation set",
              },
              {
                term: "Policy-enforced permissions",
                desc: "Access decisions happen at request time against a per-principal policy document. There is no ambient permission state — every request is evaluated from the current policy on every call.",
                note: "Evaluated per request · not at deployment",
              },
              {
                term: "Audit trails for privileged actions",
                desc: "Every access event — granted, denied, or held for approval — produces an HMAC-SHA256 signed log entry with principal identity, resource, requested scope, verdict, and ISO 8601 timestamp. The log is append-only.",
                note: "HMAC-SHA256 · append-only · 365-day retention",
              },
              {
                term: "Approval thresholds for sensitive systems",
                desc: "Requests exceeding a configurable risk threshold — by resource sensitivity, scope breadth, or principal identity — are held and routed to an operator queue before any token is issued. No credential is released until the request is approved.",
                note: "Configurable per resource · webhook or review queue",
              },
              {
                term: "Secret isolation from agent runtime",
                desc: "Credentials reside only in the vault. The requesting workload receives a signed short-lived token that proves temporary authorization — never the raw credential value. There is no path to exfiltrate the underlying secret.",
                note: "No raw credential in workload memory or env",
              },
            ].map(({ term, desc, note }, i) => (
              <motion.div
                key={term}
                variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 3}
                className="bg-background px-6 py-7 flex flex-col gap-3"
              >
                <p className="text-[11px] font-mono uppercase tracking-[0.13em] text-primary/55">{term}</p>
                <p className="text-[13px] text-muted-foreground/65 leading-[1.80] flex-1">{desc}</p>
                <p className="text-[10.5px] font-mono text-muted-foreground/35 pt-1 border-t border-border/15">{note}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Strategic Acquisition ────────────────────────────────── */}
      <section id="acquisition" className="py-24 px-6 border-b border-primary/12 bg-card/[0.10]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-14">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Strategic access</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] leading-[1.14] mb-4 text-foreground/92">
              Available for direct acquisition.
            </h2>
            <p className="text-[14.5px] text-muted-foreground/60 max-w-xl leading-[1.82]">
              SecretsAPI is available for direct acquisition and enterprise deployment. Access is selective. Structured transfer terms are disclosed after a technical evaluation — not before.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10">

            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="border border-border/30 overflow-hidden mb-7 text-[13px]">
                {[
                  { label: "Availability", value: "Available for direct acquisition" },
                  { label: "Access model", value: "Private access — selective strategic conversations" },
                  { label: "Commercial terms", value: "Structured transfer. Disclosed after technical evaluation." },
                  { label: "Deployment model", value: "Customer VPC, private link, or managed cloud" },
                  { label: "Conversation model", value: "Technical evaluation before any commercial discussion" },
                  { label: "Timeline", value: "2–4 weeks contract to production" },
                ].map(({ label, value }, i) => (
                  <div key={label} className={`grid grid-cols-[180px_1fr] divide-x divide-border/20 ${i < 5 ? "border-b border-border/20" : ""}`}>
                    <div className="px-4 py-3 text-muted-foreground/50 font-mono uppercase tracking-[0.07em] text-[10.5px] flex items-center">{label}</div>
                    <div className="px-4 py-3 text-foreground/68">{value}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  "Structured transfer · no public commercial terms",
                  "Selective strategic conversations — not every inquiry proceeds",
                  "Direct acquisition · private access · no intermediary",
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="font-mono text-primary/40 text-[10px] mt-px shrink-0">—</span>
                    <span className="text-[12.5px] text-muted-foreground/55">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
              <div className="border border-primary/20 bg-primary/[0.035] p-7">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-primary/55">Private access</span>
                  <span className="text-[10.5px] font-mono text-muted-foreground/35">secretsapi.com</span>
                </div>
                <h3 className="text-[19px] font-bold tracking-tight text-foreground/90 leading-snug mb-3">
                  Begin a strategic access discussion
                </h3>
                <p className="text-[13.5px] text-muted-foreground/60 leading-[1.78] mb-7">
                  You'll speak with the engineering and deployment team directly. No sales motion. No NDA required to begin. The first conversation is technical: your workload deployment, which production systems your agents reach, and what credential exposure represents to your organization.
                </p>

                <div className="space-y-2.5 mb-7">
                  <Button className="w-full rounded-[3px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-[13px]">
                    Begin a strategic access discussion <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                  <Button variant="outline" className="w-full rounded-[3px] font-medium border-border/40 text-muted-foreground/70 hover:text-foreground/80 hover:bg-card/40 h-10 text-[13px]">
                    Request a technical evaluation
                  </Button>
                </div>

                <div className="border-t border-border/20 pt-5 space-y-2">
                  {[
                    "VPC deployment — no shared credential infrastructure",
                    "Engineering team engaged from day one",
                    "No commercial commitment to begin evaluation",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="font-mono text-primary/45 text-[10px] mt-px shrink-0">✓</span>
                      <span className="text-[12px] text-muted-foreground/55">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 px-6 border-b border-border/25">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">FAQ</p>
            <h2 className="text-[clamp(1.4rem,2.8vw,2.1rem)] font-bold tracking-[-0.02em] text-foreground/92">Common questions</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-x-14">
            {[
              {
                q: "What is SecretsAPI?",
                a: "SecretsAPI is a credential access brokering layer for autonomous workloads and service principals. It issues scoped, time-limited tokens against stored credentials — without ever transmitting raw credential values to the requesting workload.",
              },
              {
                q: "How is this different from a secrets manager like Vault or AWS Secrets Manager?",
                a: "Secrets managers store credentials and provide retrieval APIs. The workload still receives the raw credential. SecretsAPI is an access control layer on top of storage: the workload never gets the credential — only a scoped token that proves temporary authorization to a specific operation.",
              },
              {
                q: "What happens if an agent is compromised?",
                a: "The blast radius is bounded to whatever token the workload currently holds — a 120-second charges:read token for a specific customer, not the Stripe master key. When the token expires, access ends. There is no persistent credential to exfiltrate. All further access requests from the compromised principal are blocked immediately on revocation. The audit log provides a full reconstruction: every resource requested, every scope granted, every system reached.",
              },
              {
                q: "Can we use SecretsAPI without modifying existing agent code?",
                a: "Yes. The network proxy mode intercepts outbound requests from existing workloads and brokers credentials at the network layer. No code changes to the agent or automation system are required.",
              },
              {
                q: "What credential types are supported?",
                a: "API keys, OAuth tokens, database credentials (PostgreSQL, MySQL), AWS IAM (access keys and role assumption via STS), and arbitrary key/value secrets. Native connectors for Stripe, AWS, PostgreSQL, OpenAI, Slack, and GitHub.",
              },
              {
                q: "How does policy evaluation work?",
                a: "Each service principal has a policy document defining allowed resources, operations, and optional constraints (customer_id, account, region). Policies are evaluated at request time against the requested resource pattern and scope. There is no per-deployment or startup-time evaluation — policy is enforced on every access request.",
              },
              {
                q: "What does the audit log contain?",
                a: "One entry per access event, regardless of verdict. Each entry contains: principal identity, requested resource, requested scope, policy evaluation outcome, granted scope (if applicable), token expiry, and ISO 8601 timestamp. Entries are HMAC-SHA256 signed at write time.",
              },
              {
                q: "Who is SecretsAPI built for?",
                a: "Engineering and security teams running AI agents or automation that touches production systems. Concretely: a billing agent that calls Stripe but should not hold the master key; a data pipeline that reads from PostgreSQL but should not have write access; a deployment workload that assumes an AWS role but should not retain it between runs; an ops agent that can query infrastructure but must not be able to modify it. Any context where issuing a permanent credential to an autonomous process creates unacceptable access surface.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i % 2}
                className="border-t border-border/25 py-6"
              >
                <h3 className="font-semibold text-[14.5px] tracking-tight text-foreground/85 mb-2.5">{item.q}</h3>
                <p className="text-[13.5px] text-muted-foreground/60 leading-[1.8]">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────────────────── */}
      <section className="py-24 px-6 border-t border-primary/12">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fade} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="grid lg:grid-cols-[1fr_380px] gap-14 xl:gap-20">

              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground/45 mb-6">Acquisition pathway</p>
                <h2 className="text-[clamp(1.75rem,3.8vw,3rem)] font-bold tracking-[-0.028em] leading-[1.08] mb-5 text-foreground/92">
                  This is infrastructure acquisition,<br />not a product signup.
                </h2>
                <p className="text-[15px] text-muted-foreground/60 leading-[1.82] mb-9 max-w-lg">
                  SecretsAPI is scoped, deployed, and operated by your security and engineering teams. It runs inside your VPC. First contact to production typically takes 2–4 weeks.
                </p>

                <div className="border border-border/30 overflow-hidden mb-9">
                  {[
                    {
                      n: "01",
                      title: "Technical evaluation",
                      desc: "You describe your workload deployment — which systems your agents reach and what a credential exposure event costs your organization."
                    },
                    {
                      n: "02",
                      title: "Implementation scoping",
                      desc: "Connector selection, policy configuration, audit log retention, and approval workflow design defined against your compliance requirements."
                    },
                    {
                      n: "03",
                      title: "VPC deployment",
                      desc: "Production deployment inside your infrastructure. No multi-tenant credential routing. 2–4 weeks from contract execution."
                    },
                  ].map(({ n, title, desc }, i) => (
                    <div key={n} className={`grid grid-cols-[48px_1fr] divide-x divide-border/20 ${i < 2 ? "border-b border-border/20" : ""}`}>
                      <div className="flex items-start justify-center pt-5 text-[11px] font-mono text-muted-foreground/30">{n}</div>
                      <div className="px-5 py-4">
                        <p className="text-[13.5px] font-medium text-foreground/80 mb-1">{title}</p>
                        <p className="text-[13px] text-muted-foreground/55 leading-[1.74]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11.5px] font-mono text-muted-foreground/38">
                  No NDA required to begin. Implementation is scoped before any commercial commitment.
                </p>
              </div>

              <div className="lg:pt-[4rem]">
                <div className="border border-primary/18 bg-primary/[0.03] p-7">
                  <p className="text-[10.5px] font-mono uppercase tracking-[0.16em] text-primary/50 mb-5">Private access</p>
                  <h3 className="text-[18px] font-bold tracking-tight text-foreground/88 leading-snug mb-3">
                    Request a technical evaluation
                  </h3>
                  <p className="text-[13px] text-muted-foreground/55 leading-[1.76] mb-7">
                    No sales motion. No NDA required up front. The first conversation covers your agent deployment and what controlled credential access would look like in your infrastructure.
                  </p>

                  <div className="space-y-2.5 mb-7">
                    <Button className="w-full rounded-[3px] font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 text-[13px]">
                      Request technical evaluation <ArrowRight className="w-3 h-3 ml-1.5" />
                    </Button>
                    <Button variant="outline" className="w-full rounded-[3px] font-medium border-border/35 text-muted-foreground/60 hover:text-foreground/80 hover:bg-card/40 h-10 text-[13px]">
                      Discuss enterprise deployment
                    </Button>
                  </div>

                  <div className="border-t border-border/20 pt-5 space-y-2">
                    {[
                      "VPC deployment — no shared infrastructure",
                      "Engineering team involved from day one",
                      "2–4 weeks from contract to production",
                    ].map(item => (
                      <div key={item} className="flex items-start gap-2.5">
                        <span className="font-mono text-primary/40 text-[10px] mt-px shrink-0">✓</span>
                        <span className="text-[12px] text-muted-foreground/52">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/25 py-8 px-6 bg-card/[0.06]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border border-primary/20 bg-primary/[0.07] flex items-center justify-center rounded-[3px]">
              <KeyRound className="w-2.5 h-2.5 text-primary/65" />
            </div>
            <span className="font-semibold text-[12.5px] tracking-tight text-foreground/70">SecretsAPI</span>
            <span className="font-mono text-[10.5px] text-muted-foreground/38 ml-2">Credential access infrastructure</span>
          </div>
          <nav className="flex items-center gap-5 text-[12.5px] text-muted-foreground/45">
            {["Security", "Privacy", "Terms"].map(link => (
              <a key={link} href="#" className="hover:text-foreground/70 transition-colors duration-150">{link}</a>
            ))}
          </nav>
          <p className="text-[11px] font-mono text-muted-foreground/32">
            © {new Date().getFullYear()} SecretsAPI, Inc.
          </p>
        </div>
      </footer>

    </div>
  );
}
