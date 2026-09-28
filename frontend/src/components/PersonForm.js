import React, { useState, useEffect } from 'react';

const PersonForm = ({ person, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    birth_date: '',
    death_date: '',
    gender: 'other',
    photo_url: '',
    bio: ''
  });

  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name || '',
        last_name: person.last_name || '',
        birth_date: person.birth_date || '',
        death_date: person.death_date || '',
        gender: person.gender || 'other',
        photo_url: person.photo_url || '',
        bio: person.bio || ''
      });
    }
  }, [person]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{person ? 'ערוך אדם' : 'הוסף אדם חדש'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>שם פרטי *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>שם משפחה</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>תאריך לידה</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>תאריך פטירה</label>
            <input
              type="date"
              name="death_date"
              value={formData.death_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>מין</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="male">זכר</option>
              <option value="female">נקבה</option>
              <option value="other">אחר</option>
            </select>
          </div>
          <div className="form-group">
            <label>קישור לתמונה</label>
            <input
              type="url"
              name="photo_url"
              value={formData.photo_url}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
            />
          </div>
          <div className="form-group">
            <label>ביוגרפיה</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="מידע נוסף על האדם..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              ביטול
            </button>
            <button type="submit" className="btn btn-primary">
              {person ? 'עדכן' : 'הוסף'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonForm;