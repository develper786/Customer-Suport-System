# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Customer Support Management System** - A full-stack web application for managing customer support tickets with admin dashboard, email integration, and AI-powered features.

**Current Status:** Production-ready backend with PostgreSQL database integration, Spring Security authentication, and full REST API. React frontend with Vite build tool and real-time health monitoring.

**Key Characteristics:**

- Monorepo structure with separate `backend` (Spring Boot) and `frontend` (React) directories
- Session-based authentication with BCrypt password hashing
- PostgreSQL database with JPA/Hibernate ORM
- Spring Boot DevTools enabled for fast development feedback
- CORS configured for localhost development
- Health monitoring endpoints with real-time dashboard display

---

## Architecture Overview

### Backend (Spring Boot 3.4.1)

**Package Structure:**

```com.customersupport/
├── config/
│   ├── SecurityConfig.java       # Spring Security setup, CORS, authentication rules
│   └── DataInitializer.java      # Auto-creates sample users and tickets on startup
├── controller/
│   ├── AuthController.java       # POST /api/auth/login, /logout, GET /me
│   ├── HealthController.java     # GET /api/health, /health/info for monitoring
│   ├── TicketController.java     # CRUD endpoints for support tickets
│   ├── MetricsController.java    # Dashboard metrics endpoints
│   └── ApiController.java        # GET /api welcome/info endpoint
├── entity/
│   ├── User.java                 # JPA entity, implements UserDetails
│   └── Ticket.java               # JPA entity for support tickets
├── repository/
│   ├── UserRepository.java       # JPA repository with findByUsername()
│   └── TicketRepository.java     # JPA repository with custom queries
└── CustomerSupportApiApplication.java
```

**Key Configuration:**

- Port: 9000 (configurable via `--server.port=9000`)
- Database: PostgreSQL (localhost:5432)
- Auth: Session-based with Spring Security
- DevTools: Enabled for auto-restart on file changes
- CORS: Allows localhost:5173-5177 for frontend development

**Database Schema:**

- `users` table: id, username (unique), password (BCrypt), role, enabled, created_at,
- updated_at

- `tickets` table: id, title, description, status (OPEN/PENDING/RESOLVED), priority, assigned_to (FK), customer info, timestamps

**Authentication:**

- Default admin user created on startup: `admin` / `admin123`
- Default support agent: `support` / `support123`
- Protected endpoints require authenticated session
- Public endpoints: /api, /api/auth/login, /api/health/**, /actuator/**

### Frontend (React + Vite)

**Component Structure:**

```src/
├── components/
│   ├── LoginPage.jsx           # Public login form with error handling
│   ├── Dashboard.jsx           # Protected admin dashboard
│   └── HealthInfo.jsx          # Real-time backend health display
├── services/
│   └── api.js                  # Axios HTTP client with auth interceptor
├── styles/
│   ├── LoginPage.css
│   ├── Dashboard.css
│   └── HealthInfo.css
├── App.jsx                     # React Router setup
└── main.jsx
```

**Key Features:**

- Port: 5173 (auto-increments if busy)
- Routing: /login (public), /dashboard (protected), / (redirects based on auth)
- Auth: Stored in localStorage, checked on mount
- HTTP Client: Axios with credentials, auto-redirects to /login on 401
- Styling: Tailwind CSS with responsive design
- DevTools: Vite hot module replacement for CSS/JS changes

---

## Development Workflow

### Prerequisites

**System Requirements:**

- Java 21 (for backend)
- Node.js 16+ (for frontend)
- PostgreSQL 16 running on localhost:5432
- Maven 3.6+ (or use `./mvnw`)

**Database Setup:**

```bash
# Start PostgreSQL service
net start postgresql-x64-16  # Windows
# or: sudo systemctl start postgresql  # Linux/Mac

# Create database and schema
psql -U postgres -d customer_support_db -f backend/setup-postgres.sql
```

### Build Commands

**Backend:**

```bash
# Build with tests
mvn clean install

# Build without tests
mvn clean install -DskipTests

# Quick compile (skip tests, no install)
mvn clean compile

# Run tests
mvn test

# Run with Spring Boot
mvn spring-boot:run
```

**Frontend:**

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm preview

# Lint code
npm run lint
```

### Runtime Commands

**Backend (from backend/ directory):**

```bash
# Run JAR on port 9000
java -jar target/customer-support-api-0.0.1-SNAPSHOT.jar --server.port=9000

# With Spring Boot Maven plugin (includes DevTools auto-restart)
mvn spring-boot:run

# Debug mode with JVM options
java -Xms512m -Xmx1024m -jar target/customer-support-api-0.0.1-SNAPSHOT.jar
```

**Frontend (from frontend/ directory):**

```bash
# Development server on http://localhost:5173
npm run dev

# Production build to dist/
npm run build

# Analyze production bundle
npm run preview
```

### Development with DevTools

**Spring Boot DevTools** is enabled for fast development feedback:

1. **Edit Java file** in VS Code
2. **Save (Ctrl+S)** - DevTools detects changes
3. **Watch terminal** - App auto-restarts (2-5 seconds)
4. **Refresh browser** - See changes live

DevTools is configured in `application.properties`:

```properties
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

**What auto-restarts:** Java classes, configuration files, static resources  
**What doesn't:** Test files (run manually), major dependency changes

### Testing APIs

**Backend Health Check:**

```bash
curl http://localhost:9000/api/health
curl http://localhost:9000/api/health/info
curl http://localhost:9000/actuator/health
```

**Backend Login:**

```bash
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Frontend:**

- Open http://localhost:5173
  
- Login with admin / admin123
- Dashboard displays real-time backend health

---

## Important Configuration Files

### Backend

**`application.properties`** - Spring Boot configuration:

- `server.port=9000` - Server port
- `spring.datasource.*` - PostgreSQL connection (user: postgres, password: 1234)
- `spring.jpa.hibernate.ddl-auto=update` - Auto-create/update tables
- `spring.devtools.*` - DevTools settings
- `logging.level.*` - Debug logging for security, web, custom packages

**`pom.xml`** - Maven dependencies:

- Spring Boot Starters: web, security, data-jpa, actuator, devtools
- PostgreSQL JDBC driver
- Testing: JUnit, Spring Security Test

### Frontend

**`vite.config.js`** - Vite build configuration (React plugin)

**`tailwind.config.js`** - Tailwind CSS configuration

**`package.json`** - Dependencies and npm scripts

---

## Key Implementation Details

### Authentication Flow

1. User submits login form (LoginPage.jsx)
2. POST to `/api/auth/login` with username/password
3. Backend authenticates against User entity in PostgreSQL
4. Spring Security creates session
5. Frontend stores user object in localStorage
6. Dashboard checks localStorage on mount, redirects if not authenticated
7. Axios interceptor catches 401 responses, clears localStorage, redirects to /login

### API Response Format

**Login Success:**

```json
{
  "success": true,
  "message": "Login successful",
  "username": "admin",
  "roles": [{"authority": "ROLE_ADMIN"}]
}
```

**Login Failure:**

```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**Health Endpoint:**

```json
{
  "status": "UP",
  "message": "⚡ Frontend UI is working! Auto-restart successful!",
  "version": "1.1.0",
  "database": "PostgreSQL",
  "devtools_enabled": true,
  "timestamp": "2026-05-25T15:41:53.032877",
  "uptime": "Active"
}
```

### Security

- **CORS:** Restricted to localhost:5173-5177 in development
- **CSRF:** Disabled (accept from frontend without tokens)
- **Password:** BCrypt hashing with default strength
- **Session:** Spring's default JSESSIONID cookie
- **Protected Routes:** All except /api, /api/auth/login, /api/health/**, /actuator/**

### Database Initialization

`DataInitializer.java` runs on startup via `@Bean CommandLineRunner`:

- Creates admin user if not exists
- Creates support agent if not exists
- Creates 3 sample tickets with different statuses
- Uses BCrypt encoder to hash passwords

---

## Common Development Tasks

**Add a new API endpoint:**

1. Create method in appropriate Controller
2. Annotate with `@GetMapping`, `@PostMapping`, etc.
3. Ensure route doesn't conflict with protected patterns in SecurityConfig
4. If public endpoint, add to permitAll() in SecurityConfig
5. DevTools auto-restarts on save

**Add a new database entity:**

1. Create JPA entity in `entity/` package with `@Entity` and `@Table`
2. Create repository in `repository/` extending `JpaRepository`
3. Add to DataInitializer if needs sample data
4. Hibernate auto-creates table (ddl-auto=update)

**Add a new frontend component:**

1. Create `.jsx` file in `components/`
2. Create corresponding `.css` file in `styles/`
3. Import in App.jsx or parent component
4. Add route in App.jsx if it's a page-level component
5. Vite hot-reloads on save

**Update authentication rules:**

1. Edit SecurityConfig.java `authorizeHttpRequests()`
2. Add path to `.permitAll()` if public
3. DevTools auto-restarts

**Debug backend:**

1. Enable DEBUG logging in application.properties
2. Watch logs in terminal for request flow
3. Use browser DevTools Network tab to inspect requests
4. Health endpoint shows real-time system state

---

## Database Connection Details

**Connection String:**

```jdbc:postgresql://localhost:5432/customer_support_db
```

**Credentials:**

- User: postgres
- Password: 1234

**Verify Connection:**

```bash
psql -U postgres -d customer_support_db -c "SELECT COUNT(*) FROM users;"
```

**Reset Database:**

```bash
psql -U postgres -d customer_support_db -c "DROP TABLE tickets; DROP TABLE users;"
# Restart backend - tables auto-create
```

---

## Troubleshooting

| Issue | Solution |

|-------|----------|
| Backend won't start | Check PostgreSQL is running: `pg_isready` |
| Password auth fails | Verify postgres password is "1234" in application.properties |
| Frontend can't reach backend | Check CORS origins in SecurityConfig, DevTools HealthController |
| DevTools not auto-restarting | Rebuild JAR with `mvn clean install`, verify devtools in pom.xml |
| Database tables not created | Check Hibernate logs, verify ddl-auto=update, check DB connection |
| Port already in use | Change port: `--server.port=9001` or kill process on port 9000 |
| JWT/Session issues | Clear browser localStorage and cookies, restart backend |

---

## Important Notes for Future Development

1. **Database credentials** in `application.properties` should move to `.env` file before production
2. **Email integration** will require SendGrid API key (not yet implemented)
3. **Spring AI features** require OpenAI API key (skeleton code included)
4. **Static resources** should go in `src/main/resources/static/` for Spring to serve them
5. **Custom properties** should use `@Value` annotation for dependency injection
6. **Transaction handling** use `@Transactional` on service methods when available
7. **Response entities** use consistent JSON structure across all endpoints
8. **Error handling** catch exceptions in controller advice for consistent error responses

---

## Quick Reference: Useful URLs

**Backend:**

- Health: http://localhost:9000/api/health
  
- API Info: http://localhost:9000/api

- Actuator: http://localhost:9000/actuator/health

**Frontend:**

- App: http://localhost:5173

- Login: http://localhost:5173/login

- Dashboard: http://localhost:5173/dashboard

**Credentials:**

- Admin: admin / admin123
- Agent: support / support123
