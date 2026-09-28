# הוראות העלאה ל-GitHub Pages

## שלב 1: צור ריפו ב-GitHub
1. התחבר ל-GitHub: https://github.com/login
2. צור ריפו חדש: https://github.com/new
3. שם הריפו: `family-tree-app`
4. בחר "Public"
5. לחץ "Create repository"

## שלב 2: העלה את הקבצים
יש שתי אפשרויות:

### אפשרות א - העלאה ישירה (הכי קלה)
1. הורד את הקובץ `family-tree-app.zip` ששלחתי
2. פתח אותו
3. העלה את כל הקבצים לריפו ב-GitHub (דרך "Upload files")

### אפשרות ב - דרך Git
```bash
cd family-tree-app
git remote add origin https://github.com/yehudamiz007/family-tree-app.git
git branch -M main
git push -u origin main
```

## שלב 3: הפעל GitHub Pages
1. כנס להגדרות הריפו → "Settings"
2. לחץ על "Pages" בתפריט השמאלי
3. תחת "Source" בחר:
   - Branch: `main`
   - Folder: `/root`
4. לחץ "Save"

## שלב 4: המתן
- GitHub Pages צריך כמה דקות להתעדכן
- האתר יהיה זמין בכתובת: `https://yehudamiz007.github.io/family-tree-app`

## הערות חשובות
- הנתונים נשמרים ב-localStorage של הדפדפן
- כל מכשיר/דפדפן שומר נתונים נפרדים
- אפשר לייצא ולייבא נתונים דרך הכפתורים באפליקציה