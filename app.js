const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const app = express();

const PORT = process.env.PORT || 3000;

// In-memory OTP store
const otpStore = new Map();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'meallink_secret_key',
    resave: false,
    saveUninitialized: true
}));

// MySQL Connection using Railway env variables
const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
});

db.connect(err => {
    if (err) {
        console.error('❌ DB connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL');
});

// ----------------------------
// Static Page Routes
// ----------------------------
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'));
app.get('/signup', (req, res) => res.sendFile(__dirname + '/public/signup.html'));
app.get('/otp', (req, res) => res.sendFile(__dirname + '/public/otp.html'));

// ----------------------------
// Signup Logic
// ----------------------------
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, password], (err) => {
        if (err) {
            console.error('Signup Error:', err);
            return res.status(500).send('Signup failed');
        }
        res.redirect('/login');
    });
});

// ----------------------------
// Login Logic
// ----------------------------
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).send('Login error');
        if (results.length === 0) return res.status(401).send('Invalid email or password');

        req.session.user = results[0];
        res.redirect('/otp');
    });
});

// ----------------------------
// OTP Generation
// ----------------------------
app.get('/generate-otp', (req, res) => {
    if (!req.session.user) return res.status(403).send('Login required');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(req.session.user.email, otp);

    console.log(`🔐 OTP for ${req.session.user.email}: ${otp}`);
    res.send('OTP sent (check console)');
});

// ----------------------------
// OTP Verification
// ----------------------------
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    const storedOtp = otpStore.get(req.session.user?.email);

    if (otp === storedOtp) {
        otpStore.delete(req.session.user.email);
        res.send('✅ OTP verified. You are logged in.');
    } else {
        res.status(401).send('❌ Invalid OTP');
    }
});

// ----------------------------
// Donation Submission
// ----------------------------
app.post('/donate', (req, res) => {
    const { donor_name, donor_phone, location, food_details } = req.body;

    const sql = `
        INSERT INTO donations (donor_name, donor_phone, location, food_details)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [donor_name, donor_phone, location, food_details], (err) => {
        if (err) {
            console.error('Donation Error:', err);
            return res.status(500).send('Failed to add donation');
        }
        res.redirect('/nearby_donation.html');
    });
});

// ----------------------------
// Nearby Donation Search
// ----------------------------
app.get('/api/search_donations', (req, res) => {
    const { location } = req.query;
    const sql = 'SELECT * FROM donations WHERE location LIKE ?';

    db.query(sql, [`%${location}%`], (err, results) => {
        if (err) return res.status(500).send('Search error');
        res.json(results);
    });
});

// ----------------------------
// API - All Donations
// ----------------------------
app.get('/api/nearby_donations', (req, res) => {
    const query = 'SELECT donor_name, location, food_details, donor_phone, created_at FROM donations';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching donations:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
