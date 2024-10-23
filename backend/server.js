const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const dotenv=require('dotenv');

dotenv.config();


const app = express();
const _dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(_dirname, 'frontend', 'dist')));

// Use environment variables for the database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST  ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME 
});

db.connect((err) => {
  if (err) {
    console.log('Error occurred while connecting to database:', err);
    return err;
  }
  console.log('Database connected 👍');
});

// API route
app.get('/login', (req, res) => {
  const query = 'SELECT * FROM users'; // Use correct table name
  db.query(query, (err, result) => {
    if (err) {
      console.log('Error fetching data:', err);
      return res.status(500).json({ error: 'Failed to fetch data' });
    }
    res.json(result);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'));
});

// Use environment variable for the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
