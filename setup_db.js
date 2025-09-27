const mysql = require('mysql');

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Subhamnphad#6',
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    // Create Database
    db.query('CREATE DATABASE IF NOT EXISTS MealLink', (err) => {
        if (err) throw err;
        console.log('Database created or already exists');

        // Switch to the database
        db.query('USE MealLink', (err) => {
            if (err) throw err;
            console.log('Using MealLink database');

            // Create Donations Table
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS donations (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    donor_name VARCHAR(255) NOT NULL,
                    donor_phone VARCHAR(20) NOT NULL,
                    location VARCHAR(255) NOT NULL,
                    food_details TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) throw err;
                console.log('Donations table created or already exists');
                db.end();
            });
        });
    });
});
