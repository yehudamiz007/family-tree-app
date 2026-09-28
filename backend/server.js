const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all people
app.get('/api/people', (req, res) => {
  db.all('SELECT * FROM people ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get person by ID with relationships
app.get('/api/people/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM people WHERE id = ?', [id], (err, person) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    // Get relationships
    db.all(`
      SELECT r.*, 
        p1.first_name as person1_first_name, p1.last_name as person1_last_name,
        p2.first_name as person2_first_name, p2.last_name as person2_last_name
      FROM relationships r
      JOIN people p1 ON r.person1_id = p1.id
      JOIN people p2 ON r.person2_id = p2.id
      WHERE r.person1_id = ? OR r.person2_id = ?
    `, [id, id], (err, relationships) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ ...person, relationships });
    });
  });
});

// Create person
app.post('/api/people', (req, res) => {
  const { first_name, last_name, birth_date, death_date, gender, photo_url, bio } = req.body;
  const id = uuidv4();

  db.run(`
    INSERT INTO people (id, first_name, last_name, birth_date, death_date, gender, photo_url, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, first_name, last_name, birth_date, death_date, gender, photo_url, bio], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, first_name, last_name, birth_date, death_date, gender, photo_url, bio });
  });
});

// Update person
app.put('/api/people/:id', (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, birth_date, death_date, gender, photo_url, bio } = req.body;

  db.run(`
    UPDATE people 
    SET first_name = ?, last_name = ?, birth_date = ?, death_date = ?, gender = ?, photo_url = ?, bio = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [first_name, last_name, birth_date, death_date, gender, photo_url, bio, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json({ id, first_name, last_name, birth_date, death_date, gender, photo_url, bio });
  });
});

// Delete person
app.delete('/api/people/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM people WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json({ message: 'Person deleted successfully' });
  });
});

// Create relationship
app.post('/api/relationships', (req, res) => {
  const { person1_id, person2_id, relationship_type } = req.body;
  const id = uuidv4();

  db.run(`
    INSERT INTO relationships (id, person1_id, person2_id, relationship_type)
    VALUES (?, ?, ?, ?)
  `, [id, person1_id, person2_id, relationship_type], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, person1_id, person2_id, relationship_type });
  });
});

// Delete relationship
app.delete('/api/relationships/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM relationships WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json({ message: 'Relationship deleted successfully' });
  });
});

// Get full family tree
app.get('/api/tree', (req, res) => {
  db.all('SELECT * FROM people', [], (err, people) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    db.all('SELECT * FROM relationships', [], (err, relationships) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ people, relationships });
    });
  });
});

// Search people
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  
  db.all(`
    SELECT * FROM people 
    WHERE first_name LIKE ? OR last_name LIKE ?
    ORDER BY first_name
  `, [`%${q}%`, `%${q}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});