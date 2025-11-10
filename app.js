// app.js
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.getElementById("preloader");
    const navToggle = document.querySelector(".nav-toggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const updateVitalsBtn = document.getElementById("updateVitalsBtn");
    const timeline = document.getElementById("insightsTimeline");

    const bpValue = document.getElementById("bpValue");
    const bpStatus = document.getElementById("bpStatus");
    const glucoseValue = document.getElementById("glucoseValue");
    const glucoseStatus = document.getElementById("glucoseStatus");
    const pulseValue = document.getElementById("pulseValue");
    const pulseStatus = document.getElementById("pulseStatus");

    const pages = document.querySelectorAll(".page");

    const hideLoader = () => {
        if (!body.classList.contains("loading")) return;
        body.classList.remove("loading");
        preloader?.classList.add("preloader--hidden");
        pages.forEach((page) => page.classList.add("is-visible"));
    };

    window.addEventListener("load", () => {
        setTimeout(hideLoader, 450);
    });

    // في حال عدم وصول حدث load لأي سبب، نخفي الـ Loader بعد ثانيتين ونصف
    setTimeout(hideLoader, 2500);

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

    updateVitalsBtn?.addEventListener("click", () => {
        const systolic = Math.floor(Math.random() * 40) + 100;
        const diastolic = Math.floor(Math.random() * 30) + 60;
        const glucose = Math.floor(Math.random() * 90) + 70;
        const pulse = Math.floor(Math.random() * 60) + 55;

        bpValue.textContent = `${systolic}/${diastolic}`;
        setChipStatus(bpStatus, evaluateStatus([systolic, diastolic], "bp"));

        glucoseValue.textContent = `${glucose} mg/dL`;
        setChipStatus(glucoseStatus, evaluateStatus(glucose, "glucose"));

        pulseValue.textContent = `${pulse} bpm`;
        setChipStatus(pulseStatus, evaluateStatus(pulse, "pulse"));

        appendTimelineItem("تم تحديث المؤشرات الحيوية بنجاح.");
    });

    const appendTimelineItem = (text) => {
        if (!timeline) return;
        if (timeline.querySelector(".timeline__item") && timeline.children.length === 1 && timeline.firstElementChild.textContent.includes("سيتم عرض")) {
            timeline.innerHTML = "";
        }
        const li = document.createElement("li");
        li.className = "timeline__item";
        li.textContent = `${text} (${new Date().toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" })})`;
        timeline.prepend(li);
    };

    // Accordion
    document.querySelectorAll(".accordion-toggle").forEach((toggle) => {
        toggle.addEventListener("click", () => {
            const expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!expanded));
            const panel = document.getElementById(toggle.getAttribute("aria-controls"));
            panel.hidden = expanded;
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
});

// Google Maps callback
let map;
let userMarker;
let infoWindow;

window.initMap = function () {
    const mapContainer = document.getElementById("mapCanvas");
    const statusEl = document.getElementById("mapStatus");
    if (!mapContainer) return;

    // مركز الخريطة - مدينة بنها
    const benha = { lat: 30.466141, lng: 31.184769 };
    
    // إنشاء الخريطة
    map = new google.maps.Map(mapContainer, {
        center: benha,
        zoom: 14,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });

    infoWindow = new google.maps.InfoWindow();

    // قائمة المستشفيات في بنها
    const hospitals = [
        {
            name: "مستشفى بنها الجامعي",
            position: { lat: 30.466611, lng: 31.177723 },
            address: "شارع كورنيش النيل، بنها",
            type: "مستشفى جامعي"
        },
        {
            name: "مستشفى بنها التعليمي",
            position: { lat: 30.470851, lng: 31.188932 },
            address: "شارع الجيش، بنها",
            type: "مستشفى تعليمي"
        },
        {
            name: "مستشفى الراعي الصالح",
            position: { lat: 30.460148, lng: 31.191663 },
            address: "شارع فريد ندي، بنها",
            type: "مستشفى عام"
        },
        {
            name: "مركز بنها الطبي المتخصص",
            position: { lat: 30.472942, lng: 31.182431 },
            address: "ميدان الإشارة، بنها",
            type: "مركز طبي"
        },
        {
            name: "مستشفى الصدر ببنها",
            position: { lat: 30.458912, lng: 31.186754 },
            address: "شارع المستشفى، بنها",
            type: "مستشفى متخصص"
        }
    ];

    // إضافة علامات المستشفيات
    hospitals.forEach((hospital) => {
        const marker = new google.maps.Marker({
            position: hospital.position,
            map: map,
            title: hospital.name,
            icon: {
                url: "data:image/svg+xml;base64," + btoa(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#7c3aed" stroke="#5b21b6" stroke-width="2"/>
                        <path d="M20 12 L26 18 L20 24 L14 18 Z" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40)
            }
        });

        // إضافة حدث النقر على العلامة
        marker.addListener("click", () => {
            const content = `
                <div style="text-align:right; min-width:250px; font-family: 'Cairo', sans-serif;">
                    <h3 style="margin:0 0 10px 0; color: #1e293b;">${hospital.name}</h3>
                    <p style="margin:8px 0; color: #475569;"><strong>النوع:</strong> ${hospital.type}</p>
                    <p style="margin:8px 0; color: #475569;">${hospital.address}</p>
                    <div style="margin-top:15px;">
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${hospital.position.lat},${hospital.position.lng}" 
                           target="_blank" 
                           rel="noopener"
                           style="background:#2563eb; color:white; padding:8px 16px; text-decoration:none; border-radius:6px; display:inline-block;">
                            عرض الاتجاهات
                        </a>
                    </div>
                </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });
    });

    // محاولة تحديد موقع المستخدم
    if (navigator.geolocation) {
        statusEl.textContent = "جاري تحديد موقعك...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // إضافة علامة موقع المستخدم
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "موقعك الحالي",
                    icon: {
                        url: "data:image/svg+xml;base64," + btoa(`
                            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="20" cy="20" r="18" fill="#22c55e" stroke="#15803d" stroke-width="2"/>
                                <circle cx="20" cy="20" r="8" fill="white"/>
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });

                // إضافة معلومات موقع المستخدم
                const userInfoContent = `
                    <div style="text-align:right; min-width:200px; font-family: 'Cairo', sans-serif;">
                        <h4 style="margin:0 0 8px 0; color: #1e293b;">موقعك الحالي</h4>
                        <p style="margin:0; color: #475569;">تم تحديد موقعك بنجاح</p>
                    </div>
                `;

                const userInfoWindow = new google.maps.InfoWindow({
                    content: userInfoContent
                });

                userMarker.addListener("click", () => {
                    userInfoWindow.open(map, userMarker);
                });

                // تكبير الخريطة لموقع المستخدم
                map.setCenter(userLocation);
                map.setZoom(15);
                
                statusEl.textContent = "تم تحديد موقعك الحالي. يمكنك استكشاف المستشفيات حولك.";
            },
            (error) => {
                console.warn("خطأ في تحديد الموقع:", error);
                let errorMessage = "تعذر تحديد موقعك. ";
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += "تم رفض الإذن للوصول إلى الموقع.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += "معلومات الموقع غير متاحة.";
                        break;
                    case error.TIMEOUT:
                        errorMessage += "انتهت مهلة طلب الموقع.";
                        break;
                    default:
                        errorMessage += "حدث خطأ غير معروف.";
                        break;
                }
                
                statusEl.textContent = errorMessage;
            },
            { 
                enableHighAccuracy: true, 
                timeout: 10000, 
                maximumAge: 60000 
            }
        );
    } else {
        statusEl.textContent = "المتصفح لا يدعم التتبع الجغرافي. يمكنك استكشاف المستشفيات يدويًا على الخريطة.";
    }

    // إضافة عناصر تحكم إضافية
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");
    
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.color = "rgb(25,25,25)";
    controlUI.style.cursor = "pointer";
    controlUI.style.fontFamily = "Cairo, sans-serif";
    controlUI.style.fontSize = "14px";
    controlUI.style.lineHeight = "38px";
    controlUI.style.margin = "8px";
    controlUI.style.padding = "0 12px";
    controlUI.style.textAlign = "center";
    controlUI.style.fontWeight = "bold";
    controlUI.textContent = "العودة لمركز الخريطة";
    
    controlUI.addEventListener("click", () => {
        map.setCenter(benha);
        map.setZoom(14);
    });

    controlDiv.appendChild(controlUI);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
};