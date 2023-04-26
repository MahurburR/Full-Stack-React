const path = require("path");
const express = require("express");
const app = express();
const pg = require('pg');
const cors = require('cors');
app.use(
  express.static(
    path.join(__dirname, "../Full-Stack-React/favlinks-main", "build")
  )
);
app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(
    path.join(
      __dirname,
      "../Full-Stack-React/favlinks-main",
      "build",
      "index.html"
    )
  );
})
app.use(express.json())

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

// create pool to connect to Postgres database
const pool = new pg.Pool({
  user: 'dpwmynjx',
  host: 'mahmud.db.elephantsql.com',
  database: 'dpwmynjx',
  password: 'iUUNlJpIwUmwkfJMwsH6g8oCajiOyOHx',
  port: 5432, // default PostgreSQL port
});
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  console.log('Connected to PostgreSQL database!');
  release(); // release the client back to the pool
});

pool.query(`
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_name = 'favorite'
  )
`, (err, res) => {
  if (err) {
    console.error('Failed to check if table exists:', err);
    return;
  }

  const tableExists = res.rows[0].exists;
  if (!tableExists) {
    pool.query(`
      CREATE TABLE favorite (
        id SERIAL PRIMARY KEY,
        url VARCHAR(30) NOT NULL,
        name VARCHAR(30) NOT NULL
      )
    `, (err, res) => {
      if (err) {
        console.error('Failed to create table:', err);
        return;
      }

      console.log('Table created successfully!');
    });
  } else {
    console.log('Table already exists!');
  }
});



// GET: /favorite
app.get('/links', (req, res) => {
  pool.query('SELECT * FROM favorite', (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving links from database');
    } else {
      res.status(200).json(result.rows);
    }
  });
});

// POST: /links
app.post('/links', (req, res) => {
  const { name, url } = req.body;
  pool.query('INSERT INTO favorite (name, url) VALUES ($1, $2)', [name, url], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating link');
    } else {
      res.status(201).send('Link created successfully');
    }
  });
});

// DELETE: /links/:id
app.delete('/links/:id', (req, res) => {
  const id = req.params.id;
  console.log(id);
  pool.query('DELETE FROM favorite WHERE id=$1', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error deleting link');
    } else if (result.rowCount === 0) {
      res.status(404).send('Link not found');
    } else {
      res.status(200).send('Link deleted successfully');
    }
  });
});


// PUT: /links/:id
app.put('/links/:id', (req, res) => {
  const id = req.params.id;
  const { name, url } = req.body;
  pool.query('UPDATE favorite SET name=$1, url=$2 WHERE id=$3', [name, url, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error updating link');
    } else if (result.rowCount === 0) {
      res.status(404).send('Link not found');
    } else {
      res.status(200).send('Link updated successfully');
    }
  });
});


// GET: /links/:id
app.get('/links/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM favorite WHERE id=$1', [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error retrieving link from database');
    } else if (result.rows.length === 0) {
      res.status(404).send('Link not found');
    } else {
      res.status(200).json(result.rows[0]);
    }
  });
});






app.listen(8000, () => {
  console.log("server started on port 8000");
});
