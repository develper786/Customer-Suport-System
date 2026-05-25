# PostgreSQL Setup Guide

## Step 1: Start PostgreSQL Service

### Option A: Using Windows Services
1. Press `Win + R` and type `services.msc`
2. Find `postgresql-x64-16` in the list
3. Right-click and select **Start**
4. Wait for it to show "Started"

### Option B: Using Command Prompt (Admin)
```cmd
net start postgresql-x64-16
```

### Option C: Using PowerShell (Admin)
```powershell
Start-Service postgresql-x64-16
```

---

## Step 2: Create Database

### Option A: Using SQL Script (Recommended)
```cmd
psql -U postgres -f setup-postgres.sql
```

### Option B: Using psql Interactive

1. Open Command Prompt and run:
```cmd
psql -U postgres
```

2. In psql, run these commands:
```sql
CREATE DATABASE customer_support_db;
\c customer_support_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);

\q
```

---

## Step 3: Verify Database Connection

```cmd
psql -U postgres -d customer_support_db -c "SELECT version();"
```

If you see the PostgreSQL version, the connection is successful!

---

## Step 4: Start the Backend

### Using Command Line
```bash
cd backend
java -jar target/customer-support-api-0.0.1-SNAPSHOT.jar --server.port=9000
```

### What to expect:
- Application will start on port 9000
- It will automatically create tables if they don't exist (ddl-auto=update)
- It will automatically insert admin user if it doesn't exist
- You'll see: `✓ Admin user created` and `✓ Sample tickets created`

---

## Step 5: Verify Setup

1. **Check Backend API:**
   ```
   http://localhost:9000/api
   ```
   Should return:
   ```json
   {
     "status": "running",
     "message": "Customer Support API",
     "endpoints": [...]
   }
   ```

2. **Check Health:**
   ```
   http://localhost:9000/actuator/health
   ```

3. **Test Login:**
   - Frontend: http://localhost:5173
   - Username: `admin`
   - Password: `admin123`

---

## Troubleshooting

### PostgreSQL Service Won't Start
- Check if PostgreSQL installation is correct
- Run with Administrator privileges
- Check Event Viewer for error logs

### Database Connection Failed
- Verify PostgreSQL is running: `pg_isready`
- Check username/password (default is `postgres`/`postgres`)
- Verify port 5432 is not blocked

### Application Fails to Start
- Check backend logs for database connection errors
- Verify database `customer_support_db` exists
- Check that tables were created

### Still having issues?
- Delete the database and recreate it
- Restart PostgreSQL service
- Rebuild the backend: `mvn clean install`

---

## Database Credentials
- **Host:** localhost
- **Port:** 5432
- **Database:** customer_support_db
- **Username:** postgres
- **Password:** postgres (default)

If you used different credentials during PostgreSQL installation, update `application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```
