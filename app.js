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

    // إضافة تأثير النقر على أزرار الطوارئ
    document.querySelectorAll('.emergency-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // إضافة تأثير النقر
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // تسجيل الحدث في التحليلات (اختياري)
            console.log('تم النقر على زر الطوارئ:', this.querySelector('strong').textContent);
        });
    });
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
                fillColor: "#7c3aed",
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: "#5b21b6"
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
                statusEl.textContent = "تم تحديد موقعك الحالي. يمكنك استكشاف المستشفيات حولك.";
            },
            (error) => {
                console.warn("خطأ في تحديد الموقع:", error);
                statusEl.textContent = "تعذر تحديد موقعك. يمكنك السماح بالوصول إلى الموقع أو البحث يدويًا.";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    } else {
        statusEl.textContent = "المتصفح لا يدعم التتبع الجغرافي.";
    }
};