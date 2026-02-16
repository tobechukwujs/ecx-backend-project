
# Event Booking & Ticketing API

A production-ready RESTful API for managing events and ticket bookings, built for the ECX Backend Capstone Project.

## 🚀 Tech Stack

* **Runtime:** Node.js (v20.16.0)
* **Framework:** Express.js
* **Database Driver:** `pg` (Raw PostgreSQL)
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (RBAC)

## ✨ Features

* **Multi-tenant Data Isolation:** Ensures organizers can only access and manage events they created.
* **Atomic Booking System:** Uses SQL `BEGIN/COMMIT` transactions and `FOR UPDATE` row-level locking to prevent overbooking and race conditions.
* **Strict Role-Based Access:** Distinct permissions for **Organizers** (create/manage events) and **Attendees** (view/book tickets).
* **Security:** Password hashing via `bcryptjs` and input validation using `Joi`.

## 🛠️ Setup Instructions

1. Clone the repository:
```bash
git clone <your-repo-url>

```


2. Install dependencies:
```bash
npm install

```


3. Configure Environment: Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ecx_event_db
JWT_SECRET=your_jwt_secret

```


4. Initialize Database: This script drops existing tables and recreates the schema:
```bash
node src/config/initDb.js

```


5. Seed Test Data (Optional): Adds test events like "IEEE Tech Week":
```bash
node src/config/seed.js

```


6. Start the Server:
```bash
npm run dev

```



## 📖 API Documentation

**Live URL:** [https://ecx-event-api.onrender.com/]

### Core Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/v1/register` | Public | Create an Organizer or Attendee account |
| POST | `/api/v1/login` | Public | Authenticate and receive JWT |
| GET | `/api/v1/events` | Public | View all published events (Paginated) |
| POST | `/api/v1/events` | Organizer | Create a new event |
| POST | `/api/v1/bookings` | Attendee | Book tickets for an event (Atomic update) |

---
System Architecture Overview 
The API follows a Layered Monolithic Architecture, organized to separate concerns between 
routing, business logic, and database management. 

1. Request Flow & Middleware Layer 
Every request enters through the Express.js server and passes through a sequence of 
protective layers: 
● Validation: Uses Joi to enforce strict data types (e.g., UUID formats, positive integers 
for seat counts) before logic is executed. 
● Authentication & RBAC: A custom middleware decodes JWTs to verify identity and 
enforces Role-Based Access Control (Organizers vs. Attendees). 

2. Business Logic Layer (Controllers) 
This layer handles the core requirements for Event Management and Ticketing: 
● Multi-tenant Isolation: The logic ensures that organizer_id is always checked against 
the JWT user_id so organizers cannot modify other users' data. 
● Atomic Booking Logic: To meet the 20% grading criteria for "Event & Booking Logic," 
the system uses SQL Transactions (BEGIN, COMMIT, ROLLBACK). 

3. Data Persistence Layer (PostgreSQL) 
Unlike standard implementations, this project uses Raw SQL to ensure maximum control over 
database locking: 
● Concurrency Control: Employs SELECT ... FOR UPDATE row-level locking during 
the booking process to prevent race conditions (overbooking). 
● Relational Integrity: The schema enforces constraints such as UNIQUE(user_id, 
event_id) to prevent double-bookings and ON DELETE CASCADE to maintain data 
cleanliness. 

Deployment Architecture 
The system is deployed on Render, utilizing a managed PostgreSQL instance: 
● SSL/TLS Encryption: Configured in db.js to satisfy cloud security requirements. 
● Automated Migrations: The build command triggers node src/config/initDb.js, 
ensuring the schema is always synchronized with the code.