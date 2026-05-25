# Database Schema

## tickets
| Column | Type |
|---|---|
| id | PK |
| subject | text |
| customer_email | text |
| category | text |
| created_at | timestamp |

## messages
| Column | Type |
|---|---|
| id | PK |
| ticket_id | FK → tickets |
| body | text |
| sender_type | enum (customer / agent / ai) |
| sent_at | timestamp |

## knowledge_base
| Column | Type |
|---|---|
| id | PK |
| filename | text |
| file_type | text |
| uploaded_at | timestamp |

## admin_users
| Column | Type |
|---|---|
| id | PK |
| username | text |
| password_hash | text |
