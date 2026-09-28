const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'family_tree.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // People table
  db.run(`
    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT,
      birth_date TEXT,
      death_date TEXT,
      gender TEXT CHECK(gender IN ('male', 'female', 'other')),
      photo_url TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Relationships table
  db.run(`
    CREATE TABLE IF NOT EXISTS relationships (
      id TEXT PRIMARY KEY,
      person1_id TEXT NOT NULL,
      person2_id TEXT NOT NULL,
      relationship_type TEXT NOT NULL CHECK(relationship_type IN ('parent', 'spouse', 'sibling')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (person1_id) REFERENCES people(id) ON DELETE CASCADE,
      FOREIGN KEY (person2_id) REFERENCES people(id) ON DELETE CASCADE,
      UNIQUE(person1_id, person2_id, relationship_type)
    )
  `);

  console.log('Database initialized successfully');
});

module.exports = db;