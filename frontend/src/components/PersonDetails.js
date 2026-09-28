import React from 'react';

const PersonDetails = ({ person, relationships, people, onClose, onDeleteRelationship }) => {
  const getPersonName = (id) => {
    const p = people.find(p => p.id === id);
    return p ? `${p.first_name} ${p.last_name}` : 'לא ידוע';
  };

  const getRelationshipLabel = (type) => {
    switch(type) {
      case 'parent': return 'הורה';
      case 'spouse': return 'בן/בת זוג';
      case 'sibling': return 'אח/אחות';
      default: return type;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>פרטי אדם</h2>
        <div className="person-card">
          <h3>{person.first_name} {person.last_name}</h3>
          <p><strong>תאריך לידה:</strong> {person.birth_date || 'לא ידוע'}</p>
          <p><strong>תאריך פטירה:</strong> {person.death_date || 'לא ידוע'}</p>
          <p><strong>מין:</strong> {person.gender === 'male' ? 'זכר' : person.gender === 'female' ? 'נקבה' : 'אחר'}</p>
          {person.bio && <p><strong>ביוגרפיה:</strong> {person.bio}</p>}
          {person.photo_url && (
            <img 
              src={person.photo_url} 
              alt={`${person.first_name} ${person.last_name}`}
              style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '10px' }}
            />
          )}
        </div>

        {relationships.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>קשרים משפחתיים</h3>
            {relationships.map(rel => {
              const otherPersonId = rel.person1_id === person.id ? rel.person2_id : rel.person1_id;
              return (
                <div key={rel.id} className="person-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{getRelationshipLabel(rel.relationship_type)}:</strong> {getPersonName(otherPersonId)}
                  </div>
                  <button className="btn btn-danger" onClick={() => onDeleteRelationship(rel.id)}>
                    מחק קשר
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;
