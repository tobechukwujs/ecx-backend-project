-- db/init.sql

-- 1. Drop tables in reverse order of relationships
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- 2. Create Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('organizer', 'attendee')) NOT NULL
);

-- 3. Create Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    date_time TIMESTAMP NOT NULL,
    ticket_price DECIMAL DEFAULT 0,
    total_seats INTEGER NOT NULL,
    remaining_seats INTEGER NOT NULL,
    status TEXT CHECK (status IN ('draft', 'published', 'cancelled')) DEFAULT 'published',
    organizer_id UUID REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create Bookings Table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ticket_quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id) -- Requirement: No double bookings [cite: 54]
);