
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
