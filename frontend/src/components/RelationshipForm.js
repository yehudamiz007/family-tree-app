import React, { useState } from 'react';

const RelationshipForm = ({ people, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    person1_id: '',
    person2_id: '',
    relationship_type: 'parent'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.person1_id === formData.person2_id) {
      alert('לא ניתן ליצור קשר של אדם עם עצמו');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>הוסף קשר משפחתי</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>אדם ראשון *</label>
            <select
              name="person1_id"
              value={formData.person1_id}
              onChange={handleChange}
              required
            >
              <option value="">בחר אדם</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.first_name} {person.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>סוג קשר *</label>
            <select
              name="relationship_type"
              value={formData.relationship_type}
              onChange={handleChange}
              required
            >
              <option value="parent">הורה-ילד</option>
              <option value="spouse">בן/בת זוג</option>
              <option value="sibling">אח/אחות</option>
            </select>
          </div>
          <div className="form-group">
            <label>אדם שני *</label>
            <select
              name="person2_id"
              value={formData.person2_id}
              onChange={handleChange}
              required
            >
              <option value="">בחר אדם</option>
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  {person.first_name} {person.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary">
              הוסף קשר
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationshipForm;
