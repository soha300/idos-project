// نظام محادثة ذكي محسّن
class SmartChat {
    constructor() {
        this.chatWindow = null;
        this.chatForm = null;
        this.chatInput = null;
        this.clearChatBtn = null;
        this.isTyping = false;
        
        this.init();
    }

    init() {
        document.addEventListener("DOMContentLoaded", () => {
            this.initializeElements();
            this.setupEventListeners();
            this.loadChatHistory();
        });
    }

    initializeElements() {
        this.chatWindow = document.getElementById("chatWindow");
        this.chatForm = document.getElementById("chatForm");
        this.chatInput = document.getElementById("chatInput");
        this.clearChatBtn = document.getElementById("clearChatBtn");
    }

    setupEventListeners() {
        this.chatForm?.addEventListener("submit", (e) => this.handleMessageSend(e));
        this.clearChatBtn?.addEventListener("click", () => this.clearChat());
        
        // تحسين تجربة المستخدم مع زر الإدخال
        this.chatInput?.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.chatForm?.dispatchEvent(new Event("submit"));
            }
        });

        // تحسين إمكانية الوصول
        this.chatInput?.addEventListener("input", () => {
            if (this.chatInput) {
                this.chatInput.setAttribute("aria-invalid", this.chatInput.value.trim() === "");
            }
        });
    }

    // قاعدة المعرفة المحسنة
    get aiResponses() {
        return [
            {
                triggers: ["صداع", "وجع راس", "ألم راس", "مخي بيوجعني", "راسي بتوجعني"],
                reply: "الصداع قد يكون بسبب الإرهاق، الجفاف، التوتر، أو مشاكل في النظر. جرب:\n• شرب الماء بكثرة\n• أخذ قسط من الراحة\n• تجنب الشاشات\n• مسكنات الألم البسيطة\n\nإذا استمر الألم أكثر من 24 ساعة أو كان شديدًا، راجع طبيب الأعصاب."
            },
            {
                triggers: ["كحة", "سعال", "كحه", "تعب تنفس", "ضيق نفس", "سعل"],
                reply: "السعال يحتاج مراقبة. النصائح الأولية:\n• شرب سوائل دافئة\n• تجنب المهيجات مثل الغبار والدخان\n• استخدام وسادة مرتفعة أثناء النوم\n\nإذا صاحبه بلغم أو حرارة أو استمر أكثر من أسبوع، راجع طبيب الصدر."
            },
            {
                triggers: ["حمى", "حرارة", "سخونة", "دفيان", "حرارتي عالية"],
                reply: "الحمى علامة دفاعية من الجسم. يمكنك:\n• استخدام خافض حرارة مثل الباراسيتامول\n• شرب الكثير من السوائل\n• أخذ قسط من الراحة\n• كمادات الماء الفاترة\n\nإذا تجاوزت 39° أو استمرت أكثر من 3 أيام، راجع الطبيب."
            },
            {
                triggers: ["معدة", "بطن", "مغص", "غثيان", "قيء", "تقيؤ", "الم بطني"],
                reply: "آلام المعدة قد تكون بسبب:\n• عسر هضم\n• تسمم غذائي\n• التهاب المعدة\n\nجرب:\n• تجنب الأطعمة الدسمة\n• شرب كميات صغيرة من الماء\n• الراحة\n\nإذا استمر الألم أكثر من 6 ساعات أو كان شديدًا، راجع الطبيب."
            },
            {
                triggers: ["دوخة", "دوار", "دوخان", "دائخ", "أحس بدوخة"],
                reply: "الدوخة قد تكون بسبب:\n• انخفاض الضغط\n• الجفاف\n• فقر الدم\n• مشاكل في الأذن الداخلية\n\nإجراءات فورية:\n• اجلس أو استلقِ فورًا\n• اشرب الماء\n• تنفس بعمق\n\nإذا تكررت، راجع الطبيب لإجراء الفحوصات اللازمة."
            },
            {
                triggers: ["تعب", "إرهاق", "خمول", "ضعف", "تعبان", "ما عندي طاقة"],
                reply: "التعب المستمر يحتاج تقييم. قد يكون بسبب:\n• فقر الدم\n• قصور الغدة الدرقية\n• نقص فيتامينات\n• الإرهاق المزمن\n\nنصائح أولية:\n• النوم الكافي\n• التغذية المتوازنة\n• شرب الماء\n• ممارسة رياضة خفيفة\n\nإذا استمر أكثر من أسبوعين، راجع الطبيب."
            }
        ];
    }

    getAdvancedAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // تحليل متعدد الأعراض
        const symptomGroups = {
            تنفسي: ["كحة", "سعال", "ضيق نفس", "بلغم", "احتقان"],
            هضمي: ["معدة", "بطن", "غثيان", "قيء", "إسهال", "إمساك"],
            عصبي: ["صداع", "دوخة", "دوار", "زغللة"],
            عام: ["حمى", "تعب", "إرهاق", "قشعريرة", "ألم عضلات"]
        };

        let detectedGroups = [];
        for (const [group, symptoms] of Object.entries(symptomGroups)) {
            if (symptoms.some(symptom => lowerMessage.includes(symptom))) {
                detectedGroups.push(group);
            }
        }

        // ردود مخصصة للمجموعات
        if (detectedGroups.includes("تنفسي") && detectedGroups.includes("عام")) {
            return "الأعراض تشير إلى عدوى تنفسية محتملة. الراحة وشرب السوائل الدافئة مهمة. إذا اشتدت الأعراض أو صاحبها ارتفاع في الحرارة، راجع الطبيب لإجراء الفحوصات اللازمة.";
        }

        if (detectedGroups.includes("هضمي") && lowerMessage.includes("حمى")) {
            return "آلام البطن مع الحرارة قد تشير إلى التهاب معوي أو تسمم غذائي. جرب الصيام عن الطعام لعدة ساعات مع شرب السوائل، وإذا استمرت الأعراض راجع الطبيب.";
        }

        if (detectedGroups.includes("عصبي") && detectedGroups.includes("عام")) {
            return "الصداع أو الدوخة مع التعب قد يكون بسبب إرهاق أو جفاف. حاول أخذ قسط من الراحة، شرب الماء، وتجنب الإجهاد. إذا استمرت الأعراض راجع الطبيب.";
        }

        // البحث في الردود العادية
        const matchedResponse = this.aiResponses.find(entry =>
            entry.triggers.some(trigger => lowerMessage.includes(trigger))
        );

        if (matchedResponse) {
            return matchedResponse.reply;
        }

        // رد ذكي افتراضي
        return `أفهم أنك تشعر ببعض الأعراض. هل يمكنك وصف:\n• مدة استمرار الأعراض\n• شدة الألم (خفيف/متوسط/شديد)\n• الأعراض الأخرى المرافقة\n\nهذا سيساعدني في تقديم نصيحة أكثر دقة.`;
    }

    async handleMessageSend(event) {
        event.preventDefault();
        
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;

        // إضافة رسالة المستخدم
        this.addMessage(message, true);
        this.chatInput.value = "";
        this.chatInput.focus();

        // محاكاة الكتابة
        this.showTypingIndicator();

        // محاكاة وقت المعالجة
        setTimeout(() => {
            this.hideTypingIndicator();
            const aiResponse = this.getAdvancedAIResponse(message);
            this.addMessage(aiResponse, false);
        }, 1500 + Math.random() * 1000);
    }

    addMessage(message, isUser = false) {
        if (!this.chatWindow) return;

        const messageDiv = document.createElement("div");
        messageDiv.className = `chat-message ${isUser ? 'chat-message--user' : 'chat-message--ai'}`;
        
        const time = new Date().toLocaleTimeString("ar-EG", { 
            hour: "numeric", 
            minute: "2-digit" 
        });

        // معالجة الأسطر الجديدة في الرسالة
        const formattedMessage = message.replace(/\n/g, '<br>');

        messageDiv.innerHTML = `
            <div class="chat-avatar">${isUser ? '👤' : '🤖'}</div>
            <div class="chat-bubble">
                <span class="chat-name">${isUser ? 'أنت' : 'المساعد الذكي'}</span>
                <p>${formattedMessage}</p>
                <time datetime="${new Date().toISOString()}">${time}</time>
            </div>
        `;

        this.chatWindow.appendChild(messageDiv);
        this.scrollToBottom();
        this.saveChatHistory();
    }

    showTypingIndicator() {
        if (!this.chatWindow || this.isTyping) return;

        this.isTyping = true;
        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-message chat-message--ai";
        typingDiv.id = "typing-indicator";
        typingDiv.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="chat-bubble">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        this.chatWindow.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        if (this.chatWindow) {
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        }
    }

    clearChat() {
        if (!this.chatWindow || !confirm("هل تريد مسح كل المحادثة؟")) return;

        this.chatWindow.innerHTML = `
            <div class="chat-message chat-message--ai">
                <div class="chat-avatar">🤖</div>
                <div class="chat-bubble">
                    <span class="chat-name">المساعد الذكي</span>
                    <p>مرحبًا! أنا هنا لمساعدتك. أخبرني بما تشعر به لنبدأ.</p>
                    <time datetime="${new Date().toISOString()}">الآن</time>
                </div>
            </div>
        `;

        localStorage.removeItem("chatHistory");
        this.showNotification("تم مسح المحادثة بنجاح", "success");
    }

    loadChatHistory() {
        const savedChat = localStorage.getItem("chatHistory");
        if (savedChat && this.chatWindow) {
            this.chatWindow.innerHTML = savedChat;
            this.scrollToBottom();
        }
    }

    saveChatHistory() {
        if (this.chatWindow) {
            // حفظ فقط آخر 50 رسالة لتجنب التخزين الزائد
            const messages = this.chatWindow.innerHTML;
            localStorage.setItem("chatHistory", messages);
        }
    }

    showNotification(message, type = 'info') {
        if (window.appManager && window.appManager.showNotification) {
            window.appManager.showNotification(message, type);
        }
    }
}

// تهيئة النظام
new SmartChat();