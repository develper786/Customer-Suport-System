# Customer Support Management System

## Problem

A business needs a better way to manage customer emails — reducing manual effort, speeding up response times, and ensuring no ticket falls through the cracks.

---

## Solution Overview

Customers send emails to a support address. The system ingests them via webhook, converts them into tracked tickets, uses AI to categorize and auto-respond where possible, and routes unresolved tickets to the admin for manual handling. A dashboard provides real-time metrics on performance.

**Access model:**

- **Admin (single user)** — full access to the web application: manages tickets, reviews AI responses, replies to customers, configures the knowledge base, and views the dashboard
- **Customers** — no system access; interact exclusively via email

---

## Security & Authentication

### Authentication

- Single admin account — credentials stored securely (hashed password, no plain-text storage)
- Login via username + password
- Session-based or JWT authentication with a defined expiry (e.g. 8 hours inactivity logout)
- Optional: TOTP-based two-factor authentication (2FA) for the admin account

### Authorization

- Since there is only one user role (admin), all authenticated requests have full access
- All routes/API endpoints are protected — unauthenticated requests are rejected with 401

### Transport Security

- All traffic over HTTPS (TLS)
- Webhook endpoint validates a shared secret / HMAC signature from the email provider to prevent spoofed ingestion requests

### Input Security

- All inbound email content is treated as untrusted input
- HTML email bodies are sanitized before storage and display to prevent XSS
- Email attachments are type-checked and size-limited; not executed server-side

### Data Security

- Customer email content and PII stored only as needed for support operations
- Sensitive config (API keys, DB credentials, webhook secrets) stored in environment variables, never in source code
- Database access restricted to the application service only (no public exposure)

### Audit & Session

- Login/logout events logged with timestamp and IP
- Failed login attempts rate-limited to prevent brute force
- Admin session invalidated on password change

---

## Email Ingestion

- **Webhook-based ingestion** — inbound email provider (e.g. SendGrid, Mailgun, Postmark) forwards emails as HTTP POST to the app
- Webhook endpoint validates HMAC signature before processing
- Each incoming email is parsed for: sender address, subject, body, attachments, message-id, in-reply-to headers
- **Thread detection** — `In-Reply-To` / `References` headers checked against existing tickets; matching emails are appended to the existing ticket as a reply, not a new ticket
- **Spam/abuse filtering** — before ticket creation:
  - Check sender against a blocklist
  - Score email content (keyword patterns, link density, sender reputation)
  - Emails above spam threshold are flagged and quarantined, not converted to tickets
  - Admin can review quarantine and unblock legitimate senders

---

## Ticket Creation

- A ticket is created for every non-spam, non-duplicate inbound email
- Each ticket stores:
  - Unique ticket ID
  - Customer email address
  - Subject and original message body
  - Thread of all replies (customer and AI/admin)
  - Category (set by AI or manually overridden by admin)
  - Status and priority
  - Timestamps: created, first response, last updated, resolved

---

## Ticket Lifecycle

### Statuses

| Status | Description |

|---|---|
| `open` | Newly created, awaiting first action |
| `pending` | AI auto-response sent, awaiting customer reply |
| `work-in-progress` | Admin has claimed and is actively handling |
| `resolved` | Marked resolved by admin or auto-resolved after no reply |
| `closed` | Permanently closed |

### Transitions

```open
 ├─► pending            (AI responds automatically)
 │     ├─► resolved     (no customer follow-up after N days)
 │     └─► work-in-progress  (AI confidence low OR admin claims it)
 ├─► work-in-progress   (admin manually claims ticket)
 │     └─► resolved
 └─► resolved           (direct resolution)

resolved ──► open       (customer replies to resolved ticket — reopens it)
resolved ──► closed     (admin permanently closes)
```

### AI Handoff to Admin

AI hands off (sets status to `work-in-progress`) when:

- AI confidence score is below a configured threshold
- Category is flagged as requiring human judgment (billing disputes, complaints, legal, etc.)
- Customer explicitly asks to speak to a human
- Customer replies to an AI response with dissatisfaction signals
- Ticket has exceeded its SLA window without resolution

---

## AI Layer

### Categorization

- Incoming email is classified into categories (e.g. Billing, Technical, General Inquiry, Complaint, Refund)
- Category stored on the ticket; used for routing decisions and dashboard reporting

### Auto-Response

- AI agent queries the knowledge base to generate a reply
- Response is sent as an email and logged as a thread entry on the ticket
- Confidence score computed — low-confidence responses are held in `pending` for admin review before sending
- Admin can edit, approve, or discard a held AI response

### Knowledge Base

- Admin uploads a PDF or Word document as the knowledge base
- AI uses the uploaded document to generate responses
- One active document at a time; uploading a new one replaces the previous

---

## Admin Interface

- Single-user web application, login-protected
- **Ticket queue** — list of all tickets filterable by status, category, and date
- **Ticket detail** — full email thread inline, status controls, reply composer, category override, spam flag
- **Reply flow** — admin composes reply in the app; it is sent as an email to the customer and logged in the thread
- **AI review queue** — held AI responses awaiting admin approval before sending
- **Knowledge base management** — CRUD interface for KB articles
- **Spam quarantine** — list of quarantined emails; admin can release or permanently block sender
- **Dashboard** — metrics and reporting (see below)

---

## Metrics & Reporting Dashboard

### Ticket Volume

- Total tickets created (daily / weekly / monthly)
- Tickets by category
- Tickets by status (live count + trend over time)

### Response Time Buckets

- First response time distribution: < 1h, 1–4h, 4–8h, 8–24h, > 24h
- Average and median first response time
- AI-handled vs admin-handled breakdown

### Resolution

- Resolution rate (% resolved within SLA)
- Average and median time to resolution
- Reopened ticket rate

### Spam & Abuse

- Emails blocked daily by spam filter
- Quarantine review rate

---

## Implementation Phases

### Phase 1 — Foundation & Auth

- Project scaffold (folder structure, environment config, database setup)
- Admin authentication: login, session management, logout, route protection
- Basic admin UI shell (layout, navigation, login page)

### Phase 2 — Email Ingestion & Ticket Creation

- Webhook endpoint with HMAC signature validation
- Email parsing (sender, subject, body, headers)
- Thread detection via `In-Reply-To` / `References`
- Spam/blocklist filtering and quarantine queue
- Ticket creation and storage

### Phase 3 — Ticket Lifecycle & Admin Ticket

Management

- Ticket status model and transitions
- Ticket queue view (filterable list)
- Ticket detail view with full thread display
- Admin reply (sends email + logs to thread)
- Manual status changes and category override
- Spam quarantine management UI

### Phase 4 — AI Layer

- Knowledge base CRUD (admin interface + storage)
- AI categorization on ticket creation
- AI auto-response generation from KB
- Confidence scoring and held-response review queue
- AI-to-admin handoff logic

### Phase 5 — Metrics Dashboard

- Data aggregation for ticket volume, response times, resolution rates
- Response time bucket charts
- Live status distribution chart
- Spam filter stats

### Phase 6 — Security Hardening & Polish

- 2FA for admin login (optional)
- Rate limiting on login and webhook endpoints
- Full input sanitization audit (XSS, injection)
- Audit log (login events, ticket actions)
- End-to-end testing and bug fixes

---

## API Design

All endpoints are prefixed with `/api`. All routes except `/api/auth/login` and `/webhook/inbound-email` require a valid admin session.

### Authentication

| Method | Endpoint | Description |

|---|---|---|
| `POST` | `/api/auth/login` | Admin login (username + password) |
| `POST` | `/api/auth/logout` | Invalidate current session |
| `GET` | `/api/auth/me` | Return current session info |

### Webhook

| Method | Endpoint | Description |

|---|---|---|
| `POST` | `/webhook/inbound-email` | Inbound email from provider (HMAC validated) |

### Tickets

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/tickets` | List tickets — filterable by `status`, `category`, `date_from`, `date_to` |
| `GET` | `/api/tickets/:id` | Get ticket detail including full reply thread |
| `PATCH` | `/api/tickets/:id` | Update ticket (`status`, `category`, `priority`) |
| `POST` | `/api/tickets/:id/reply` | Send a reply email to customer and log in thread |
| `POST` | `/api/tickets/:id/claim` | Claim ticket (sets status to `work-in-progress`) |
| `POST` | `/api/tickets/:id/close` | Permanently close a ticket |
| `POST` | `/api/tickets/:id/spam` | Mark ticket as spam and block sender |

### AI Review Queue

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/ai-queue` | List held AI responses awaiting admin review |
| `POST` | `/api/ai-queue/:id/approve` | Approve and send the held AI response |
| `PATCH` | `/api/ai-queue/:id` | Edit the AI response body before approving |
| `POST` | `/api/ai-queue/:id/discard` | Discard the held AI response (ticket moves to `work-in-progress`) |

### Knowledge Base

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/kb` | List all KB articles |
| `POST` | `/api/kb` | Create a new KB article |
| `GET` | `/api/kb/:id` | Get a single KB article |
| `PUT` | `/api/kb/:id` | Update a KB article |
| `DELETE` | `/api/kb/:id` | Retire (soft-delete) a KB article |

### Spam Quarantine

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/quarantine` | List quarantined emails |
| `POST` | `/api/quarantine/:id/release` | Release as a new ticket |
| `POST` | `/api/quarantine/:id/block` | Permanently block sender |

### Blocklist

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/blocklist` | List blocked senders |
| `POST` | `/api/blocklist` | Manually add a sender to the blocklist |
| `DELETE` | `/api/blocklist/:id` | Remove a sender from the blocklist |

### Metrics & Dashboard

| Method | Endpoint | Description |

|---|---|---|
| `GET` | `/api/metrics/overview` | Summary counts: total, open, pending, WIP, resolved, closed |
| `GET` | `/api/metrics/volume` | Ticket volume over time (accepts `period`: day/week/month) |
| `GET` | `/api/metrics/response-times` | First response time bucket distribution |
| `GET` | `/api/metrics/resolution` | Resolution rate, avg/median time to resolve, reopened rate |
| `GET` | `/api/metrics/spam` | Spam blocked count and quarantine review rate |

---

## Data Flow

### Inbound Email → Ticket Creation

```Customer sends email
        │
        ▼ HTTP POST (webhook)
App receives inbound webhook
        │
        ├─► HMAC signature invalid? ──► Reject 401, log, stop
        │
        ▼ valid
Deduplicate on message-id
        │
        ├─► Already processed? ──► Return 200, stop (no duplicate ticket)
        │
        ▼ new email
Check In-Reply-To / References headers
        │
        ├─► Matches existing ticket? ──► Append reply to thread
        │                                        │
        │                               Customer reply on resolved ticket?
        │                                 ├─► Yes → reopen (resolved → open)
        │                                 └─► No  → append only, done
        │
        ▼ no match (new conversation)
Spam / blocklist check
        │
        ├─► Sender on blocklist? ──────────────┐
        ├─► Spam score above threshold? ───────┴──► Quarantine, stop
        ├─► Spam check failed? ──► Create ticket flagged "spam check skipped"
        │
        ▼ clean
Create ticket (status: open)
```

### Ticket → AI Processing

```Ticket created (status: open)
        │
        ▼
AI categorization
        │
        ├─► LLM unavailable? ──► Category = "uncategorized", stay open, dashboard warning
        │
        ▼ categorized
Category requires human? (billing, legal, complaint)
        │
        ├─► Yes ──► status: work-in-progress
        │
        ▼ No — eligible for auto-response
AI queries knowledge base and generates response
        │
        ├─► LLM unavailable? ──► Skip auto-response, ticket stays open
        │
        ▼ response generated
Confidence score check
        │
        ├─► Low confidence ──► Hold in AI review queue (status: pending, send blocked)
        │                               │
        │                        Admin: Edit / Approve / Discard
        │                               │
        │                    ┌──────────┴──────────┐
        │                 Approve                Discard
        │                    │                      │
        │              Send email         status: work-in-progress
        │
        ▼ High confidence
Send auto-response email to customer
        │
        ├─► Email send fails? ──► Hold in review queue, mark "send failed", admin retries
        │
        ▼ sent
Log reply in thread, status: pending
```

### Pending / Work-in-Progress → Resolution

```Ticket in pending
        │
        ├─► Customer replies
        │         │
        │   Dissatisfaction signal?
        │     ├─► Yes ──► status: work-in-progress
        │     └─► No  ──► stay pending
        │
        ├─► No reply after N days ──► status: resolved (auto-close)
        └─► Admin claims ticket  ──► status: work-in-progress

Ticket in work-in-progress
        │
        ▼
Admin composes reply in UI → App sends email to customer
        │
        ├─► Send fails? ──► Surface error in UI, allow retry
        │
        ▼ sent
Log reply in thread
        │
        ▼
Admin marks resolved ──► status: resolved
        │
        └─► Admin permanently closes ──► status: closed
```

---

## Error Handling Strategy

Failures are grouped by system boundary. Each scenario defines the fallback behavior, what gets logged, and what the admin sees.

### Webhook / Email Ingestion

| Failure | Behavior |

|---|---|
| Provider cannot reach webhook (server down, timeout) | Provider retries automatically; system deduplicates on `message-id` to prevent duplicate tickets |
| HMAC signature validation fails | Reject with `401`, log attempt with source IP, do not create ticket |
| Email body malformed / unparseable | Log error, create ticket with raw body preserved, flag ticket for admin review |

### Spam Filter

| Failure | Behavior |

|---|---|
| Spam scoring unavailable | Fail open — treat email as legitimate, create ticket, mark with "spam check skipped" badge visible to admin |

### Thread Detection

| Failure | Behavior |

|---|---|
| `In-Reply-To` present but no matching ticket found | Create a new ticket (treat as new conversation) |
| Duplicate webhook delivery (same `message-id` already processed) | Silently deduplicate, return `200` to provider — no second ticket created |

### AI Categorization

| Failure | Behavior |

|---|---|
| LLM API unavailable or returns error | Assign category `uncategorized`, set ticket to `open`, surface warning on admin dashboard |
| LLM returns invalid / unexpected category | Fall back to `uncategorized` |

### AI Auto-Response

| Failure | Behavior |

|---|---|
| LLM API unavailable | Skip auto-response entirely; ticket stays `open` for admin to handle manually |
| Response generated but outbound email send fails | Hold response in review queue marked as "send failed"; admin can edit and retry |
| Low confidence score | Hold response in review queue for admin approval (standard lifecycle path) |

### Outbound Email (Admin Reply)

| Failure | Behavior |

|---|---|
| Email provider returns error on send | Surface error in admin UI on the ticket; do not mark reply as sent; allow manual retry |
| Transient / intermittent failure | Manual retry available from ticket detail view; each attempt is logged |

### Database

| Failure | Behavior |

|---|---|
| Write failure during ticket creation | Return `500` to webhook provider (triggers provider retry); `message-id` deduplication prevents duplicate on retry |
| Read failure on ticket/thread fetch | Surface generic error to admin UI; log full error server-side |

### General Principles

- All errors logged server-side with: timestamp, error type, endpoint, and relevant context (ticket ID, sender address)
- No raw error details or stack traces exposed externally (webhook callers receive only `200`, `401`, or `500`)
- Admin dashboard displays a **system health indicator** showing current status of: AI service, outbound email service, and recent webhook error rate

---

## Tech Stack

To be decided. Key integration points:

- Inbound email webhook provider (e.g. SendGrid,
- Mailgun, Postmark)
- Relational database (tickets, threads, KB articles, admin session)
- AI/LLM provider (categorization + response generation)
- Web framework (admin UI + API)
- Email sending service (for outbound replies)
