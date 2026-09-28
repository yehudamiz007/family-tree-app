# 🌳 עץ שורשים משפחתי

אפליקציית עץ שורשים משפחתי דינאמית עם תמיכה מלאה בעברית (RTL).

## תכונות

- ✅ הוספה, עריכה ומחיקה של אנשים
- ✅ קשרים משפחתיים (הורים, בני זוג, אחים)
- ✅ ויזואליזציה אינטראקטיבית של העץ המשפחתי
- ✅ חיפוש אנשים
- ✅ תמיכה מלאה בעברית (RTL)
- ✅ מסד נתונים SQLite מקומי

## התקנה והרצה

### 1. התקנת Backend

```bash
cd backend
npm install
npm start
```

השרת ירוץ על `http://localhost:3001`

### 2. התקנת Frontend

בטרמינל חדש:

```bash
cd frontend
npm install
npm start
```

האפליקציה תיפתח על `http://localhost:3000`

## שימוש

1. **הוספת אדם:** לחץ על "הוסף אדם" והזן את הפרטים
2. **הוספת קשר:** בחר שני אנשים וסוג הקשר
3. **צפייה בעץ:** העץ יתעדכן אוטומטית עם הקשרים
4. **חיפוש:** השתמש בתיבת החיפוש למציאת אנשים
5. **עריכה/מחיקה:** לחץ על "ערוך" או "מחק" בכרטיסיית האדם

## מבנה הפרויקט

```
family-tree-app/
├── backend/
│   ├── server.js          # שרת Express
│   ├── database.js        # חיבור SQLite
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js         # קומפוננטה ראשית
│   │   ├── components/
│   │   │   ├── FamilyTree.js      # ויזואליזציה של העץ
│   │   │   ├── PersonForm.js      # טופס הוספת/עריכת אדם
│   │   │   ├── PersonDetails.js   # פרטי אדם
│   │   │   └── RelationshipForm.js # טופס הוספת קשר
│   │   └── index.css
│   └── package.json
└── README.md
```

## טכנולוגיות

- **Backend:** Node.js, Express, SQLite3
- **Frontend:** React, D3.js, Axios
- **Database:** SQLite (מקומי)

## רישיון

MIT