# PostgreSQL Integration - Changes Summary

## Files Added

### 1. **Entity Classes**

- `backend/src/main/java/com/customersupport/entity/User.java`
  - JPA entity for user authentication
  - Implements Spring Security's UserDetails
  - Fields: id, username, password, role, enabled, createdAt, updatedAt

- `backend/src/main/java/com/customersupport/entity/Ticket.java`
  - JPA entity for support tickets
  - Fields: id, title, description, status, priority, assignedTo, customerEmail, customerName, createdAt, updatedAt, resolvedAt

### 2. **Repository Classes**

- `backend/src/main/java/com/customersupport/repository/UserRepository.java`
  - Spring Data JPA repository for User
  - Methods: findByUsername()

- `backend/src/main/java/com/customersupport/repository/TicketRepository.java`
  - Spring Data JPA repository for Ticket
  - Methods: findByStatus(), findByAssignedToId(), countOpenTickets(), countPendingTickets(), countResolvedTickets()

### 3. **Controller Classes**

- `backend/src/main/java/com/customersupport/controller/TicketController.java`
  - REST endpoints for ticket management
  - Routes: GET /api/tickets, POST /api/tickets, PATCH /api/tickets/{id}, DELETE /api/tickets/{id}, GET /api/tickets/by-status/{status}
  - **Requires authentication**

- `backend/src/main/java/com/customersupport/controller/MetricsController.java`
  - REST endpoints for ticket metrics
  - Routes: GET /api/metrics/overview, GET /api/metrics/volume, GET /api/metrics/response-times, GET /api/metrics/resolution
  - **Requires authentication**

### 4. **Configuration**

- `backend/src/main/java/com/customersupport/config/DataInitializer.java`
  - Automatically initializes the database with sample data on startup
  - Creates admin and support users if they don't exist
  - Creates sample tickets

### 5. **Setup Script**

- `backend/setup-postgres.sql`
  - PostgreSQL SQL script to create database and tables
  - Can be run with: `psql -U postgres -f setup-postgres.sql`

### 6. **Documentation**

- `POSTGRES_SETUP.md` - Complete setup guide
- `POSTGRES_CHANGES.md` - This file

---

## Files Modified

### 1. **pom.xml**

```xml
<!-- Added dependencies -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. **application.properties**

```properties
# Changed from H2 in-memory to PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/customer_support_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

### 3. **SecurityConfig.java**

```java
// Changed from InMemoryUserDetailsManager to database-based
@Bean
public UserDetailsService userDetailsService(UserRepository userRepository) {
    return username -> userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
}
```

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tickets Table

```sql
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    assigned_to INTEGER REFERENCES users(id),
    customer_email VARCHAR(255),
    customer_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);
```

---

## Available Credentials

### Default Users (Created Automatically)

1. **Admin User**
   - Username: `admin`
   - Password: `admin123`
   - Role: `ROLE_ADMIN`

2. **Support Agent**
   - Username: `support`
   - Password: `support123`
   - Role: `ROLE_AGENT`

---

## New API Endpoints

### Ticket Management (Requires Authentication)

- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `PATCH /api/tickets/{id}` - Update ticket
- `DELETE /api/tickets/{id}` - Delete ticket
- `GET /api/tickets/by-status/{status}` - Get tickets by status

### Metrics (Requires Authentication)

- `GET /api/metrics/overview` - Get ticket metrics overview
- `GET /api/metrics/volume` - Get ticket volume
- `GET /api/metrics/response-times` - Get response time metrics
- `GET /api/metrics/resolution` - Get resolution metrics

### Authentication (No Authentication Required)

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (requires auth)
- `GET /api/auth/me` - Get current user (requires auth)

### Health Checks (No Authentication Required)

- `GET /api` - API info
- `GET /actuator/health` - Health check

---

## Next Steps

1. **Start PostgreSQL** - Follow POSTGRES_SETUP.md
2. **Create Database** - Run setup-postgres.sql
3. **Start Backend** - `java -jar target/customer-support-api-0.0.1-SNAPSHOT.jar`
4. **Test** - Login at http://localhost:5173

---

## Technology Stack

- **Database:** PostgreSQL 16
- **ORM:** Spring Data JPA with Hibernate
- **Authentication:** Spring Security with BCrypt password encoding
- **Backend:** Spring Boot 3.4.1
- **Frontend:** React + Vite

---

## Important Notes

- Passwords are automatically hashed with BCrypt
- User authentication now comes from the database instead of in-memory
- Tables are automatically created/updated via Hibernate DDL (ddl-auto=update)
- Sample tickets are created with sample users
- All authenticated endpoints require valid Spring Security session/token
