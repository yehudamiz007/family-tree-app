import React, { useState, useEffect } from 'react';
import FamilyTree from './components/FamilyTree';
import PersonForm from './components/PersonForm';
import PersonDetails from './components/PersonDetails';
import RelationshipForm from './components/RelationshipForm';

// Local Storage API for GitHub Pages (no backend)
const STORAGE_KEY = 'family_tree_data';

const getStoredData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { people: [], relationships: [] };
};

const saveData = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

function App() {
  const [people, setPeople] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = getStoredData();
    setPeople(data.people);
    setRelationships(data.relationships);
    setTreeData(data);
  };

  const handleAddPerson = (personData) => {
    const newPerson = {
      id: generateId(),
      ...personData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const data = getStoredData();
    data.people.push(newPerson);
    saveData(data);
    loadData();
    setShowPersonForm(false);
  };

  const handleUpdatePerson = (personData) => {
    const data = getStoredData();
    const index = data.people.findIndex(p => p.id === editingPerson.id);
    if (index !== -1) {
      data.people[index] = {
        ...data.people[index],
        ...personData,
        updated_at: new Date().toISOString()
      };
      saveData(data);
      loadData();
    }
    setEditingPerson(null);
    setShowPersonForm(false);
  };

  const handleDeletePerson = (id) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק אדם זה?')) return;
    
    const data = getStoredData();
    data.people = data.people.filter(p => p.id !== id);
    data.relationships = data.relationships.filter(r => r.person1_id !== id && r.person2_id !== id);
    saveData(data);
    loadData();
    setSelectedPerson(null);
  };

  const handleAddRelationship = (relationshipData) => {
    const newRelationship = {
      id: generateId(),
      ...relationshipData,
      created_at: new Date().toISOString()
    };
    
    const data = getStoredData();
    data.relationships.push(newRelationship);
    saveData(data);
    loadData();
    setShowRelationshipForm(false);
  };

  const handleDeleteRelationship = (id) => {
    const data = getStoredData();
    data.relationships = data.relationships.filter(r => r.id !== id);
    saveData(data);
    loadData();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      loadData();
      return;
    }
    const data = getStoredData();
    const filtered = data.people.filter(p => 
      p.first_name.includes(searchQuery) || 
      p.last_name.includes(searchQuery)
    );
    setPeople(filtered);
  };

  const handleEditPerson = (person) => {
    setEditingPerson(person);
    setShowPersonForm(true);
  };

  const handleExport = () => {
    const data = getStoredData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family_tree.json';
    a.click();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        saveData(data);
        loadData();
        alert('הנתונים יובאו בהצלחה!');
      } catch (error) {
        alert('שגיאה בייבוא הקובץ');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌳 עץ שורשים משפחתי</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="חיפוש..."
            className="search-box"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn btn-secondary" onClick={handleSearch}>
            חפש
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingPerson(null); setShowPersonForm(true); }}>
            הוסף אדם
          </button>
          <button className="btn btn-secondary" onClick={() => setShowRelationshipForm(true)}>
            הוסף קשר
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            ייצא
          </button>
          <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
            ייבא
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <h2>אנשים ({people.length})</h2>
          {people.map(person => (
            <div key={person.id} className="person-card">
              <h3>{person.first_name} {person.last_name}</h3>
              <p>תאריך לידה: {person.birth_date || 'לא ידוע'}</p>
              <p>מין: {person.gender === 'male' ? 'זכר' : person.gender === 'female' ? 'נקבה' : 'אחר'}</p>
              <div className="person-actions">
                <button className="btn btn-primary" onClick={() => setSelectedPerson(person)}>
                  פרטים
                </button>
                <button className="btn btn-secondary" onClick={() => handleEditPerson(person)}>
                  ערוך
                </button>
                <button className="btn btn-danger" onClick={() => handleDeletePerson(person.id)}>
                  מחק
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tree-container">
          {treeData && treeData.people.length > 0 ? (
            <FamilyTree 
              data={treeData} 
              onNodeClick={setSelectedPerson}
            />
          ) : (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h2>ברוכים הבאים לעץ השורשים המשפחתי!</h2>
              <p>התחל להוסיף אנשים כדי לבנות את העץ המשפחתי שלך.</p>
              <button className="btn btn-primary" onClick={() => setShowPersonForm(true)}>
                הוסף אדם ראשון
              </button>
            </div>
          )}
        </div>
      </div>

      {showPersonForm && (
        <PersonForm
          person={editingPerson}
          onSubmit={editingPerson ? handleUpdatePerson : handleAddPerson}
          onClose={() => { setShowPersonForm(false); setEditingPerson(null); }}
        />
      )}

      {showRelationshipForm && (
        <RelationshipForm
          people={people}
          onSubmit={handleAddRelationship}
          onClose={() => setShowRelationshipForm(false)}
        />
      )}

      {selectedPerson && (
        <PersonDetails
          person={selectedPerson}
          relationships={relationships.filter(r => r.person1_id === selectedPerson.id || r.person2_id === selectedPerson.id)}
          people={people}
          onClose={() => setSelectedPerson(null)}
          onDeleteRelationship={handleDeleteRelationship}
        />
      )}
    </div>
  );
}

export default App;