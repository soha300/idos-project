// database.js
// تهيئة قاعدة بيانات Dexie
const db = new Dexie('IDOSHealthDB');

// تعريف هيكل قاعدة البيانات
db.version(1).stores({
    // سجل التشخيصات
    diagnosisHistory: '++id, disease, department, timestamp, symptoms, advice',
    
    // سجل المحادثات
    chatHistory: '++id, author, message, timestamp',
    
    // إعدادات المستخدم
    userSettings: '++id, key, value',
    
    // جلسات المستخدم
    userSessions: '++id, email, name, timestamp, isActive',
    
    // المستشفيات المفضلة
    favoriteHospitals: '++id, hospitalId, name, location, addedAt',
    
    // المؤشرات الحيوية
    vitalSigns: '++id, type, value, status, timestamp'
});

// الفتح والتهيئة
db.open().catch(err => {
    console.error('فشل في فتح قاعدة البيانات:', err);
});

// تصدير الكائن للاستخدام في باقي الملفات
window.idosDB = db;