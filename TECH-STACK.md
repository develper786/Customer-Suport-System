# Tech Stack

## Backend

- **Spring Boot** — REST API, webhook endpoint, business logic
- **Spring Security** — session-based authentication, route protection
- **Spring Data JPA** — database access
- **Spring Mail** — sending outbound reply emails
- **Spring AI** — email categorization and auto-response generation
- **Apache PDFBox** — parsing uploaded PDF knowledge base documents

## Frontend

- **React + Vite** — admin UI
- **Tailwind CSS** — styling
- **React Router** — page navigation
- **Axios** — HTTP requests to backend
- **Recharts** — dashboard charts (ticket volume, status breakdown)

## Database

- **PostgreSQL**

## Email

- **SendGrid** — inbound webhook + outbound email sending

## Dev & Config

- `.env` file for all secrets (API keys, DB credentials, webhook secret)
- Docker Compose for running PostgreSQL locally during development
