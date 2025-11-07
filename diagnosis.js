// نظام تشخيص محسّن ومدمج
class DiagnosisSystem {
    constructor() {
        this.diseases = [];
        this.selectedSymptoms = new Set();
        this.history = [];
        this.symptomCache = new Map();
        
        // تهيئة نظام التخزين المحسن
        this.optimizedStorage = {
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (e) {
                    console.warn('LocalStorage full');
                    // استخدام التخزين المؤقت كبديل
                    this.symptomCache.set(key, value);
                }
            },
            get: (key) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                } catch (e) {
                    // محاولة الاسترجاع من التخزين المؤقت
                    return this.symptomCache.get(key) || null;
                }
            }
        };

        this.init();
    }

    async init() {
        // الانتظار حتى تحميل DOM
        if (document.readyState === 'loading') {
            document.addEventListener("DOMContentLoaded", async () => {
                await this.initializeData();
                this.setupEventListeners();
                this.renderUI();
            });
        } else {
            await this.initializeData();
            this.setupEventListeners();
            this.renderUI();
        }
    }

    async initializeData() {
        try {
            await this.loadDiseases();
            this.loadHistory();
            await this.enhancedInit();
        } catch (error) {
            console.error("خطأ في تهيئة البيانات:", error);
        }
    }

    async loadDiseases() {
        // محاولة تحميل من الكاش أولاً
        const cached = sessionStorage.getItem('diseases_cache');
        if (cached) {
            try {
                this.diseases = JSON.parse(cached);
                return;
            } catch (e) {
                console.warn('خطأ في تحليل الكاش، جاري التحميل من جديد');
            }
        }

        try {
            const response = await fetch("diseases.json");
            if (!response.ok) throw new Error("تعذر تحميل قاعدة البيانات");
            
            let diseases = await response.json();
            diseases = this.validateDiseasesData(diseases);
            
            if (diseases.length === 0) {
                throw new Error("لا توجد بيانات صالحة للأمراض");
            }
            
            this.diseases = diseases;
            // حفظ في الكاش
            try {
                sessionStorage.setItem('diseases_cache', JSON.stringify(this.diseases));
            } catch (e) {
                console.warn('تعذر حفظ الكاش، جاري استخدام البيانات فقط');
            }
        } catch (error) {
            console.error("خطأ في تحميل الأمراض:", error);
            this.diseases = this.getFallbackDiseases();
        }
    }

    validateDiseasesData(diseases) {
        if (!Array.isArray(diseases)) {
            console.warn('بيانات الأمراض ليست مصفوفة');
            return this.getFallbackDiseases();
        }

        return diseases.filter(disease => 
            disease && 
            disease.name && 
            disease.department && 
            Array.isArray(disease.symptoms) && 
            disease.symptoms.length > 0 &&
            disease.advice
        );
    }

    getFallbackDiseases() {
        return [
            {
                "name": "نزلة برد",
                "department": "طب عام",
                "symptoms": ["رشح", "كحة", "احتقان", "حرارة خفيفة", "عطس", "صداع خفيف"],
                "advice": "الراحة وشرب السوائل الدافئة، ويمكن تناول مسكن للألم وخافض حرارة بسيط عند الحاجة."
            },
            {
                "name": "إنفلونزا موسمية",
                "department": "طب عام", 
                "symptoms": ["حمى", "قشعريرة", "ألم عضلات", "إرهاق", "كحة", "صداع"],
                "advice": "الراحة التامة وتناول سوائل دافئة وأدوية تخفف الألم وخافض حرارة، ومراجعة الطبيب عند استمرار الأعراض."
            },
            {
                "name": "صداع التوتر",
                "department": "طب عام",
                "symptoms": ["صداع", "ألم في الرقبة", "توتر", "إرهاق"],
                "advice": "الراحة وتقليل التوتر، وتناول مسكنات الألم البسيطة، والتدليك الخفيف للرقبة والرأس."
            }
        ];
    }

    setupEventListeners() {
        // نموذج الأعراض النصي
        const symptomForm = document.getElementById("symptomForm");
        if (symptomForm) {
            symptomForm.addEventListener("submit", (e) => this.analyzeTextSymptoms(e));
        }
        
        // تفريغ النتائج
        const clearResultsBtn = document.getElementById("clearResultsBtn");
        if (clearResultsBtn) {
            clearResultsBtn.addEventListener("click", () => this.clearResults());
        }

        // اقتراحات الأعراض
        this.setupSuggestionChips();
    }

    setupSuggestionChips() {
        const suggestionChips = document.getElementById("suggestionChips");
        if (!suggestionChips) return;

        const symptoms = this.getAllSymptoms().slice(0, 15);
        suggestionChips.innerHTML = "";

        symptoms.forEach(symptom => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip chip--light";
            chip.textContent = symptom;
            chip.title = `إضافة ${symptom}`;
            chip.addEventListener("click", () => this.addSymptomFromText(symptom));
            suggestionChips.appendChild(chip);
        });
    }

    getAllSymptoms() {
        const symptomsSet = new Set();
        this.diseases.forEach(disease => {
            if (disease.symptoms) {
                disease.symptoms.forEach(symptom => symptomsSet.add(symptom));
            }
        });
        return Array.from(symptomsSet).sort((a, b) => a.localeCompare(b, "ar"));
    }

    addSymptomFromText(symptom) {
        const textarea = document.getElementById("symptomsText");
        if (!textarea) return;

        const currentText = textarea.value.trim();
        const symptoms = currentText ? currentText.split(/[،,]\s*/) : [];
        
        if (!symptoms.includes(symptom)) {
            symptoms.push(symptom);
            textarea.value = symptoms.join('، ');
        }
        
        textarea.focus();
    }

    // تحليل النص المحسن
    async analyzeTextSymptoms(event) {
        if (event) {
            event.preventDefault();
        }
        
        const textarea = document.getElementById("symptomsText");
        if (!textarea) return;

        const symptomsText = textarea.value.trim();
        if (!symptomsText) {
            this.showError("يرجى إدخال الأعراض التي تشعر بها.");
            return;
        }

        // استخراج الأعراض من النص
        const symptoms = this.extractSymptomsFromText(symptomsText);
        if (symptoms.length === 0) {
            this.showError("لم يتم التعرف على أعراض صحيحة. يرجى وصف الأعراض بشكل أوضح.");
            return;
        }

        if (symptoms.length < 2) {
            this.showSuggestion("لتحسين دقة التشخيص، ننصح بإضافة عرضين على الأقل.");
        }

        this.showLoading();
        
        try {
            const results = await this.enhancedMatchDiseases(symptoms);
            this.renderResults(results);
            this.saveToHistory(results, symptoms);
        } catch (error) {
            console.error("خطأ في التحليل:", error);
            this.showError("حدث خطأ أثناء التحليل. يرجى المحاولة مرة أخرى.");
        } finally {
            this.hideLoading();
        }
    }

    extractSymptomsFromText(text) {
        const symptoms = text.split(/[،,.\n]\s*/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
        
        const allSymptoms = this.getAllSymptoms();
        const recognizedSymptoms = [];

        symptoms.forEach(symptom => {
            const matched = allSymptoms.find(s => this.fuzzyMatch(symptom, s));
            if (matched) {
                recognizedSymptoms.push(matched);
            } else if (symptom.length > 2) {
                // إضافة الأعراض الجديدة إذا كانت طويلة بما يكفي
                recognizedSymptoms.push(symptom);
            }
        });

        return [...new Set(recognizedSymptoms)]; // إزالة التكرارات
    }

    // خوارزمية مطابقة محسنة
    matchDiseases(userSymptoms) {
        if (!userSymptoms || userSymptoms.length === 0) return [];

        const results = [];
        const symptomCount = userSymptoms.length;

        this.diseases.forEach(disease => {
            if (!disease.symptoms) return;

            const matchedSymptoms = disease.symptoms.filter(symptom => 
                userSymptoms.some(userSymptom => 
                    this.fuzzyMatch(userSymptom, symptom)
                )
            );

            if (matchedSymptoms.length > 0) {
                const matchPercentage = (matchedSymptoms.length / symptomCount) * 100;
                const diseaseMatch = (matchedSymptoms.length / disease.symptoms.length) * 100;
                
                // حساب النتيجة النهائية مع أوزان مختلفة
                const finalScore = (matchPercentage * 0.6) + (diseaseMatch * 0.4);
                
                if (finalScore >= 30) {
                    results.push({
                        ...disease,
                        matchScore: Math.min(Math.round(finalScore), 95),
                        matchedSymptoms,
                        userInputSymptoms: userSymptoms
                    });
                }
            }
        });

        return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
    }

    // مطابقة تقريبية محسنة
    fuzzyMatch(str1, str2) {
        if (!str1 || !str2) return false;

        const cleanStr1 = str1.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
        const cleanStr2 = str2.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase().trim();
        
        if (cleanStr1 === cleanStr2) return true;
        if (cleanStr1.includes(cleanStr2) || cleanStr2.includes(cleanStr1)) return true;
        
        // حساب تشابه جاكارد للكلمات
        const words1 = cleanStr1.split(' ').filter(w => w.length > 0);
        const words2 = cleanStr2.split(' ').filter(w => w.length > 0);
        
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        if (union.size === 0) return false;
        
        return intersection.size / union.size > 0.3;
    }

    // تحسين عرض النتائج
    renderResults(results) {
        const container = document.getElementById("diagnosisResults");
        if (!container) return;

        if (!results || results.length === 0) {
            container.innerHTML = this.getNoResultsHTML();
            return;
        }

        // استخدام DocumentFragment لتحسين الأداء
        const fragment = document.createDocumentFragment();
        
        results.forEach(result => {
            const card = this.createResultCard(result);
            fragment.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
        
        // إضافة رسالة إحصائية
        this.showResultsSummary(results);
    }

    createResultCard(result) {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
            <div class="result-card__header">
                <div class="result-card__icon">🩺</div>
                <div>
                    <h3>${this.escapeHtml(result.name)}</h3>
                    <div class="result-card__match">مطابقة: ${result.matchScore}%</div>
                </div>
            </div>
            <div class="result-card__department">
                ${this.escapeHtml(result.department)}
            </div>
            <div class="result-card__symptoms">
                <strong>الأعراض المتطابقة:</strong>
                <span>${this.escapeHtml(result.matchedSymptoms?.join('، ') || '')}</span>
            </div>
            <div class="result-card__footer">
                <strong>التوصية:</strong>
                <p>${this.escapeHtml(result.advice)}</p>
            </div>
        `;
        
        return card;
    }

    // دالة للأمان لمنع هجمات XSS
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getNoResultsHTML() {
        return `
            <div class="placeholder-card">
                <span>🔍</span>
                <p>لم نتمكن من العثور على تشخيصات مطابقة للأعراض المدخلة.</p>
                <p class="muted">جرب وصف الأعراض بشكل أكثر دقة أو أضف المزيد من الأعراض.</p>
            </div>
        `;
    }

    showResultsSummary(results) {
        const summary = document.createElement('div');
        summary.className = 'results-summary';
        summary.innerHTML = `
            <p>تم العثور على ${results.length} تشخيص محتمل بناءً على الأعراض المدخلة.</p>
        `;
        
        const container = document.getElementById("diagnosisResults");
        if (container && container.firstChild) {
            container.insertBefore(summary, container.firstChild);
        } else {
            container.appendChild(summary);
        }
    }

    clearResults() {
        if (!confirm("هل تريد تفريغ نتائج التشخيص الحالية؟")) return;
        
        const container = document.getElementById("diagnosisResults");
        const textarea = document.getElementById("symptomsText");
        
        if (container) {
            container.innerHTML = `
                <div class="placeholder-card">
                    <span>🔍</span>
                    <p>قم بإدخال الأعراض ثم اضغط على "تشغيل التحليل الذكي" لعرض النتائج هنا.</p>
                </div>
            `;
        }
        
        if (textarea) {
            textarea.value = '';
        }
    }

    showLoading() {
        const button = document.getElementById("analyzeBtn");
        if (button) {
            button.disabled = true;
            button.textContent = "جاري التحليل...";
        }
    }

    hideLoading() {
        const button = document.getElementById("analyzeBtn");
        if (button) {
            button.disabled = false;
            button.textContent = "تشغيل التحليل الذكي";
        }
    }

    showError(message) {
        if (window.appManager && window.appManager.showNotification) {
            window.appManager.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    showSuggestion(message) {
        if (window.appManager && window.appManager.showNotification) {
            window.appManager.showNotification(message, 'info');
        }
    }

    // نظام السجل المحسن
    saveToHistory(results, symptoms) {
        const historyItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            symptoms: symptoms,
            results: results.map(r => ({
                name: r.name,
                matchScore: r.matchScore,
                department: r.department
            })),
            resultCount: results.length
        };

        this.history.unshift(historyItem);
        this.history = this.history.slice(0, 10); // حفظ آخر 10 تشخيصات فقط
        
        this.optimizedStorage.set('diagnosis_history', this.history);
        this.renderHistory();
    }

    loadHistory() {
        const saved = this.optimizedStorage.get('diagnosis_history');
        if (saved && Array.isArray(saved)) {
            this.history = saved;
            this.renderHistory();
        }
    }

    renderHistory() {
        const container = document.getElementById("historyList");
        if (!container) return;

        if (this.history.length === 0) {
            container.innerHTML = `
                <div class="placeholder-card">
                    <span>🗂️</span>
                    <p>سيتم عرض سجل التشخيصات السابقة هنا.</p>
                </div>
            `;
            return;
        }

        const fragment = document.createDocumentFragment();
        
        this.history.forEach(item => {
            const card = this.createHistoryCard(item);
            fragment.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(fragment);
    }

    createHistoryCard(item) {
        const card = document.createElement("div");
        card.className = "history-card";
        
        const date = new Date(item.timestamp).toLocaleDateString("ar-EG", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <h4>تشخيص ${date}</h4>
            <p><strong>الأعراض:</strong> ${this.escapeHtml(item.symptoms?.join('، ') || '')}</p>
            <p><strong>عدد النتائج:</strong> ${item.resultCount || 0}</p>
            <div class="history-date">${new Date(item.timestamp).toLocaleTimeString("ar-EG")}</div>
        `;

        card.addEventListener('click', () => {
            this.loadHistoryItem(item);
        });

        return card;
    }

    loadHistoryItem(item) {
        const textarea = document.getElementById("symptomsText");
        if (textarea) {
            textarea.value = item.symptoms?.join('، ') || '';
        }
        
        this.renderResults(item.results?.map(r => ({
            ...r,
            matchedSymptoms: item.symptoms || []
        })) || []);
    }

    renderUI() {
        this.renderHistory();
    }

    // النظام المحسن - التهيئة
    async enhancedInit() {
        this.diagnosisCache = new DiagnosisCache();
    }

    // المطابقة المحسنة
    async enhancedMatchDiseases(userSymptoms, userInfo = {}) {
        const cacheKey = JSON.stringify({ symptoms: userSymptoms, userInfo });
        const cached = this.diagnosisCache.get(cacheKey);
        
        if (cached) {
            if (window.AnalyticsManager) {
                window.AnalyticsManager.trackEvent('Diagnosis', 'CacheHit', userSymptoms.join(','));
            }
            return cached;
        }

        const baseResults = this.matchDiseases(userSymptoms);
        
        // تطبيق عوامل الترجيح بناءً على معلومات المستخدم
        const enhancedResults = baseResults.map(result => {
            let adjustedScore = result.matchScore;
            
            // تعديل بناءً على العمر
            if (userInfo.age) {
                if (userInfo.age < 18 && this.isAdultDisease(result.name)) {
                    adjustedScore *= 0.7;
                }
                if (userInfo.age > 60 && this.isAgeSensitiveDisease(result.name)) {
                    adjustedScore *= 1.2;
                }
            }
            
            // تعديل بناءً على الجنس
            if (userInfo.gender && this.isGenderSpecificDisease(result.name, userInfo.gender)) {
                adjustedScore *= 1.3;
            }
            
            return {
                ...result,
                matchScore: Math.min(Math.round(adjustedScore), 95),
                originalScore: result.matchScore
            };
        }).filter(result => result.matchScore >= 25)
          .sort((a, b) => b.matchScore - a.matchScore);

        this.diagnosisCache.set(cacheKey, enhancedResults);
        
        if (window.AnalyticsManager) {
            window.AnalyticsManager.trackEvent('Diagnosis', 'NewAnalysis', userSymptoms.join(','));
        }
        
        return enhancedResults;
    }

    // دوال مساعدة للتصنيف
    isAdultDisease(diseaseName) {
        const adultDiseases = ['ضغط الدم', 'سكري', 'كولسترول'];
        return adultDiseases.some(adultDisease => 
            diseaseName.toLowerCase().includes(adultDisease.toLowerCase())
        );
    }

    isAgeSensitiveDisease(diseaseName) {
        const ageSensitive = ['هشاشة العظام', 'الزهايمر', 'الرعاش'];
        return ageSensitive.some(disease => 
            diseaseName.toLowerCase().includes(disease.toLowerCase())
        );
    }

    isGenderSpecificDisease(diseaseName, gender) {
        const femaleDiseases = ['تكيس المبايض', 'انتباذ بطاني', 'أورام ثدي'];
        const maleDiseases = ['بروستاتا', 'صلع ذكوري'];
        
        if (gender === 'female') {
            return femaleDiseases.some(disease => 
                diseaseName.toLowerCase().includes(disease.toLowerCase())
            );
        } else if (gender === 'male') {
            return maleDiseases.some(disease => 
                diseaseName.toLowerCase().includes(disease.toLowerCase())
            );
        }
        
        return false;
    }
}

// نظام الذاكرة المؤقتة المحسن
class DiagnosisCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100;
    }

    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        // التحقق من انتهاء الصلاحية (5 دقائق)
        if (Date.now() - item.timestamp > 5 * 60 * 1000) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clear() {
        this.cache.clear();
    }
}

// تهيئة نظام التشخيص
let diagnosisSystem;

function initializeDiagnosisSystem() {
    try {
        diagnosisSystem = new DiagnosisSystem();
        return diagnosisSystem;
    } catch (error) {
        console.error('فشل في تهيئة نظام التشخيص:', error);
        return null;
    }
}

// التهيئة التلقائية عندما يكون جاهزاً
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            diagnosisSystem = initializeDiagnosisSystem();
        }, 100);
    });
}

// جعل النظام متاحاً عالمياً للاستخدام
if (typeof window !== 'undefined') {
    window.DiagnosisSystem = DiagnosisSystem;
    window.DiagnosisCache = DiagnosisCache;
}