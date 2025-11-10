// diagnosis.js
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const pages = document.querySelectorAll(".page");

    const symptomForm = document.getElementById("symptomForm");
    const symptomInput = document.getElementById("symptomInput");
    const departmentSelect = document.getElementById("departmentSelect");
    const resultsContainer = document.getElementById("diagnosisResults");
    const historyList = document.getElementById("historyList");

    let diseases = [];

    // التحكم في القائمة الجانبية
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarClose = document.getElementById("sidebarClose");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.add("open");
            sidebarOverlay.classList.add("open");
            document.body.style.overflow = "hidden";
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener("click", closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("open");
        document.body.style.overflow = "";
    }

    // إغلاق القائمة عند النقر على رابط داخلي
    document.querySelectorAll(".sidebar-nav a").forEach(link => {
        link.addEventListener("click", () => {
            setTimeout(closeSidebar, 300);
        });
    });

    // إغلاق القائمة بمفتاح ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && sidebar.classList.contains("open")) {
            closeSidebar();
        }
    });

    const hideLoader = () => {
        body.classList.remove("loading");
        preloader?.classList.add("preloader--hidden");
        pages.forEach((page) => page.classList.add("is-visible"));
    };

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 450);
    });

    // في حال تعليق حدث load (مثلاً بسبب fetch) نضمن إخفاء الـ Loader بعد 3 ثوانٍ
    setTimeout(hideLoader, 3000);

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

    const loadDiseases = async () => {
        try {
            const response = await fetch("diseases.json");
            if (!response.ok) throw new Error("تعذر تحميل قاعدة البيانات");
            diseases = await response.json();
        } catch (error) {
            console.error(error);
        } finally {
            hideLoader();
        }
    };

    const extractSymptoms = (text) => {
        // استخراج الأعراض من النص المدخل
        const symptoms = [];
        const allSymptoms = getAllSymptoms();
        
        allSymptoms.forEach(symptom => {
            if (text.includes(symptom)) {
                symptoms.push(symptom);
            }
        });
        
        return symptoms;
    };

    const getAllSymptoms = () => {
        const set = new Set();
        diseases.forEach((disease) => {
            disease.symptoms.forEach((symptom) => set.add(symptom));
        });
        return Array.from(set);
    };

    const matchDiseases = (symptoms) => {
        if (!symptoms.length) {
            return [];
        }
        const selectedLower = symptoms.map((sym) => sym.toLowerCase());
        const departmentOverride = departmentSelect.value;

        const matches = diseases
            .map((disease) => {
                const diseaseSymptomsLower = disease.symptoms.map((sym) => sym.toLowerCase());
                const matched = selectedLower.filter((sym) =>
                    diseaseSymptomsLower.some((ds) => ds.includes(sym))
                );
                return {
                    disease,
                    matchedSymptoms: matched,
                    score: matched.length / disease.symptoms.length,
                    department: departmentOverride || disease.department
                };
            })
            .filter((entry) => entry.matchedSymptoms.length > 0)
            .sort((a, b) => b.score - a.score);

        return matches.slice(0, 3);
    };

    const renderResults = (results) => {
        resultsContainer.innerHTML = "";
        if (!results.length) {
            resultsContainer.innerHTML = `
                <div class="placeholder-card">
                    <span>ℹ️</span>
                    <p>لم نجد تطابقًا مباشرًا. ننصح بالتواصل مع طبيب مختص لمزيد من الفحوصات.</p>
                </div>
            `;
            return;
        }

        results.forEach((result) => {
            const card = document.createElement("article");
            card.className = "result-card";
            card.innerHTML = `
                <div class="result-card__header">
                    <span class="result-card__icon">🩺</span>
                    <div>
                        <h3>${result.disease.name}</h3>
                        <span class="result-card__match">نسبة التطابق: ${(result.score * 100).toFixed(0)}%</span>
                    </div>
                </div>
                <p>${result.disease.advice}</p>
                <div>
                    <span class="result-card__department">القسم المقترح: ${result.department}</span>
                </div>
                <div>
                    <strong>الأعراض المتطابقة:</strong>
                    <ul>
                        ${result.matchedSymptoms.map((sym) => `<li>${sym}</li>`).join("")}
                    </ul>
                </div>
                <div class="result-card__footer">
                    هذه النتائج استرشادية وليست تشخيصًا نهائيًا. يرجى زيارة الطبيب المختص عند الضرورة.
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    };

    const HISTORY_KEY = "diagnosisHistory";

    const saveHistory = (entry) => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        history.unshift(entry);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 6)));
    };

    const renderHistory = () => {
        const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        historyList.innerHTML = "";
        if (!history.length) {
            historyList.innerHTML = `
                <div class="placeholder-card">
                    <span>🗂️</span>
                    <p>لا يوجد سجل بعد. سيتم حفظ النتائج الأخيرة تلقائيًا.</p>
                </div>
            `;
            return;
        }
        history.forEach((item) => {
            const card = document.createElement("article");
            card.className = "history-card";
            card.innerHTML = `
                <h4>${item.disease}</h4>
                <span class="muted">${item.timestamp}</span>
                <div><strong>القسم:</strong> ${item.department}</div>
                <ul>
                    ${item.symptoms.map((sym) => `<li>${sym}</li>`).join("")}
                </ul>
                <p>${item.advice}</p>
            `;
            historyList.appendChild(card);
        });
    };

    symptomForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const text = symptomInput.value.trim();
        if (!text) {
            renderResults([]);
            return;
        }
        
        const symptoms = extractSymptoms(text);
        const matches = matchDiseases(symptoms);
        renderResults(matches);

        if (matches.length) {
            const top = matches[0];
            const entry = {
                disease: top.disease.name,
                department: top.department,
                symptoms: symptoms,
                advice: top.disease.advice,
                timestamp: new Date().toLocaleString("ar-EG", { dateStyle: "medium", timeStyle: "short" })
            };
            saveHistory(entry);
            renderHistory();
        }
    });

    // تشغيل البداية
    loadDiseases().then(renderHistory);
});