# MVP Plan — Customer Support System

A single-admin web app where customer emails become tickets, AI handles simple replies, and the admin handles the rest.

---

## Email Ingestion

- Each new email creates a new ticket
- Follow-up emails from the same customer are threaded under the existing ticket

---

## Ticket Management

- **Statuses:** Open → AI Responded → Pending Human Intervention → In Progress → Resolved
- Full email thread displayed on each ticket (customer + agent/AI replies)
- Agent can reply directly from the ticket UI
- Agent can manually change ticket status at any point

---

## AI Automation

- Auto-categorize each incoming ticket (e.g. Billing, Technical, General)
- Auto-respond using the knowledge base when confident
- Hand off to admin when AI is not confident

---

## Knowledge Base

- Admin uploads a PDF or Word document as the knowledge base
- AI uses the uploaded document to generate responses

---

## Human Agent UI

- Secure login for the single admin agent
- Ticket list with filters by status, category, and date
- Ticket detail view with full thread history and reply box
- Ability to manually change ticket status

---

## Dashboard

- Total tickets (daily / weekly)
- Ticket breakdown by status and category (charts)
- AI vs human handled ratio
- Average response time
- Resolution rate

---

## Security & Auth

- Admin login with username + password
- Session-based authentication
- All routes protected behind login

---

## Out of Scope

See [OUT_OF_SCOPE.md](./OUT_OF_SCOPE.md) for the full list.
