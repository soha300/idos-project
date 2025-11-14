// login.js
document.addEventListener("DOMContentLoaded", () => {
    // إذا كان المستخدم مسجل الدخول بالفعل، نوجهه للصفحة الرئيسية
    if (localStorage.getItem('userSession') || sessionStorage.getItem('userSession')) {
        window.location.href = 'index.html';
        return;
    }

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const successModal = document.getElementById("successModal");
    const closeSuccessModal = document.getElementById("closeSuccessModal");
    const continueBtn = document.getElementById("continueBtn");

    // قاعدة بيانات المستخدمين المحاكاة
    const users = [
        { 
            email: 'user@example.com', 
            password: '123456', 
            name: 'أحمد محمد'
        },
        { 
            email: 'test@test.com', 
            password: 'test123', 
            name: 'سارة أحمد'
        },
        { 
            email: 'doctor@clinic.com', 
            password: 'doctor123', 
            name: 'د. محمد علي'
        }
    ];

    // التحقق من صحة البريد الإلكتروني
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // التحقق من صحة كلمة المرور
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    // عرض الرسائل
    const showMessage = (message, type = 'error') => {
        if (!loginMessage) return;
        
        loginMessage.innerHTML = '';
        loginMessage.className = `message message--${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `
            <span class="message__icon">${type === 'success' ? '✅' : '⚠️'}</span>
            <span class="message__text">${message}</span>
        `;
        
        loginMessage.appendChild(messageContent);
        loginMessage.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                loginMessage.style.display = 'none';
            }, 3000);
        }
    };

    // عرض مؤشر التحميل
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

    // حفظ بيانات الجلسة
    const saveUserSession = (user, rememberMe) => {
        const sessionData = {
            email: user.email,
            name: user.name,
            loggedIn: true,
            timestamp: new Date().toISOString()
        };
        
        if (rememberMe) {
            localStorage.setItem('userSession', JSON.stringify(sessionData));
            localStorage.setItem('rememberMe', 'true');
        } else {
            sessionStorage.setItem('userSession', JSON.stringify(sessionData));
            localStorage.removeItem('rememberMe');
        }
    };

    // معالجة تسجيل الدخول
    const handleLogin = async (email, password, rememberMe) => {
        showLoading(true);

        try {
            // محاكاة اتصال بالخادم
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // البحث عن المستخدم في قاعدة البيانات
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // حفظ بيانات الجلسة
                saveUserSession(user, rememberMe);
                
                // التوجيه المباشر للصفحة الرئيسية بدون نافذة النجاح
                window.location.href = 'index.html';
                
            } else {
                showMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                
                // تأثير اهتزاز للحقول
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                emailInput.style.animation = 'shake 0.5s ease';
                passwordInput.style.animation = 'shake 0.5s ease';
                
                setTimeout(() => {
                    emailInput.style.animation = '';
                    passwordInput.style.animation = '';
                }, 500);
            }
            
        } catch (error) {
            showMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            showLoading(false);
        }
    };

    // معالجة نموذج تسجيل الدخول
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;
        const rememberMe = document.getElementById("rememberMe")?.checked;

        // التحقق من صحة البيانات
        if (!validateEmail(email)) {
            showMessage('يرجى إدخال بريد إلكتروني صحيح');
            document.getElementById('email').focus();
            return;
        }

        if (!validatePassword(password)) {
            showMessage('كلمة المرور يجب أن تكون على الأقل 6 أحرف');
            document.getElementById('password').focus();
            return;
        }

        handleLogin(email, password, rememberMe);
    });

    // السماح بالدخول بأي بريد إلكتروني وكلمة مرور (للتجربة)
    const allowAnyLogin = (email, password) => {
        // إذا كان البريد الإلكتروني يحتوي @ وكلمة المرور 6 أحرف على الأقل
        if (email.includes('@') && password.length >= 6) {
            const user = {
                email: email,
                name: email.split('@')[0],
                loggedIn: true
            };
            
            const rememberMe = document.getElementById("rememberMe")?.checked;
            saveUserSession(user, rememberMe);
            window.location.href = 'index.html';
            return true;
        }
        return false;
    };

    // تحديث معالجة تسجيل الدخول للسماح بأي بيانات
    const originalHandleLogin = handleLogin;
    handleLogin = async (email, password, rememberMe) => {
        showLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // المحاولة مع المستخدمين المسجلين أولاً
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                saveUserSession(user, rememberMe);
                window.location.href = 'index.html';
            } 
            // إذا فشل، السماح بأي بيانات صالحة
            else if (allowAnyLogin(email, password)) {
                // تم التسجيل بنجاح
            }
            else {
                showMessage('يرجى إدخال بريد إلكتروني صحيح وكلمة مرور 6 أحرف على الأقل');
                
                const emailInput = document.getElementById('email');
                const passwordInput = document.getElementById('password');
                
                emailInput.style.animation = 'shake 0.5s ease';
                passwordInput.style.animation = 'shake 0.5s ease';
                
                setTimeout(() => {
                    emailInput.style.animation = '';
                    passwordInput.style.animation = '';
                }, 500);
            }
            
        } catch (error) {
            showMessage('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
        } finally {
            showLoading(false);
        }
    };

    // إغلاق النافذة المنبثقة (في حال احتجناها مستقبلاً)
    closeSuccessModal?.addEventListener("click", () => {
        successModal.close();
        window.location.href = 'index.html';
    });

    continueBtn?.addEventListener("click", () => {
        successModal.close();
        window.location.href = 'index.html';
    });

    // إغلاق النافذة بالنقر خارجها
    successModal?.addEventListener("click", (e) => {
        const dialogDimensions = successModal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            successModal.close();
            window.location.href = 'index.html';
        }
    });

    // تلقين بيانات تجريبية للمستخدمين الجدد
    if (!localStorage.getItem('demoShown')) {
        setTimeout(() => {
            showMessage('يمكنك استخدام: user@example.com / 123456 أو أي بريد إلكتروني وكلمة مرور 6 أحرف', 'success');
        }, 1500);
        
        // تعبئة الحقول تلقائياً للتجربة
        document.getElementById('email').value = 'user@example.com';
        document.getElementById('password').value = '123456';
        
        localStorage.setItem('demoShown', 'true');
    }

    // إضافة تأثيرات للحقول
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // إضافة تأثير للزر
    const loginBtn = document.querySelector('.btn-primary');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
});