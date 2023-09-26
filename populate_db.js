import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./users.db');

// Create a table to store user data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)`);

    // Sample user data (replace with your own data)
    const userData = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        { username: 'user3', password: 'password3' },
    ];

    // Insert user data into the database
    const insertStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    userData.forEach((user) => {
        insertStmt.run(user.username, user.password);
    });
    insertStmt.finalize();

    console.log('Database populated with sample data.');
});

// Close the database connection
db.close();