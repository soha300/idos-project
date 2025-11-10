// auth.js
document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("authSection");
    const loginBtn = document.getElementById("loginBtn");
    const authModal = document.getElementById("authModal");
    const closeAuthModal = document.getElementById("closeAuthModal");
    const authForm = document.getElementById("authForm");
    const authEmail = document.getElementById("authEmail");
    const authPassword = document.getElementById("authPassword");
    const authSubmitBtn = document.getElementById("authSubmitBtn");
    const authModalTitle = document.getElementById("authModalTitle");
    const switchAuthMode = document.getElementById("switchAuthMode");
    const authFeedback = document.getElementById("authFeedback");

    let isLoginMode = true;

    // التحقق من حالة المستخدم الحالي
    const checkAuthStatus = () => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
        if (currentUser.email) {
            // المستخدم مسجل دخول
            authSection.innerHTML = `
                <div class="user-info">
                    <span>مرحباً، ${currentUser.name || currentUser.email}</span>
                    <button class="btn btn-small btn-ghost" id="logoutBtn">تسجيل الخروج</button>
                </div>
            `;
            
            document.getElementById("logoutBtn").addEventListener("click", handleLogout);
        } else {
            // المستخدم غير مسجل دخول
            authSection.innerHTML = `<button class="btn btn-small" id="loginBtn">تسجيل الدخول</button>`;
            document.getElementById("loginBtn").addEventListener("click", () => authModal.showModal());
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        checkAuthStatus();
        location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
    };

    const switchMode = () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authModalTitle.textContent = "تسجيل الدخول";
            authSubmitBtn.textContent = "تسجيل الدخول";
            switchAuthMode.innerHTML = 'ليس لديك حساب؟ <button type="button" id="switchAuthMode">إنشاء حساب جديد</button>';
        } else {
            authModalTitle.textContent = "إنشاء حساب جديد";
            authSubmitBtn.textContent = "إنشاء حساب";
            switchAuthMode.innerHTML = 'لديك حساب بالفعل؟ <button type="button" id="switchAuthMode">تسجيل الدخول</button>';
        }
        
        // إعادة إرفاق حدث النقر
        document.getElementById("switchAuthMode").addEventListener("click", switchMode);
    };

    const handleAuth = (event) => {
        event.preventDefault();
        const email = authEmail.value.trim();
        const password = authPassword.value.trim();

        if (!email || !password) {
            showAuthFeedback("يرجى تعبئة جميع الحقول.", "error");
            return;
        }

        if (isLoginMode) {
            // تسجيل الدخول
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem("currentUser", JSON.stringify(user));
                showAuthFeedback("تم تسجيل الدخول بنجاح!", "success");
                setTimeout(() => {
                    authModal.close();
                    checkAuthStatus();
                    location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
                }, 1500);
            } else {
                showAuthFeedback("البريد الإلكتروني أو كلمة المرور غير صحيحة.", "error");
            }
        } else {
            // إنشاء حساب جديد
            const users = JSON.parse(localStorage.getItem("users") || "[]");
            
            if (users.find(u => u.email === email)) {
                showAuthFeedback("هذا البريد الإلكتروني مسجل بالفعل.", "error");
                return;
            }
            
            const newUser = {
                email,
                password,
                name: email.split('@')[0],
                joined: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            localStorage.setItem("currentUser", JSON.stringify(newUser));
            
            showAuthFeedback("تم إنشاء الحساب بنجاح!", "success");
            setTimeout(() => {
                authModal.close();
                checkAuthStatus();
                location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
            }, 1500);
        }
    };

    const showAuthFeedback = (message, type) => {
        authFeedback.hidden = false;
        authFeedback.textContent = message;
        
        if (type === "error") {
            authFeedback.style.backgroundColor = "rgba(239, 68, 68, 0.12)";
            authFeedback.style.color = "#b91c1c";
        } else {
            authFeedback.style.backgroundColor = "rgba(34, 197, 94, 0.12)";
            authFeedback.style.color = "#047857";
        }
    };

    // إرفاق الأحداث
    loginBtn?.addEventListener("click", () => authModal.showModal());
    closeAuthModal?.addEventListener("click", () => authModal.close());
    authForm?.addEventListener("submit", handleAuth);
    switchAuthMode?.addEventListener("click", switchMode);

    // التحقق من حالة المصادقة عند تحميل الصفحة
    checkAuthStatus();
});