// نظام الإشعارات المحسن والمكتمل
window.appManager = {
    showNotification: function(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        // الرموز حسب النوع
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💡'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.2em;">${icons[type] || icons.info}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="margin-left: auto; background: none; border: none; font-size: 1.2em; cursor: pointer; color: white;">
                    ×
                </button>
            </div>
        `;
        
        // الأنماط
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s ease;
            min-width: 300px;
            max-width: 500px;
        `;
        
        // تخصيص اللون حسب النوع
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f97316',
            info: '#3b82f6'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد 4 ثوان
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
        
        // إضافة أنيميشن CSS إذا لم تكن موجودة
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

// منطق التطبيق المحسن
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initApp();
    
    // إدارة حالة التحميل
    function initApp() {
        // إخفاء شاشة التحميل بعد تحميل الصفحة
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.body.classList.remove('loading');
                const preloader = document.getElementById('preloader');
                if (preloader) {
                    preloader.style.display = 'none';
                }
            }, 1000);
        });
        
        // تهيئة جميع المكونات
        initNavigation();
        initAuthSystem();
        initForms();
        initDiagnosisPage();
        initVitalsPanel();
        initAccordions();
        initModals();
        
        // إضافة تأثيرات تفاعلية
        initInteractiveElements();
    }
    
    // إدارة التنقل
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (navToggle && mobileMenu) {
            navToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.hidden = isExpanded;
            });
        }
        
        // إغلاق القائمة المتنقلة عند النقر على رابط
        const mobileLinks = document.querySelectorAll('.mobile-nav a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navToggle && mobileMenu) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    mobileMenu.hidden = true;
                }
            });
        });
    }
    
    // نظام المصادقة
    function initAuthSystem() {
        const authDialog = document.getElementById('authDialog');
        const registerDialog = document.getElementById('registerDialog');
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeAuthDialog = document.getElementById('closeAuthDialog');
        const closeRegisterDialog = document.getElementById('closeRegisterDialog');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        // فتح نافذة تسجيل الدخول
        if (loginBtn && authDialog) {
            loginBtn.addEventListener('click', () => {
                authDialog.showModal();
            });
        }
        
        // إغلاق نافذة تسجيل الدخول
        if (closeAuthDialog && authDialog) {
            closeAuthDialog.addEventListener('click', () => {
                authDialog.close();
            });
        }
        
        // الانتقال إلى إنشاء حساب
        if (showRegister && authDialog && registerDialog) {
            showRegister.addEventListener('click', () => {
                authDialog.close();
                registerDialog.showModal();
            });
        }
        
        // إغلاق نافذة إنشاء حساب
        if (closeRegisterDialog && registerDialog) {
            closeRegisterDialog.addEventListener('click', () => {
                registerDialog.close();
            });
        }
        
        // الانتقال إلى تسجيل الدخول
        if (showLogin && registerDialog && authDialog) {
            showLogin.addEventListener('click', () => {
                registerDialog.close();
                authDialog.showModal();
            });
        }
        
        // تسجيل الدخول
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                // محاكاة عملية تسجيل الدخول
                simulateLogin(email, password);
            });
        }
        
        // إنشاء حساب
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                
                // محاكاة عملية إنشاء حساب
                simulateRegister(name, email, password);
            });
        }
        
        // تسجيل الخروج
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                simulateLogout();
            });
        }
        
        // التحقق من حالة المستخدم عند التحميل
        checkAuthStatus();
    }
    
    // محاكاة تسجيل الدخول
    function simulateLogin(email, password) {
        const loginBtn = document.querySelector('#loginForm button[type="submit"]');
        
        if (loginBtn) {
            const originalText = loginBtn.textContent;
            loginBtn.textContent = 'جاري تسجيل الدخول...';
            loginBtn.disabled = true;
            
            // محاكاة اتصال بالخادم
            setTimeout(() => {
                // في تطبيق حقيقي، هنا سيتم التحقق من بيانات المستخدم
                
                // حفظ حالة المستخدم
                const userData = {
                    name: email.split('@')[0],
                    email: email,
                    avatar: email.charAt(0).toUpperCase(),
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // إعادة تعيين النموذج
                document.getElementById('loginForm').reset();
                
                // استعادة حالة الزر
                loginBtn.textContent = originalText;
                loginBtn.disabled = false;
                
                // إغلاق النافذة المنبثقة
                const authDialog = document.getElementById('authDialog');
                if (authDialog) authDialog.close();
                
                // تحديث واجهة المستخدم
                updateUIForUser(userData);
                
                // عرض رسالة نجاح
                window.appManager.showNotification('تم تسجيل الدخول بنجاح!', 'success');
                
            }, 1500);
        }
    }
    
    // محاكاة إنشاء حساب
    function simulateRegister(name, email, password) {
        const registerBtn = document.querySelector('#registerForm button[type="submit"]');
        
        if (registerBtn) {
            const originalText = registerBtn.textContent;
            registerBtn.textContent = 'جاري إنشاء الحساب...';
            registerBtn.disabled = true;
            
            // محاكاة اتصال بالخادم
            setTimeout(() => {
                // في تطبيق حقيقي، هنا سيتم إنشاء حساب المستخدم
                
                // حفظ حالة المستخدم
                const userData = {
                    name: name,
                    email: email,
                    avatar: name.charAt(0).toUpperCase(),
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // إعادة تعيين النموذج
                document.getElementById('registerForm').reset();
                
                // استعادة حالة الزر
                registerBtn.textContent = originalText;
                registerBtn.disabled = false;
                
                // إغلاق النافذة المنبثقة
                const registerDialog = document.getElementById('registerDialog');
                if (registerDialog) registerDialog.close();
                
                // تحديث واجهة المستخدم
                updateUIForUser(userData);
                
                // عرض رسالة نجاح
                window.appManager.showNotification('تم إنشاء حسابك بنجاح!', 'success');
                
            }, 1500);
        }
    }
    
    // محاكاة تسجيل الخروج
    function simulateLogout() {
        // إزالة بيانات المستخدم من التخزين المحلي
        localStorage.removeItem('currentUser');
        
        // تحديث واجهة المستخدم
        updateUIForUser(null);
        
        // عرض رسالة نجاح
        window.appManager.showNotification('تم تسجيل الخروج بنجاح!', 'success');
    }
    
    // التحقق من حالة المصادقة
    function checkAuthStatus() {
        const userData = localStorage.getItem('currentUser');
        
        if (userData) {
            try {
                updateUIForUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error parsing user data:', e);
                localStorage.removeItem('currentUser');
                updateUIForUser(null);
            }
        } else {
            updateUIForUser(null);
        }
    }
    
    // تحديث واجهة المستخدم بناءً على حالة المصادقة
    function updateUIForUser(userData) {
        const userSection = document.getElementById('userSection');
        const authSection = document.getElementById('authSection');
        const liveStats = document.getElementById('liveStats');
        
        if (userData && userSection && authSection) {
            // تحديث معلومات المستخدم
            const userName = document.getElementById('userName');
            const userAvatar = document.getElementById('userAvatar');
            
            if (userName) userName.textContent = `مرحباً، ${userData.name}`;
            if (userAvatar) userAvatar.textContent = userData.avatar;
            
            // عرض قسم المستخدم وإخفاء قسم المصادقة
            userSection.style.display = 'flex';
            authSection.style.display = 'none';
            
            // توليد إحصائيات عشوائية للمستخدم
            if (liveStats) {
                const totalRecords = Math.floor(Math.random() * 50) + 1;
                const recentRecords = Math.floor(Math.random() * 10) + 1;
                
                const totalRecordsEl = document.getElementById('totalRecords');
                const recentRecordsEl = document.getElementById('recentRecords');
                
                if (totalRecordsEl) totalRecordsEl.textContent = totalRecords;
                if (recentRecordsEl) recentRecordsEl.textContent = recentRecords;
                
                liveStats.style.display = 'flex';
            }
        } else {
            if (userSection) userSection.style.display = 'none';
            if (authSection) authSection.style.display = 'block';
            if (liveStats) liveStats.style.display = 'none';
        }
    }
    
    // إدارة النماذج
    function initForms() {
        // نموذج الاتصال
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const message = document.getElementById('contactMessage').value;
                const feedback = document.getElementById('contactFeedback');
                
                // التحقق من صحة البيانات
                if (!name || !email || !message) {
                    showFormFeedback(feedback, 'يرجى ملء جميع الحقول المطلوبة', 'error');
                    return;
                }
                
                // محاكاة إرسال النموذج
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'جاري الإرسال...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    // إعادة تعيين النموذج
                    contactForm.reset();
                    
                    // استعادة حالة الزر
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // عرض رسالة النجاح
                    showFormFeedback(feedback, 'شكراً لك! تم استلام رسالتك وسنرد عليك قريباً.', 'success');
                    
                    // إخفاء الرسالة بعد 5 ثوان
                    setTimeout(() => {
                        if (feedback) feedback.hidden = true;
                    }, 5000);
                    
                }, 1500);
            });
        }
    }
    
    // صفحة التشخيص
    function initDiagnosisPage() {
        const diagnosisForm = document.getElementById('diagnosisForm');
        const clearFormBtn = document.getElementById('clearFormBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        const saveResultsBtn = document.getElementById('saveResultsBtn');
        const shareResultsBtn = document.getElementById('shareResultsBtn');
        const printResultsBtn = document.getElementById('printResultsBtn');
        
        // مسح النموذج
        if (clearFormBtn && diagnosisForm) {
            clearFormBtn.addEventListener('click', () => {
                diagnosisForm.reset();
            });
        }
        
        // تحليل الأعراض
        if (diagnosisForm && analyzeBtn) {
            diagnosisForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const symptomsText = document.getElementById('symptomsText');
                const symptomsDuration = document.getElementById('symptomsDuration');
                const symptomsSeverity = document.getElementById('symptomsSeverity');
                
                if (!symptomsText || !symptomsDuration || !symptomsSeverity) {
                    window.appManager.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                    return;
                }
                
                // التحقق من صحة البيانات
                if (!symptomsText.value || !symptomsDuration.value || !symptomsSeverity.value) {
                    window.appManager.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                    return;
                }
                
                // بدء عملية التحليل
                startSymptomsAnalysis(symptomsText.value, symptomsDuration.value, symptomsSeverity.value);
            });
        }
        
        // حفظ النتائج
        if (saveResultsBtn) {
            saveResultsBtn.addEventListener('click', () => {
                const userData = localStorage.getItem('currentUser');
                
                if (!userData) {
                    window.appManager.showNotification('يرجى تسجيل الدخول لحفظ النتائج', 'error');
                    const authDialog = document.getElementById('authDialog');
                    if (authDialog) authDialog.showModal();
                    return;
                }
                
                // محاكاة حفظ النتائج
                simulateSaveResults();
            });
        }
        
        // مشاركة النتائج
        if (shareResultsBtn) {
            shareResultsBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: 'نتائج التشخيص - منصة تشخيص فوري',
                        text: 'اطلع على نتائج تشخيصي من منصة تشخيص فوري',
                        url: window.location.href,
                    })
                    .then(() => window.appManager.showNotification('تم مشاركة النتائج بنجاح', 'success'))
                    .catch(() => window.appManager.showNotification('لم يتمكن من المشاركة', 'error'));
                } else {
                    window.appManager.showNotification('ميزة المشاركة غير مدعومة في متصفحك', 'error');
                }
            });
        }
        
        // طباعة النتائج
        if (printResultsBtn) {
            printResultsBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }
    
    // بدء تحليل الأعراض
    function startSymptomsAnalysis(symptoms, duration, severity) {
        const analyzeBtn = document.getElementById('analyzeBtn');
        const resultsPlaceholder = document.getElementById('resultsPlaceholder');
        const diagnosisResults = document.getElementById('diagnosisResults');
        const analysisProgress = document.getElementById('analysisProgress');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!analyzeBtn) return;
        
        // عرض حالة التحميل
        const originalText = analyzeBtn.textContent;
        analyzeBtn.textContent = 'جاري التحليل...';
        analyzeBtn.disabled = true;
        
        // إخفاء النتائج السابقة وعرض شريط التقدم
        if (resultsPlaceholder) resultsPlaceholder.hidden = true;
        if (diagnosisResults) diagnosisResults.hidden = true;
        if (analysisProgress) analysisProgress.hidden = false;
        
        // محاكاة عملية التحليل
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 5;
            if (progressFill) progressFill.style.width = `${progress}%`;
            
            if (progressText) {
                if (progress <= 30) {
                    progressText.textContent = 'جاري تحليل الأعراض...';
                } else if (progress <= 60) {
                    progressText.textContent = 'مقارنة مع قاعدة البيانات...';
                } else if (progress <= 90) {
                    progressText.textContent = 'توليد التوصيات...';
                } else {
                    progressText.textContent = 'اكتمل التحليل!';
                }
            }
            
            if (progress >= 100) {
                clearInterval(progressInterval);
                
                // إخفاء شريط التقدم وعرض النتائج
                setTimeout(() => {
                    if (analysisProgress) analysisProgress.hidden = true;
                    
                    // توليد نتائج عشوائية للمحاكاة
                    generateMockResults(symptoms, duration, severity);
                    
                    if (diagnosisResults) diagnosisResults.hidden = false;
                    
                    // استعادة حالة الزر
                    analyzeBtn.textContent = originalText;
                    analyzeBtn.disabled = false;
                }, 500);
            }
        }, 100);
    }
    
    // توليد نتائج محاكاة للتحليل
    function generateMockResults(symptoms, duration, severity) {
        const conditions = [
            {
                name: 'التهاب الجهاز التنفسي العلوي',
                description: 'عدوى فيروسية تؤثر على الأنف والحلق والجهاز التنفسي العلوي',
                probability: Math.floor(Math.random() * 30) + 60,
                recommendations: [
                    'الراحة وتجنب الإجهاد',
                    'شرب كميات كافية من السوائل',
                    'تناول مسكنات الألم إذا لزم الأمر',
                    'استشارة الطبيب إذا استمرت الأعراض أكثر من أسبوع'
                ]
            },
            {
                name: 'حساسية موسمية',
                description: 'رد فعل تحسسي تجاه حبوب اللقاح أو مسببات الحساسية البيئية',
                probability: Math.floor(Math.random() * 40) + 30,
                recommendations: [
                    'تجنب مسببات الحساسية المعروفة',
                    'استخدام مضادات الهيستامين',
                    'الاستحمام بعد الخروج من المنزل',
                    'استشارة أخصائي الحساسية إذا تكررت الأعراض'
                ]
            }
        ];
        
        // اختيار حالة عشوائية
        const selectedCondition = conditions[Math.floor(Math.random() * conditions.length)];
        
        // تحديث واجهة النتائج
        const primaryCondition = document.getElementById('primaryCondition');
        const conditionDescription = document.getElementById('conditionDescription');
        const probabilityFill = document.getElementById('probabilityFill');
        const probabilityText = document.getElementById('probabilityText');
        const recommendationsList = document.getElementById('recommendationsList');
        const resultsDate = document.getElementById('resultsDate');
        const resultsConfidence = document.getElementById('resultsConfidence');
        
        if (primaryCondition) primaryCondition.textContent = selectedCondition.name;
        if (conditionDescription) conditionDescription.textContent = selectedCondition.description;
        if (probabilityFill) probabilityFill.style.width = `${selectedCondition.probability}%`;
        if (probabilityText) probabilityText.textContent = `${selectedCondition.probability}% احتمالية`;
        
        // تحديث قائمة التوصيات
        if (recommendationsList) {
            recommendationsList.innerHTML = '';
            selectedCondition.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                recommendationsList.appendChild(li);
            });
        }
        
        // تحديث التاريخ والثقة
        const now = new Date();
        if (resultsDate) resultsDate.textContent = now.toLocaleDateString('ar-SA');
        if (resultsConfidence) resultsConfidence.textContent = 'ثقة متوسطة';
    }
    
    // محاكاة حفظ النتائج
    function simulateSaveResults() {
        const saveBtn = document.getElementById('saveResultsBtn');
        if (!saveBtn) return;
        
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'جاري الحفظ...';
        saveBtn.disabled = true;
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
            window.appManager.showNotification('تم حفظ النتائج بنجاح', 'success');
        }, 1000);
    }
    
    // لوحة المؤشرات الحيوية
    function initVitalsPanel() {
        const updateVitalsBtn = document.getElementById('updateVitalsBtn');
        const fingerCheckBtn = document.getElementById('fingerCheckBtn');
        const fingerDialog = document.getElementById('fingerDialog');
        const closeFingerDialog = document.getElementById('closeFingerDialog');
        
        // تحديث المؤشرات الحيوية
        if (updateVitalsBtn) {
            updateVitalsBtn.addEventListener('click', () => {
                updateVitalsRandomly();
            });
        }
        
        // فحص البصمة
        if (fingerCheckBtn && fingerDialog) {
            fingerCheckBtn.addEventListener('click', () => {
                fingerDialog.showModal();
                startFingerScan();
            });
        }
        
        // إغلاق نافذة فحص البصمة
        if (closeFingerDialog && fingerDialog) {
            closeFingerDialog.addEventListener('click', () => {
                fingerDialog.close();
            });
        }
    }
    
    // تحديث المؤشرات الحيوية عشوائياً
    function updateVitalsRandomly() {
        const vitals = {
            bp: {
                value: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 30) + 60}`,
                status: Math.random() > 0.2 ? 'طبيعي' : 'مرتفع'
            },
            glucose: {
                value: `${Math.floor(Math.random() * 60) + 70} mg/dL`,
                status: Math.random() > 0.15 ? 'طبيعي' : 'مرتفع'
            },
            pulse: {
                value: `${Math.floor(Math.random() * 40) + 60} bpm`,
                status: Math.random() > 0.1 ? 'طبيعي' : 'مرتفع'
            }
        };
        
        // تحديث القيم
        const bpValue = document.getElementById('bpValue');
        const glucoseValue = document.getElementById('glucoseValue');
        const pulseValue = document.getElementById('pulseValue');
        const bpStatus = document.getElementById('bpStatus');
        const glucoseStatus = document.getElementById('glucoseStatus');
        const pulseStatus = document.getElementById('pulseStatus');
        
        if (bpValue) bpValue.textContent = vitals.bp.value;
        if (glucoseValue) glucoseValue.textContent = vitals.glucose.value;
        if (pulseValue) pulseValue.textContent = vitals.pulse.value;
        
        // تحديث الحالة
        if (bpStatus) bpStatus.textContent = vitals.bp.status;
        if (glucoseStatus) glucoseStatus.textContent = vitals.glucose.status;
        if (pulseStatus) pulseStatus.textContent = vitals.pulse.status;
        
        // إضافة إشعار إلى الخط الزمني
        addTimelineNotification('تم تحديث المؤشرات الحيوية');
        
        window.appManager.showNotification('تم تحديث المؤشرات الحيوية', 'success');
    }
    
    // بدء فحص البصمة
    function startFingerScan() {
        const fingerResult = document.getElementById('fingerResult');
        if (!fingerResult) return;
        
        fingerResult.textContent = 'جاري قراءة البيانات الحيوية...';
        
        // محاكاة عملية الفحص
        setTimeout(() => {
            const oxygen = Math.floor(Math.random() * 5) + 95;
            const pulse = Math.floor(Math.random() * 30) + 60;
            
            fingerResult.textContent = `تم القياس: الأكسجين ${oxygen}%، النبض ${pulse} نبضة/دقيقة`;
            
            // إضافة إشعار إلى الخط الزمني
            addTimelineNotification(`فحص البصمة: الأكسجين ${oxygen}%، النبض ${pulse}`);
            
        }, 3000);
    }
    
    // إضافة إشعار إلى الخط الزمني
    function addTimelineNotification(message) {
        const timeline = document.getElementById('insightsTimeline');
        
        if (timeline) {
            const newItem = document.createElement('li');
            newItem.className = 'timeline__item';
            newItem.textContent = message;
            
            // إضافة العنصر الجديد في الأعلى
            timeline.insertBefore(newItem, timeline.firstChild);
            
            // الاحتفاظ بعدد محدود من العناصر
            if (timeline.children.length > 5) {
                timeline.removeChild(timeline.lastChild);
            }
        }
    }
    
    // المكونات القابلة للطي
    function initAccordions() {
        const accordionToggles = document.querySelectorAll('.accordion-toggle');
        
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                const panelId = this.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                
                if (panel) {
                    // تبديل الحالة
                    this.setAttribute('aria-expanded', !isExpanded);
                    panel.hidden = isExpanded;
                }
            });
        });
    }
    
    // النوافذ المنبثقة
    function initModals() {
        // إغلاق النوافذ المنبثقة عند النقر خارجها
        const modals = document.querySelectorAll('.modal');
        
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.close();
                }
            });
        });
    }
    
    // العناصر التفاعلية
    function initInteractiveElements() {
        // إضافة تأثيرات للبطاقات التفاعلية
        const interactiveCards = document.querySelectorAll('.interactive-card');
        
        interactiveCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    // وظائف المساعدة
    function showFormFeedback(element, message, type) {
        if (element) {
            element.textContent = message;
            element.className = `form-feedback form-feedback--${type}`;
            element.hidden = false;
        }
    }
});

// نظام التخزين المحسن
class EnhancedStorage {
  static set(key, value, ttl = 24 * 60 * 60 * 1000) {
    const item = {
      value: value,
      expiry: Date.now() + ttl
    };
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
      console.warn('LocalStorage full, clearing expired items');
      this.clearExpired();
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (e2) {
        console.error('Failed to store item after cleanup:', e2);
      }
    }
  }

  static get(key) {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      console.error('Error reading from storage:', e);
      return null;
    }
  }

  static clearExpired() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(item);
          if (parsed.expiry && Date.now() > parsed.expiry) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          // ليس عنصرًا من نظامنا
        }
      }
    }
  }
}

// نظام التحليلات المحسن
class AnalyticsManager {
  static trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    
    // حفظ محلي للتحليلات
    const analytics = EnhancedStorage.get('analytics') || [];
    analytics.push({
      timestamp: new Date().toISOString(),
      category,
      action,
      label
    });
    EnhancedStorage.set('analytics', analytics.slice(-100)); // حفظ آخر 100 حدث
  }
}

// نظام إدارة الأخطاء المحسن
class ErrorHandler {
  static init() {
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        type: 'unhandledrejection',
        reason: event.reason?.stack || event.reason
      });
    });
  }

  static logError(errorInfo) {
    const errors = EnhancedStorage.get('app_errors') || [];
    errors.push({
      ...errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    EnhancedStorage.set('app_errors', errors.slice(-50)); // حفظ آخر 50 خطأ
    
    // في بيئة الإنتاج، إرسال إلى خدمة تحليل الأخطاء
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
      this.reportError(errorInfo);
    }
  }

  static reportError(errorInfo) {
    // تنفيذ إرسال الخطأ إلى خدمة خارجية
    console.error('Application Error:', errorInfo);
  }
}

// نظام إدارة الحالة المحسن
class StateManager {
  constructor() {
    this.state = {};
    this.listeners = new Map();
  }

  setState(key, value) {
    const oldValue = this.state[key];
    this.state[key] = value;
    
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(callback => {
        callback(value, oldValue);
      });
    }
    
    // حفظ الحالة المهمة
    if (key === 'currentUser' || key === 'diagnosisHistory') {
      EnhancedStorage.set(key, value);
    }
  }

  getState(key) {
    return this.state[key] || EnhancedStorage.get(key);
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    return () => this.unsubscribe(key, callback);
  }

  unsubscribe(key, callback) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).delete(callback);
    }
  }
}

// تهيئة الأنظمة المحسنة
document.addEventListener('DOMContentLoaded', function() {
  // تهيئة نظام إدارة الأخطاء
  ErrorHandler.init();
  
  // تهيئة نظام إدارة الحالة
  window.appState = new StateManager();
  
  // تتبع الأحداث المهمة
  AnalyticsManager.trackEvent('App', 'Load', window.location.pathname);
  
  // تحسين أداء الصور
  initImageOptimization();
});

// تحسين تحميل الصور
function initImageOptimization() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}

// نظام التحميل المتقدم
class AdvancedLoader {
  static async loadComponent(componentName) {
    try {
      const response = await fetch(`/components/${componentName}.html`);
      if (!response.ok) throw new Error('Component not found');
      
      const html = await response.text();
      return html;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      return `<div class="error">Failed to load ${componentName}</div>`;
    }
  }

  static async loadScript(src, options = {}) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      
      if (options.module) script.type = 'module';
      
      script.onload = resolve;
      script.onerror = reject;
      
      document.head.appendChild(script);
    });
  }
}

// جعل الدوال متاحة عالمياً للاستخدام
window.EnhancedStorage = EnhancedStorage;
window.AnalyticsManager = AnalyticsManager;
window.ErrorHandler = ErrorHandler;
window.AdvancedLoader = AdvancedLoader;