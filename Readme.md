# Foodbridge

Foodbridge is a platform that connects people with excess food to orphanages and NGOs in need. Donors can easily share their surplus food, and recipients can find nearby donations. The goal is to reduce food wastage and help feed those in need.

## Features

- **Donate Food:** Fill out a simple form to share details about your food donation.
- **View Nearby Donations:** Search and view available donations based on location.
- **Modern UI:** Sleek and easy-to-use interface.
- **Database Integration:** Uses MySQL for storing donation data.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MySQL](https://dev.mysql.com/downloads/)

## Installation

1. Clone the repository:
   ```bash
   https://github.com/Tanmay-coderr/foodbridge.git
   cd foodbridge
   ```
2. Install the required packages from the project directory:
   ```bash
   npm install express mysql
   ```
3. Set up the database:
   - Make sure your MySQL server is running.
   - Run the database setup script:
     ```bash
     node setup_db.js
     ```

## Configuration

Edit the database configuration in `app.js` as per your MySQL credentials:

```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'foodbridge'
});
```
## Setup_db
Edit the database configuration in `setup_db.js` as per your MySQL credentials:

```js
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',
    database: 'foodbridge'
});

## Running the Application

Start the server:

```bash
node app.js
```

Access the application at:

```
http://localhost:3000
```

##

## License

This project is licensed under the MIT License.

