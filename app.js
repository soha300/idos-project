document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const timeline = document.getElementById("insightsTimeline");

    const bpValue = document.getElementById("bpValue");
    const bpStatus = document.getElementById("bpStatus");
    const glucoseValue = document.getElementById("glucoseValue");
    const glucoseStatus = document.getElementById("glucoseStatus");
    const pulseValue = document.getElementById("pulseValue");
    const pulseStatus = document.getElementById("pulseStatus");

    const pages = document.querySelectorAll(".page");

    // عناصر تسجيل الدخول والواجهات
    const loginBtn = document.getElementById("loginBtn");
    const mobileLoginBtn = document.getElementById("mobileLoginBtn");
    const loginModal = document.getElementById("loginModal");
    const successModal = document.getElementById("successModal");
    const closeLoginModal = document.getElementById("closeLoginModal");
    const closeSuccessModal = document.getElementById("closeSuccessModal");
    const continueBtn = document.getElementById("continueBtn");
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const loginSection = document.getElementById("loginSection");
    const userSection = document.getElementById("userSection");
    const authSection = document.getElementById("authSection");
    const mobileAuthSection = document.getElementById("mobileAuthSection");
    const logoutBtn = document.getElementById("logoutBtn");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    // إضافة أنماط CSS للحركات
    const addButtonStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* تأثيرات الحركة للأزرار */
            .btn-animate {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                transform: translateY(0) scale(1) !important;
                position: relative !important;
                overflow: hidden !important;
            }
            
            .btn-animate:hover {
                transform: translateY(-2px) scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
            }
            
            .btn-animate:active {
                transform: translateY(0) scale(0.98) !important;
                transition-duration: 0.1s !important;
            }
            
            /* تأثير الموجة عند النقر */
            .btn-animate::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.3s, height 0.3s;
            }
            
            .btn-animate:active::after {
                width: 100px;
                height: 100px;
            }
            
            /* تأثيرات خاصة لأزرار الطوارئ */
            .emergency-btn {
                animation: pulse-gentle 2s infinite !important;
                transition: all 0.3s ease !important;
            }
            
            .emergency-btn:hover {
                animation: none !important;
                transform: translateY(-3px) scale(1.05) !important;
                box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4) !important;
            }
            
            @keyframes pulse-gentle {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
                }
                50% {
                    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
                }
            }
            
            /* تأثيرات لأزرار التسجيل */
            .btn-login, .btn-logout {
                transition: all 0.3s ease !important;
                position: relative !important;
            }
            
            .btn-login:hover, .btn-logout:hover {
                transform: translateX(-5px) !important;
                padding-right: 15px !important;
            }
            
            /* تأثيرات لأزرار النوافذ المنبثقة */
            dialog button {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }
            
            dialog button:hover {
                transform: translateY(-2px) !important;
            }
            
            dialog button:active {
                transform: translateY(0) !important;
            }
            
            /* تأثيرات لأزرار القائمة */
            .nav-toggle {
                transition: all 0.3s ease !important;
            }
            
            .nav-toggle:hover {
                transform: rotate(90deg) !important;
            }
            
            /* تأثيرات لأزرار الـ Accordion */
            .accordion-toggle {
                transition: all 0.3s ease !important;
            }
            
            .accordion-toggle:hover {
                transform: translateX(5px) !important;
            }
            
            .accordion-toggle[aria-expanded="true"] {
                transform: rotate(45deg) !important;
            }
            
            /* تأثيرات التحميل */
            .loading-spinner {
                animation: spin 1s linear infinite !important;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* تأثيرات للروابط */
            a:not(.btn-animate) {
                transition: all 0.3s ease !important;
                position: relative !important;
            }
            
            a:not(.btn-animate):hover {
                transform: translateY(-1px) !important;
            }
            
            a:not(.btn-animate)::after {
                content: '';
                position: absolute;
                width: 0;
                height: 2px;
                bottom: -2px;
                left: 0;
                background: currentColor;
                transition: width 0.3s ease;
            }
            
            a:not(.btn-animate):hover::after {
                width: 100%;
            }

            /* زر تبديل الوضع الداكن */
            .theme-toggle {
                background: none;
                border: none;
                font-size: 1.3rem;
                color: var(--color-secondary, #1e293b);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgba(139, 92, 246, 0.1);
            }

            .theme-toggle:hover {
                background-color: var(--color-primary);
                color: white;
                transform: rotate(15deg);
            }

            /* متغيرات الوضع الداكن */
            [data-theme="dark"] {
                --color-bg: #0F0F1A;
                --color-surface: #1A1A2E;
                --color-surface-alt: #2D2B42;
                --color-primary: #A78BFA;
                --color-primary-dark: #7C3AED;
                --color-secondary: #E2E8F0;
                --color-muted: #94A3B8;
                --color-border: rgba(167, 139, 250, 0.15);
                --color-success: #10b981;
                --color-warning: #f59e0b;
                --color-danger: #ef4444;
            }

            [data-theme="dark"] body {
                color: var(--color-secondary);
            }

            [data-theme="dark"] .site-header {
                background-color: rgba(26, 26, 46, 0.95);
                border-bottom-color: rgba(167, 139, 250, 0.1);
            }

            [data-theme="dark"] .hero {
                background: linear-gradient(135deg, rgba(167, 139, 250, 0.05), rgba(124, 58, 237, 0.03)), linear-gradient(140deg, rgba(26, 26, 46, 0.95), rgba(26, 26, 46, 0.85));
            }

            [data-theme="dark"] .feature,
            [data-theme="dark"] .panel,
            [data-theme="dark"] .diagnosis-panel,
            [data-theme="dark"] .login-panel,
            [data-theme="dark"] .user-dashboard {
                background: var(--color-surface);
                border-color: var(--color-border);
            }

            [data-theme="dark"] input,
            [data-theme="dark"] select,
            [data-theme="dark"] textarea {
                background: rgba(45, 43, 66, 0.5);
                border-color: rgba(167, 139, 250, 0.3);
                color: var(--color-secondary);
            }

            [data-theme="dark"] .emergency-btn {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            [data-theme="dark"] .timeline__item {
                background: rgba(167, 139, 250, 0.08);
                border-color: rgba(167, 139, 250, 0.15);
            }
        `;
        document.head.appendChild(style);
    };

    const hideLoader = () => {
        if (!body.classList.contains("loading")) return;
        body.classList.remove("loading");
        preloader?.classList.add("preloader--hidden");
        pages.forEach((page) => page.classList.add("is-visible"));
    };

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 450);
    });

    setTimeout(hideLoader, 2500);

    // تطبيق تأثيرات الحركة على جميع الأزرار
    const applyButtonAnimations = () => {
        // جميع أنواع الأزرار
        const buttons = document.querySelectorAll(`
            button:not(.nav-toggle):not(.accordion-toggle),
            .btn,
            [class*="btn-"],
            .emergency-btn,
            .btn-login,
            .btn-logout,
            dialog button,
            input[type="submit"],
            input[type="button"]
        `);
        
        buttons.forEach(button => {
            if (!button.classList.contains('btn-animate')) {
                button.classList.add('btn-animate');
            }
        });
        
        // إضافة تأثيرات خاصة لأزرار القائمة
        if (navToggle) {
            navToggle.classList.add('btn-animate');
        }
        
        // إضافة تأثيرات لأزرار الـ Accordion
        document.querySelectorAll('.accordion-toggle').forEach(toggle => {
            toggle.classList.add('btn-animate');
        });
        
        console.log(`تم تطبيق تأثيرات الحركة على ${buttons.length} زر`);
    };

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            mobileMenu.hidden = expanded;
        });
    }

    mobileMenu?.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle?.setAttribute("aria-expanded", "false");
            mobileMenu.hidden = true;
        });
    });

    // وظائف تسجيل الدخول والنوافذ المنبثقة
    const openLoginModal = () => {
        loginModal?.showModal();
    };

    const closeLoginModalFunc = () => {
        loginModal?.close();
    };

    const openSuccessModal = () => {
        successModal?.showModal();
    };

    const closeSuccessModalFunc = () => {
        successModal?.close();
    };

    // إضافة مستمعي الأحداث للنوافذ المنبثقة
    loginBtn?.addEventListener("click", openLoginModal);
    mobileLoginBtn?.addEventListener("click", openLoginModal);
    closeLoginModal?.addEventListener("click", closeLoginModalFunc);
    closeSuccessModal?.addEventListener("click", closeSuccessModalFunc);
    continueBtn?.addEventListener("click", closeSuccessModalFunc);

    // إغلاق النافذة المنبثقة بالنقر خارجها
    loginModal?.addEventListener("click", (e) => {
        const dialogDimensions = loginModal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeLoginModalFunc();
        }
    });

    successModal?.addEventListener("click", (e) => {
        const dialogDimensions = successModal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeSuccessModalFunc();
        }
    });

    // Vital signs logic
    const evaluateStatus = (value, type) => {
        switch (type) {
            case "bp": {
                const [systolic, diastolic] = value;
                if (systolic > 140 || diastolic > 90) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (systolic < 90 || diastolic < 60) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            }
            case "glucose":
                if (value > 140) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (value < 70) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            case "pulse":
                if (value > 100) return { text: "مرتفع", color: "#b91c1c", bg: "rgba(239, 68, 68, 0.18)" };
                if (value < 60) return { text: "منخفض", color: "#0369a1", bg: "rgba(14, 165, 233, 0.18)" };
                return { text: "طبيعي", color: "#047857", bg: "rgba(34, 197, 94, 0.16)" };
            default:
                return { text: "غير معروف", color: "#0f172a", bg: "rgba(148, 163, 184, 0.2)" };
        }
    };

    const setChipStatus = (chip, status) => {
        chip.textContent = status.text;
        chip.style.color = status.color;
        chip.style.backgroundColor = status.bg;
    };

    // Accordion
    document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            const panel = document.getElementById(toggle.getAttribute("aria-controls"));
            if (panel) {
                panel.hidden = expanded;
            }
        });
    });

    // Restore timeline from storage if available
    const storedTimeline = JSON.parse(localStorage.getItem("timelineEntries") || "[]");
    if (storedTimeline.length && timeline) {
        timeline.innerHTML = "";
        storedTimeline.forEach((entry) => {
            const li = document.createElement("li");
            li.className = "timeline__item";
            li.textContent = entry;
            timeline.appendChild(li);
        });
    }

    const saveTimeline = () => {
        if (!timeline) return;
        const items = Array.from(timeline.querySelectorAll(".timeline__item")).map((item) => item.textContent);
        localStorage.setItem("timelineEntries", JSON.stringify(items.slice(0, 6)));
    };

    const observer = new MutationObserver(saveTimeline);
    if (timeline) {
        observer.observe(timeline, { childList: true });
    }

    // نظام تسجيل الدخول المتكامل
    const users = [
        { email: 'user@example.com', password: '123456', name: 'أحمد محمد' },
        { email: 'test@test.com', password: 'test123', name: 'سارة أحمد' }
    ];

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const showMessage = (message, type = 'error') => {
        if (!loginMessage) return;
        
        loginMessage.innerHTML = '';
        loginMessage.className = `message message--${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.innerHTML = `
            <span class="message__icon">${type === 'success' ? '✅' : '⚠️'}</span>
            <span class="message__text">${message}</span>
        `;
        
        loginMessage.appendChild(messageContent);
        loginMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 5000);
        }
    };

    const showLoading = (show = true) => {
        const submitBtn = loginForm?.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        if (show) {
            submitBtn.innerHTML = `
                <div class="loading-spinner"></div>
                جاري تسجيل الدخول...
            `;
            submitBtn.disabled = true;
        } else {
            submitBtn.innerHTML = 'تسجيل الدخول';
            submitBtn.disabled = false;
        }
    };

    const updateAuthUI = (user = null) => {
        if (user) {
            // المستخدم مسجل الدخول
            if (loginSection) loginSection.style.display = 'none';
            if (userSection) userSection.style.display = 'block';
            if (userName) userName.textContent = user.name;
            if (userEmail) userEmail.textContent = user.email;
            
            // تحديث القائمة
            const authHTML = `
                <div class="user-nav">
                    <span class="user-greeting">مرحباً، ${user.name}</span>
                    <button class="btn-logout btn-animate" id="navLogoutBtn">تسجيل الخروج</button>
                </div>
            `;
            
            if (authSection) authSection.innerHTML = authHTML;
            if (mobileAuthSection) mobileAuthSection.innerHTML = authHTML;
            
            // إضافة مستمعي الأحداث لأزرار تسجيل الخروج
            document.getElementById('navLogoutBtn')?.addEventListener('click', handleLogout);
            
        } else {
            // المستخدم غير مسجل الدخول
            if (loginSection) loginSection.style.display = 'block';
            if (userSection) userSection.style.display = 'none';
            
            const authHTML = `
                <a href="#loginSection" class="btn-login btn-animate">تسجيل الدخول</a>
            `;
            
            if (authSection) authSection.innerHTML = authHTML;
            if (mobileAuthSection) mobileAuthSection.innerHTML = authHTML;
            
            // إضافة مستمع الأحداث للتمرير إلى قسم تسجيل الدخول
            document.querySelectorAll('.btn-login').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('loginSection').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                });
            });
        }
        
        // تحديث القائمة الجانبية للموبايل
        updateMobileSidebarUser();
        
        // إعادة تطبيق تأثيرات الحركة بعد تحديث الـ UI
        setTimeout(applyButtonAnimations, 100);
    };

    const handleLogin = async (email, password, rememberMe) => {
        showLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                showMessage(`مرحباً بعودتك، ${user.name}!`, 'success');
                
                const sessionData = {
                    email: user.email,
                    name: user.name,
                    loggedIn: true,
                    timestamp: new Date().toISOString()
                };
                
                if (rememberMe) {
                    localStorage.setItem('userSession', JSON.stringify(sessionData));
                } else {
                    sessionStorage.setItem('userSession', JSON.stringify(sessionData));
                }
                
                updateAuthUI(user);
                
                // إغلاق نافذة التسجيل وفتح نافذة النجاح
                closeLoginModalFunc();
                setTimeout(() => {
                    openSuccessModal();
                }, 300);
                
            } else {
                showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
            
        } catch (error) {
            showMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى');
        } finally {
            showLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userSession');
        sessionStorage.removeItem('userSession');
        updateAuthUI(null);
        showMessage('تم تسجيل الخروج بنجاح', 'success');
    };

    const checkExistingSession = () => {
        const sessionData = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (sessionData) {
            const user = JSON.parse(sessionData);
            if (user.loggedIn) {
                updateAuthUI(user);
                return;
            }
        }
        
        updateAuthUI(null);
    };

    // معالجة نموذج تسجيل الدخول
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const rememberMe = document.getElementById("rememberMe")?.checked;

        if (!validateEmail(email)) {
            showMessage('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }

        if (!validatePassword(password)) {
            showMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
            return;
        }

        handleLogin(email, password, rememberMe);
    });

    // إضافة مستمع الأحداث لزر تسجيل الخروج
    logoutBtn?.addEventListener('click', handleLogout);

    // إضافة تأثيرات للحقول
    const addInputEffects = () => {
        const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
        
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.type === 'email' && this.value) {
                    if (validateEmail(this.value)) {
                        this.style.borderColor = '#22c55e';
                    } else {
                        this.style.borderColor = '#ef4444';
                    }
                }
            });
        });
    };

    // إنشاء القائمة الجانبية للداشبورد
    const createDashboardSidebar = () => {
        // التحقق مما إذا كانت القائمة موجودة بالفعل
        if (document.getElementById('dashboardSidebar')) return;
        
        const sidebar = document.createElement('div');
        sidebar.id = 'dashboardSidebar';
        sidebar.className = 'dashboard-sidebar';
        sidebar.innerHTML = `
            <div class="dashboard-sidebar__overlay" id="dashboardSidebarOverlay"></div>
            <div class="dashboard-sidebar__content">
                <div class="dashboard-sidebar__header">
                    <div class="dashboard-sidebar__logo">
                        <i class="fas fa-stethoscope"></i>
                        <span>IDOS</span>
                    </div>
                    <button class="dashboard-sidebar__close" id="dashboardSidebarClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <nav class="dashboard-sidebar__nav">
                    <a href="index.html" class="dashboard-sidebar__link">
                        <i class="fas fa-home"></i>
                        <span>الرئيسية</span>
                    </a>
                    <a href="diagnosis.html" class="dashboard-sidebar__link">
                        <i class="fas fa-diagnoses"></i>
                        <span>التشخيص</span>
                    </a>
                    <a href="chat.html" class="dashboard-sidebar__link">
                        <i class="fas fa-comments"></i>
                        <span>محادثة</span>
                    </a>
                    <a href="hospitals.html" class="dashboard-sidebar__link">
                        <i class="fas fa-hospital"></i>
                        <span>المستشفيات</span>
                    </a>
                    <a href="settings.html" class="dashboard-sidebar__link">
                        <i class="fas fa-cog"></i>
                        <span>الإعدادات</span>
                    </a>
                    <div class="dashboard-sidebar__user" id="dashboardSidebarUser">
                        <!-- سيتم ملؤه ديناميكياً -->
                    </div>
                </nav>
            </div>
        `;
        
        document.body.appendChild(sidebar);
        
        // إضافة الأنماط
        addDashboardSidebarStyles();
        
        // إضافة مستمعي الأحداث
        setupDashboardSidebarEvents();
    };
    
    // إضافة أنماط القائمة الجانبية
    const addDashboardSidebarStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* أنماط القائمة الجانبية للداشبورد */
            .dashboard-sidebar {
                position: fixed;
                top: 0;
                right: -100%;
                width: 85%;
                max-width: 320px;
                height: 100%;
                background: white;
                z-index: 10000;
                transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
                display: flex;
                flex-direction: column;
            }
            
            .dashboard-sidebar.active {
                right: 0;
            }
            
            .dashboard-sidebar__overlay {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .dashboard-sidebar__overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .dashboard-sidebar__content {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }
            
            .dashboard-sidebar__header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 1rem;
                background: var(--gradient-primary);
                color: white;
            }
            
            .dashboard-sidebar__logo {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: 700;
                font-size: 1.2rem;
            }
            
            .dashboard-sidebar__close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: background 0.3s;
            }
            
            .dashboard-sidebar__close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .dashboard-sidebar__nav {
                flex: 1;
                padding: 1rem 0;
            }
            
            .dashboard-sidebar__link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem 1.5rem;
                text-decoration: none;
                color: var(--dark);
                transition: all 0.3s;
                border-right: 3px solid transparent;
            }
            
            .dashboard-sidebar__link:hover,
            .dashboard-sidebar__link.active {
                background: rgba(46, 134, 171, 0.1);
                color: var(--primary);
                border-right-color: var(--primary);
            }
            
            .dashboard-sidebar__link i {
                width: 20px;
                text-align: center;
            }
            
            .dashboard-sidebar__user {
                padding: 1.5rem;
                border-top: 1px solid #eee;
                margin-top: auto;
            }
            
            .dashboard-sidebar__user-info {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                margin-bottom: 1rem;
            }
            
            .dashboard-sidebar__user-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--gradient-primary);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 1.2rem;
            }
            
            .dashboard-sidebar__user-details {
                flex: 1;
            }
            
            .dashboard-sidebar__user-name {
                font-weight: 700;
                margin-bottom: 0.25rem;
            }
            
            .dashboard-sidebar__user-email {
                font-size: 0.85rem;
                color: var(--gray);
            }
            
            .dashboard-sidebar__actions {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .dashboard-sidebar__action-btn {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                background: none;
                border: 1px solid #eee;
                border-radius: var(--radius);
                cursor: pointer;
                transition: all 0.3s;
                font-family: inherit;
                font-size: 0.9rem;
                color: var(--dark);
            }
            
            .dashboard-sidebar__action-btn:hover {
                background: rgba(46, 134, 171, 0.1);
                border-color: var(--primary);
                color: var(--primary);
            }
            
            .dashboard-sidebar__action-btn.logout {
                color: var(--accent);
                border-color: rgba(247, 108, 108, 0.3);
            }
            
            .dashboard-sidebar__action-btn.logout:hover {
                background: rgba(247, 108, 108, 0.1);
            }
            
            /* تحسينات للشاشات الصغيرة */
            @media (max-width: 480px) {
                .dashboard-sidebar {
                    width: 90%;
                }
            }
            
            @media (min-width: 769px) {
                .dashboard-sidebar,
                .dashboard-sidebar__overlay {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    };
    
    // إعداد أحداث القائمة الجانبية
    const setupDashboardSidebarEvents = () => {
        const sidebar = document.getElementById('dashboardSidebar');
        const overlay = document.getElementById('dashboardSidebarOverlay');
        const closeBtn = document.getElementById('dashboardSidebarClose');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        // فتح القائمة
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', openDashboardSidebar);
        }
        
        // إغلاق القائمة
        if (closeBtn) {
            closeBtn.addEventListener('click', closeDashboardSidebar);
        }
        
        if (overlay) {
            overlay.addEventListener('click', closeDashboardSidebar);
        }
        
        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.dashboard-sidebar__link').forEach(link => {
            link.addEventListener('click', closeDashboardSidebar);
        });
        
        // تحديث معلومات المستخدم في القائمة
        updateDashboardSidebarUser();
    };
    
    // فتح القائمة الجانبية
    const openDashboardSidebar = () => {
        const sidebar = document.getElementById('dashboardSidebar');
        const overlay = document.getElementById('dashboardSidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    
    // إغلاق القائمة الجانبية
    const closeDashboardSidebar = () => {
        const sidebar = document.getElementById('dashboardSidebar');
        const overlay = document.getElementById('dashboardSidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    
    // تحديث معلومات المستخدم في القائمة الجانبية
    const updateDashboardSidebarUser = () => {
        const userSection = document.getElementById('dashboardSidebarUser');
        if (!userSection) return;
        
        const userSession = localStorage.getItem('userSession') || sessionStorage.getItem('userSession');
        
        if (userSession) {
            try {
                const userData = JSON.parse(userSession);
                userSection.innerHTML = `
                    <div class="dashboard-sidebar__user-info">
                        <div class="dashboard-sidebar__user-avatar">${userData.name ? userData.name.charAt(0) : 'م'}</div>
                        <div class="dashboard-sidebar__user-details">
                            <div class="dashboard-sidebar__user-name">${userData.name || 'مستخدم'}</div>
                            <div class="dashboard-sidebar__user-email">${userData.email || ''}</div>
                        </div>
                    </div>
                    <div class="dashboard-sidebar__actions">
                        <button class="dashboard-sidebar__action-btn" onclick="window.location.href='settings.html'">
                            <i class="fas fa-user-cog"></i>
                            <span>إعدادات الحساب</span>
                        </button>
                        <button class="dashboard-sidebar__action-btn logout" id="dashboardSidebarLogout">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                `;
                
                // إضافة حدث تسجيل الخروج
                document.getElementById('dashboardSidebarLogout')?.addEventListener('click', () => {
                    localStorage.removeItem('userSession');
                    sessionStorage.removeItem('userSession');
                    window.location.reload();
                });
                
            } catch (e) {
                console.error('خطأ في تحليل بيانات المستخدم:', e);
                userSection.innerHTML = `
                    <div class="dashboard-sidebar__actions">
                        <button class="dashboard-sidebar__action-btn" onclick="window.location.href='login.html'">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>تسجيل الدخول</span>
                        </button>
                    </div>
                `;
            }
        } else {
            userSection.innerHTML = `
                <div class="dashboard-sidebar__actions">
                    <button class="dashboard-sidebar__action-btn" onclick="window.location.href='login.html'">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>تسجيل الدخول</span>
                    </button>
                </div>
            `;
        }
    };

    // نظام الإعدادات
    const initSettings = () => {
        // كائن الإعدادات الافتراضي
        const defaultSettings = {
            language: 'ar',
            emailNotifications: true,
            appNotifications: true,
            dataCollection: true,
            userActivity: false,
            publicProfile: false,
            performanceMode: false,
            autoBackup: true,
            autoUpdate: true,
            theme: 'light'
        };

        // تحميل الإعدادات
        const loadSettings = () => {
            const savedSettings = localStorage.getItem('idos_user_settings');
            return savedSettings ? JSON.parse(savedSettings) : { ...defaultSettings };
        };

        // حفظ الإعدادات
        const saveSettings = (settings) => {
            localStorage.setItem('idos_user_settings', JSON.stringify(settings));
        };

        // تطبيق الإعدادات على الصفحة الحالية
        const applySettings = () => {
            const settings = loadSettings();
            
            // تطبيق الوضع الداكن/الفاتح
            document.documentElement.setAttribute('data-theme', settings.theme);
            
            // تطبيق اللغة
            if (settings.language === 'en') {
                // يمكنك إضافة منطق لتغيير اللغة هنا
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = 'en';
            }
            
            // يمكنك إضافة تطبيق إعدادات أخرى هنا
            console.log('تم تطبيق الإعدادات:', settings);
        };

        // الحصول على إعداد معين
        const getSetting = (key) => {
            const settings = loadSettings();
            return settings[key] !== undefined ? settings[key] : defaultSettings[key];
        };

        // تحديث إعداد معين
        const updateSetting = (key, value) => {
            const settings = loadSettings();
            settings[key] = value;
            saveSettings(settings);
            applySettings();
        };

        // دالة لتبديل الوضع الداكن
        const toggleDarkMode = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            updateSetting('theme', newTheme);
            updateThemeIcon();
        };

        // تصدير الإعدادات
        const exportSettings = () => {
            const settings = loadSettings();
            const dataStr = JSON.stringify(settings, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', 'idos-settings.json');
            linkElement.click();
        };

        // تطبيق الإعدادات عند التحميل
        applySettings();

        // جعل الوظائف متاحة عالمياً
        window.getUserSettings = loadSettings;
        window.getSetting = getSetting;
        window.updateSetting = updateSetting;
        window.toggleDarkMode = toggleDarkMode;
        window.exportSettings = exportSettings;

        // إضافة زر تبديل الوضع الداكن للرأس
        addDarkModeToggle();
    };

    // إضافة زر تبديل الوضع الداكن للرأس
    const addDarkModeToggle = () => {
        // التحقق مما إذا كان الزر موجوداً بالفعل
        if (document.getElementById('darkModeToggle')) return;

        const themeToggle = document.createElement('button');
        themeToggle.id = 'darkModeToggle';
        themeToggle.className = 'btn-animate theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'تبديل الوضع الداكن';
        themeToggle.setAttribute('aria-label', 'تبديل الوضع الداكن/الفاتح');

        // إضافة إلى الرأس إذا كان موجوداً
        const headerActions = document.querySelector('.user-actions') || 
                             document.querySelector('.main-nav')?.parentElement || 
                             document.querySelector('.nav-container');
        
        if (headerActions) {
            headerActions.insertBefore(themeToggle, headerActions.firstChild);
        } else {
            // البحث عن موقع مناسب في الصفحة
            const header = document.querySelector('header') || document.body;
            if (header) {
                header.appendChild(themeToggle);
                themeToggle.style.position = 'absolute';
                themeToggle.style.top = '1rem';
                themeToggle.style.left = '1rem';
            }
        }

        // إضافة حدث النقر
        themeToggle.addEventListener('click', () => {
            window.toggleDarkMode?.();
        });

        // تحديث الأيقونة بناءً على الوضع الحالي
        const updateThemeIcon = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const icon = themeToggle.querySelector('i');
            if (currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                themeToggle.title = 'التبديل إلى الوضع الفاتح';
            } else {
                icon.className = 'fas fa-moon';
                themeToggle.title = 'التبديل إلى الوضع الداكن';
            }
        };

        // تحديث الأيقونة عند التحميل
        setTimeout(updateThemeIcon, 100);
        
        // جعل الدالة متاحة للوظائف الأخرى
        window.updateThemeIcon = updateThemeIcon;
    };

    // تهيئة الصفحة
    const init = () => {
        addButtonStyles();
        checkExistingSession();
        addInputEffects();
        applyButtonAnimations();
        createDashboardSidebar();
        initSettings();
        
        // إضافة تأثير النقر على أزرار الطوارئ
        document.querySelectorAll('.emergency-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
                
                console.log('تم النقر على زر الطوارئ:', this.querySelector('strong').textContent);
            });
        });

        // إعادة تطبيق الحركات عند تغيير حجم النافذة (للتأكد من تطبيقها على جميع العناصر)
        window.addEventListener('resize', () => {
            setTimeout(applyButtonAnimations, 300);
        });
    };

    // استدعاء التهيئة
    init();
});

// Google Maps callback
let map;
let userMarker;
let infoWindow;

window.initMap = function () {
    const mapContainer = document.getElementById("mapCanvas");
    const statusEl = document.getElementById("mapStatus");
    if (!mapContainer) return;

    const benha = { lat: 30.466141, lng: 31.184769 };
    map = new google.maps.Map(mapContainer, {
        center: benha,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    infoWindow = new google.maps.InfoWindow();

    const hospitals = [
        {
            name: "مستشفى بنها الجامعي",
            position: { lat: 30.466611, lng: 31.177723 },
            address: "شارع كورنيش النيل، بنها"
        },
        {
            name: "مستشفى بنها التعليمي",
            position: { lat: 30.470851, lng: 31.188932 },
            address: "شارع الجيش، بنها"
        },
        {
            name: "مستشفى الراعي الصالح",
            position: { lat: 30.460148, lng: 31.191663 },
            address: "شارع فريد ندي، بنها"
        },
        {
            name: "مركز بنها الطبي المتخصص",
            position: { lat: 30.472942, lng: 31.182431 },
            address: "ميدان الإشارة، بنها"
        }
    ];

    hospitals.forEach((hospital) => {
        const marker = new google.maps.Marker({
            position: hospital.position,
            map,
            title: hospital.name,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#2563eb",
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: "#1d4ed8"
            }
        });

        marker.addListener("click", () => {
            infoWindow.setContent(`
                <div style="text-align:right; min-width:200px;">
                    <strong>${hospital.name}</strong>
                    <p style="margin:6px 0;">${hospital.address}</p>
                    <p style="margin:6px 0; color: #ef4444; font-weight: bold;">☎️ 123</p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.position.lat},${hospital.position.lng}" target="_blank" rel="noopener">عرض الاتجاهات</a>
                </div>
            `);
            infoWindow.open(map, marker);
        });
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                if (!userMarker) {
                    userMarker = new google.maps.Marker({
                        position: userLocation,
                        map,
                        title: "موقعك الحالي",
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#22c55e",
                            fillOpacity: 0.9,
                            strokeWeight: 3,
                            strokeColor: "#15803d"
                        }
                    });
                } else {
                    userMarker.setPosition(userLocation);
                }
                map.panTo(userLocation);
                if (statusEl) {
                    statusEl.textContent = "تم تحديد موقعك الحالي. يمكنك استكشاف المستشفيات حولك.";
                }
            },
            (error) => {
                console.warn("خطأ في تحديد الموقع:", error);
                if (statusEl) {
                    statusEl.textContent = "تعذر تحديد موقعك. يمكنك السماح بالوصول إلى الموقع أو البحث يدويًا.";
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        if (statusEl) {
            statusEl.textContent = "المتصفح لا يدعم التتبع الجغرافي.";
        }
    }
};