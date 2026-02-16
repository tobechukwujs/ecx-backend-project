const db = require('./db');
const fs = require('fs');
const path = require('path');

const initDb = async () => {
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../../db/init.sql')).toString();
        
        console.log("Initializing database tables...");
        await db.query(sql);
        console.log("Database tables created successfully!");
        
        process.exit();
    } catch (err) {
        console.error("Error initializing database:", err.message);
        process.exit(1);
    }
};

initDb();