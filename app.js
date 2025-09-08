class IronLadyChatbot {
    constructor() {
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.quickActions = document.getElementById('quickActions');
        this.exportModal = document.getElementById('exportModal');
        this.chatHistory = [];
        this.isTyping = false;

        // Program data
        this.programData = {
            "programs": [
                {
                    "name": "Leadership Essentials Program",
                    "description": "Core leadership program with Business War Tactics methodology",
                    "duration": "3 months",
                    "format": "Hybrid - Online and offline sessions",
                    "certification": "Certified by TISS (Tata Institute of Social Sciences)",
                    "features": ["Strategic maximization", "Shameless pitching", "Unapologetic mindset", "Personalized mentoring"]
                },
                {
                    "name": "1-Crore Club",
                    "description": "Program for women to achieve 1+ crore income levels",
                    "duration": "Ongoing with quarterly intensives",
                    "format": "Online community with live sessions",
                    "certification": "Achievement recognition certificate",
                    "features": ["Income optimization", "Strategic career planning", "High-level networking"]
                },
                {
                    "name": "100 Board Members",
                    "description": "Preparation for board positions and governance roles",
                    "duration": "6 months",
                    "format": "Executive format - monthly intensives",
                    "certification": "Board readiness certification",
                    "features": ["Governance skills", "Strategic thinking", "Board dynamics"]
                },
                {
                    "name": "Business War Tactics Masterclass",
                    "description": "3-day intensive workshop on core business strategies",
                    "duration": "3 days",
                    "format": "Live online workshops",
                    "certification": "Completion certificate",
                    "features": ["B-HAG setting", "Differentiated branding", "Negotiation skills"]
                }
            ],
            "mentors": [
                {
                    "name": "Rajesh Bhat",
                    "role": "Founder & Director",
                    "background": "TEDx Speaker, 25+ years experience in transformational programs"
                },
                {
                    "name": "Suvarna Hegde",
                    "role": "CEO & Founder",
                    "background": "Leadership development expert, driving mission of 1 million women at the top"
                },
                {
                    "name": "Simon Newman",
                    "role": "Program Leader & Board Member",
                    "background": "Ex-CEO of Aviva Singapore, Strategic leadership expert"
                },
                {
                    "name": "Sridhar Sambandam",
                    "role": "Program Leader & Board Member",
                    "background": "Ex-CEO of Bajaj Auto, Automotive industry leader"
                },
                {
                    "name": "Chitra Talwar",
                    "role": "Board Member & Mentor",
                    "background": "Corporate governance and women leadership advocate"
                }
            ],
            "certifications": {
                "primary": "TISS (Tata Institute of Social Sciences)",
                "partners": ["NSDC", "NASSCOM Foundation"],
                "recognition": "Industry-recognized certificates",
                "validity": "Lifetime access to alumni network"
            }
        };

        this.init();
    }

    init() {
        this.showWelcomeMessage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Send button click
        this.sendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSendMessage();
        });

        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Quick action buttons
        const quickButtons = document.querySelectorAll('.quick-btn');
        quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const question = e.target.closest('.quick-btn').getAttribute('data-question');
                this.handleQuickAction(question);
            });
        });

        // Clear chat
        const clearBtn = document.getElementById('clearChat');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearChat();
            });
        }

        // Export chat
        const exportBtn = document.getElementById('exportChat');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showExportModal();
            });
        }

        // Modal controls
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideExportModal();
            });
        }

        const exportTxt = document.getElementById('exportTxt');
        if (exportTxt) {
            exportTxt.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportChat('txt');
            });
        }

        const exportJson = document.getElementById('exportJson');
        if (exportJson) {
            exportJson.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportChat('json');
            });
        }

        // Close modal when clicking overlay
        if (this.exportModal) {
            this.exportModal.addEventListener('click', (e) => {
                if (e.target === this.exportModal || e.target.classList.contains('modal-overlay')) {
                    this.hideExportModal();
                }
            });
        }

        // Voice button (placeholder for future implementation)
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleVoiceInput();
            });
        }
    }

    showWelcomeMessage() {
        const welcomeMessage = `
👑 **Welcome to Iron Lady!** 👑

I'm your AI assistant, here to help you learn about our transformational leadership programs designed to empower women to reach the top of their careers.

**What I can help you with:**
• 📚 Information about our leadership programs
• 👥 Details about our expert mentors
• 🎓 Certification and accreditation info
• 💰 Program pricing and enrollment
• 🏆 Success stories from our alumni
• 🌟 Career guidance and next steps

Feel free to ask me anything or use the quick questions below! ✨`;

        this.addMessage(welcomeMessage, 'bot');
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message === '' || this.isTyping) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        
        this.showTypingIndicator();
        this.processMessage(message);
    }

    handleQuickAction(question) {
        if (this.isTyping) return;
        
        this.addMessage(question, 'user');
        this.showTypingIndicator();
        this.processMessage(question);
    }

    handleVoiceInput() {
        // Placeholder for voice input functionality
        this.addMessage("🎤 Voice input feature coming soon! Stay tuned for hands-free interaction.", 'bot');
    }

    processMessage(message) {
        // Simulate processing delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            this.suggestFollowUp(message);
        }, Math.random() * 2000 + 1000); // 1-3 seconds delay
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.classList.add('hidden');
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message--${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message__avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message__content';
        
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message__bubble';
        bubbleDiv.innerHTML = this.formatMessage(content);
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message__time';
        timeDiv.textContent = new Date().toLocaleTimeString();
        
        contentDiv.appendChild(bubbleDiv);
        contentDiv.appendChild(timeDiv);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add to chat history
        this.chatHistory.push({
            content: content,
            sender: sender,
            timestamp: new Date().toISOString()
        });
    }

    formatMessage(content) {
        // Convert markdown-style formatting to HTML
        let formatted = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<br>• ');
        
        return formatted;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 100);
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();

        if (this.containsKeywords(message, ['program', 'course', 'training', 'learn'])) {
            return this.getProgramsResponse();
        }

        if (this.containsKeywords(message, ['mentor', 'teacher', 'instructor', 'coach', 'guide'])) {
            return this.getMentorsResponse();
        }

        if (this.containsKeywords(message, ['price', 'cost', 'fee', 'payment', 'money', 'expensive'])) {
            return this.getPricingResponse();
        }

        if (this.containsKeywords(message, ['enroll', 'join', 'register', 'signup', 'start', 'begin'])) {
            return this.getEnrollmentResponse();
        }

        if (this.containsKeywords(message, ['certificate', 'certification', 'accreditation', 'credential'])) {
            return this.getCertificateResponse();
        }

        if (this.containsKeywords(message, ['duration', 'time', 'long', 'months', 'weeks'])) {
            return this.getDurationResponse();
        }

        if (this.containsKeywords(message, ['format', 'online', 'offline', 'hybrid', 'virtual'])) {
            return this.getFormatResponse();
        }

        if (this.containsKeywords(message, ['success', 'story', 'testimonial', 'alumni', 'graduate'])) {
            return this.getSuccessStoriesResponse();
        }

        if (this.containsKeywords(message, ['community', 'network', 'connect', 'group'])) {
            return this.getCommunityResponse();
        }

        if (this.containsKeywords(message, ['location', 'where', 'address', 'place'])) {
            return this.getLocationResponse();
        }

        if (this.containsKeywords(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
            return this.getGreetingResponse();
        }

        if (this.containsKeywords(message, ['thank', 'thanks', 'appreciate', 'grateful'])) {
            return this.getThankYouResponse();
        }

        return this.getDefaultResponse();
    }

    containsKeywords(message, keywords) {
        return keywords.some(keyword => message.includes(keyword));
    }

    getGreetingResponse() {
        const greetings = [
            "Hello! 👋 Welcome to Iron Lady! I'm excited to help you discover our transformational leadership programs.",
            "Hi there! 🌟 Great to meet you! I'm here to guide you through Iron Lady's amazing leadership opportunities.",
            "Hey! 👑 Welcome to your leadership journey! What would you like to know about Iron Lady programs?"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    getThankYouResponse() {
        return `
🙏 **You're most welcome!** 

I'm here whenever you need guidance on your leadership journey. Iron Lady is committed to empowering women like you to reach the pinnacle of success!

**Ready to take the next step?** 
• Explore our programs
• Connect with our mentors
• Join our community of leaders

**Remember:** *Every expert was once a beginner, but not every beginner becomes an expert. The difference is taking action!* 💪✨`;
    }

    getProgramsResponse() {
        let response = `
🎓 **Iron Lady Leadership Programs** 🎓

Iron Lady offers comprehensive leadership programs designed for women at different career stages:

`;

        this.programData.programs.forEach(program => {
            response += `
**📚 ${program.name}**
${program.description}

⏰ **Duration:** ${program.duration}
📱 **Format:** ${program.format}
🏆 **Certification:** ${program.certification}
**✨ Key Features:** ${program.features.join(', ')}

---
`;
        });

        response += `
Each program includes **personalized mentoring** and **lifetime access** to our alumni network. 

**Ready to transform your career?** Would you like to know more about any specific program? 🚀`;

        return response;
    }

    getDurationResponse() {
        let response = `
⏰ **Program Durations & Time Commitment** ⏰

Our programs are designed to fit different schedules and learning preferences:

`;

        this.programData.programs.forEach(program => {
            response += `**${program.name}:** ${program.duration}\n`;
        });

        response += `
**✨ Flexibility Features:**
• Self-paced online modules
• Live sessions scheduled on weekends
• Recorded sessions for makeup
• Mobile-friendly learning platform
• 24/7 community support

All programs include **ongoing community support** and **lifetime alumni network access**. The learning doesn't stop after certification! 🌟`;

        return response;
    }

    getFormatResponse() {
        return `
📱 **Learning Format & Experience** 📱

Iron Lady uses a comprehensive **hybrid learning model** to maximize flexibility and engagement:

**🌐 Online Components:**
• Interactive video modules
• Live virtual masterclasses  
• Digital resource library
• Mobile learning app
• 24/7 community forums

**🏢 Offline Components:**
• In-person intensive workshops
• Networking events in major cities
• Mentorship meetups
• Leadership retreats
• Industry conferences

**🎯 Personalized Experience:**
• One-on-one mentoring sessions
• Customized learning paths
• Real-time feedback & coaching
• Peer collaboration projects

This hybrid approach ensures you get the best of both worlds - **convenience of online learning** with the **power of in-person connections**! 🚀`;
    }

    getCertificateResponse() {
        const cert = this.programData.certifications;
        return `
🏆 **Certifications & Recognition** 🏆

**Yes!** All Iron Lady programs provide industry-recognized certifications:

**🎓 Primary Certification**
**${cert.primary}** - All main programs are certified by the prestigious Tata Institute of Social Sciences.

**🤝 Additional Recognition**
Partnership certifications through:
${cert.partners.map(partner => `• ${partner}`).join('\n')}

**✨ What You Get:**
• ${cert.recognition}
• LinkedIn-ready credentials
• ${cert.validity}
• Industry recognition
• Enhanced career credibility

**🌟 Alumni Benefits:**
• Lifetime network access
• Continued learning opportunities  
• Exclusive job referrals
• Board position nominations
• Speaking opportunities

Our certificates are **valued by employers** and **recognized across industries**! Ready to add these prestigious credentials to your profile? 💪`;
    }

    getMentorsResponse() {
        let response = `
👥 **Meet Our World-Class Mentors** 👥

Learn from accomplished leaders who have reached the top of their fields:

`;

        this.programData.mentors.forEach(mentor => {
            response += `
**🌟 ${mentor.name}**
*${mentor.role}*
${mentor.background}

`;
        });

        response += `
**🎤 Guest Speakers Include:**
• **Indra Nooyi** - Former CEO of PepsiCo
• **Kiran Mazumdar-Shaw** - Biocon Founder
• **Falguni Nayar** - Nykaa Founder & CEO
• Other Fortune 500 executives and industry leaders

**💡 Mentorship Approach:**
• Personalized 1:1 guidance
• Industry-specific insights
• Real-world case studies
• Career pathway planning
• Network introductions

Our mentors provide **personalized guidance**, helping you navigate your unique leadership journey to the top! 🚀`;

        return response;
    }

    getEnrollmentResponse() {
        return `
🚀 **Ready to Start Your Leadership Journey?** 🚀

Enrolling in Iron Lady programs is **simple and straightforward**:

**📝 Enrollment Steps:**
1️⃣ **Program Selection** - Choose your ideal program
2️⃣ **Application Form** - Complete our quick assessment
3️⃣ **Consultation Call** - Speak with our enrollment advisor
4️⃣ **Program Matching** - We recommend the best fit
5️⃣ **Secure Your Spot** - Complete enrollment & payment

**📞 Contact Information:**
• **Phone:** +91-80-1234-5678
• **Email:** programs@ironlady.in
• **WhatsApp:** +91-9876543210
• **Website:** www.ironlady.in

**💰 Payment Options:**
• Full payment (with discount)
• EMI options available
• Corporate sponsorship programs
• Scholarship opportunities

**🎁 Special Offers:**
• Early bird discounts
• Referral bonuses
• Group enrollment benefits

Would you like me to help you **choose the right program** for your career goals? Let's make it happen! ✨`;
    }

    getPricingResponse() {
        return `
💰 **Investment in Your Leadership Future** 💰

Iron Lady programs are **competitively priced** to provide exceptional value:

**💎 Program Investment Ranges:**
• **Masterclass (3 days):** ₹25,000 - ₹35,000
• **Leadership Essentials (3 months):** ₹1,50,000 - ₹2,00,000  
• **1-Crore Club (Ongoing):** ₹3,00,000 - ₹4,00,000
• **100 Board Members (6 months):** ₹5,00,000 - ₹7,00,000

**✨ What's Included:**
• All course materials & resources
• Personal mentoring sessions
• Lifetime alumni network access
• Industry networking events
• Certification fees
• Ongoing career support

**💳 Flexible Payment Options:**
• 0% EMI plans available
• Corporate billing
• Tax benefits under Skill Development
• Scholarship programs for deserving candidates

**🎁 Special Offers Available:**
• Early bird discounts (up to 20%)
• Group enrollment benefits
• Referral rewards

**Remember:** This is an **investment in your career** that will pay dividends for a lifetime! The ROI on leadership development is immeasurable. 🚀

Ready to invest in yourself? Let's discuss the perfect program for you! 💪`;
    }

    getSuccessStoriesResponse() {
        return `
🏆 **Success Stories That Inspire** 🏆

Iron Lady has **transformed the careers** of thousands of women:

**💪 Leadership Transformations:**

*"Iron Lady gave me the confidence and skills to negotiate a C-suite position. The Business War Tactics methodology is game-changing! I went from Senior Manager to VP in 18 months."*
**- Priya Sharma, VP Technology, Fortune 500 Company**

*"The mentorship and network I gained has been invaluable. I'm now on 3 corporate boards and mentor other women leaders."*
**- Dr. Anita Reddy, Independent Director & Former CEO**

*"From ₹25 lakhs to ₹2 crores in income within 2 years of completing the 1-Crore Club program. The strategies work!"*
**- Meera Patel, Entrepreneur & Business Owner**

**📈 Impact Numbers:**
• **85%** of graduates achieve promotions within 12 months
• **92%** report increased confidence and leadership skills
• **78%** receive significant salary increases
• **Over 150** board positions secured by alumni
• **₹500+ crores** in additional income generated by graduates

**🌟 Alumni Network:**
• CEOs of major corporations
• Successful entrepreneurs
• Board members and directors
• Government leaders
• Social changemakers

Would you like to **connect with alumni** from your industry or learn more about specific success stories? Your success story could be next! ✨`;
    }

    getCommunityResponse() {
        return `
🌟 **Join the Iron Lady Sisterhood** 🌟

When you join Iron Lady, you're not just taking a program - you're joining a **powerful network of ambitious women**:

**👑 Our Community:**
• **5,000+** active members worldwide
• **150+** board positions held by alumni
• **500+** C-suite executives
• **1,000+** successful entrepreneurs
• **50+ countries** represented

**🤝 Networking Opportunities:**
• Monthly virtual meetups
• Annual leadership summit
• Regional chapter events
• Industry-specific groups
• Mentorship circles

**💬 Stay Connected:**
• Exclusive WhatsApp groups
• LinkedIn community
• Mobile app with forums
• Success celebration events
• Collaborative projects

**🎯 Community Benefits:**
• Job referrals and opportunities
• Business partnerships
• Investment connections
• Board nominations
• Speaking engagements

Our mission is to create **1 million women leaders** - and our community is the foundation of this transformation!

**🔥 Community Motto:**
*"When women support women, incredible things happen!"*

Ready to be part of this **powerful sisterhood of leaders**? Your tribe is waiting for you! 💪✨`;
    }

    getLocationResponse() {
        return `
📍 **Iron Lady Headquarters & Locations** 📍

**🏢 Main Campus:**
**Bangalore, India**
📍 ITPL (International Tech Park Limited)
Whitefield, Bangalore - 560066

🚌 **How to Reach:**
• 15 minutes from Bangalore Airport
• Metro connectivity (Purple Line)
• Ample parking available
• Shuttle service from major hotels

**🌍 Program Delivery:**
**Global Reach, Local Impact**

Whether you're in Bangalore or anywhere in the world, you can access our programs:

**🌐 Online Delivery:** Available worldwide
**🏢 In-Person Workshops:** 
• Bangalore (Primary)
• Mumbai, Delhi, Hyderabad (Quarterly)
• International locations (Annual summits)

**✈️ Travel Support:**
• Accommodation assistance for outstation participants
• Group travel arrangements
• Local transportation coordination
• Cultural immersion activities

**🏨 Recommended Hotels:**
• The Leela Palace Bangalore
• Conrad Bangalore
• Marriott Whitefield
• Special rates for Iron Lady participants

Distance is **never a barrier** to your leadership development with Iron Lady! We bring world-class training to you, wherever you are! 🌟`;
    }

    getDefaultResponse() {
        return `
🤔 **I'd be happy to provide more specific information!** 

Here are some topics I can help with:

**📚 Programs & Courses**
• Leadership development programs
• Skill-specific masterclasses
• Duration and formats

**👥 People & Community**  
• Meet our mentors and advisors
• Alumni success stories
• Networking opportunities

**🎓 Credentials & Recognition**
• Certifications and accreditations
• Industry recognition
• Career advancement impact

**💰 Investment & Enrollment**
• Program pricing and payment options
• Enrollment process
• Special offers and scholarships

Could you please **rephrase your question** or let me know what specific aspect of Iron Lady programs you'd like to learn about?

You can also use the **quick question buttons** below for faster help! 😊✨`;
    }

    getErrorResponse() {
        return `
⚠️ **Oops! Something went wrong** ⚠️

I apologize for the technical difficulty. Please try asking your question again, or use one of the quick action buttons below.

**🛠️ Alternative Options:**
• Try rephrasing your question
• Use the quick question buttons
• Contact our support team directly

**📞 Direct Support:**
• Email: support@ironlady.in
• Phone: +91-80-1234-5678
• WhatsApp: +91-9876543210

If the issue persists, our team will be happy to assist you personally! 💪`;
    }

    suggestFollowUp(userMessage) {
        let suggestions = [];
        
        if (this.containsKeywords(userMessage, ['program', 'course'])) {
            suggestions = [
                "Tell me about the enrollment process",
                "Who are the mentors?",
                "What certifications do you provide?"
            ];
        } else if (this.containsKeywords(userMessage, ['mentor', 'coach'])) {
            suggestions = [
                "How does the mentoring process work?",
                "What programs do you recommend for me?",
                "Tell me about success stories"
            ];
        } else if (this.containsKeywords(userMessage, ['certificate', 'certification'])) {
            suggestions = [
                "How long do the programs take?",
                "What's the format - online or offline?",
                "How do I enroll?"
            ];
        }

        if (suggestions.length > 0) {
            setTimeout(() => {
                let followUpHtml = `
                <div class="follow-up-suggestions" style="margin-top: 16px; padding: 12px; background: var(--bg-tertiary); border-radius: var(--radius-lg); border: 1px solid var(--border-primary);">
                    <p style="margin: 0 0 8px 0; font-weight: var(--font-weight-medium); color: var(--text-secondary);"><i class="fas fa-lightbulb" style="color: var(--accent-gold);"></i> <strong>You might also want to know:</strong></p>
                `;
                
                suggestions.forEach(suggestion => {
                    followUpHtml += `
                    <button class="follow-up-btn" onclick="ironLadyBot.handleQuickAction('${suggestion}')" 
                            style="display: inline-block; margin: 4px 8px 4px 0; padding: 6px 12px; background: var(--gradient-primary); color: var(--text-primary); border: none; border-radius: var(--radius-full); font-size: var(--font-size-xs); cursor: pointer; transition: all var(--transition-fast);">
                        ${suggestion}
                    </button>`;
                });
                
                followUpHtml += '</div>';
                
                const lastBotMessage = this.messagesArea.querySelector('.message--bot:last-of-type .message__bubble');
                if (lastBotMessage && !lastBotMessage.querySelector('.follow-up-suggestions')) {
                    lastBotMessage.insertAdjacentHTML('beforeend', followUpHtml);
                    this.scrollToBottom();
                }
            }, 2000);
        }
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.messagesArea.innerHTML = '';
            this.chatHistory = [];
            this.showWelcomeMessage();
        }
    }

    showExportModal() {
        this.exportModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideExportModal() {
        this.exportModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    exportChat(format) {
        let content = '';
        const timestamp = new Date().toISOString().split('T')[0];
        
        if (format === 'txt') {
            content = `Iron Lady Chatbot - Conversation Export\nDate: ${timestamp}\n${'='.repeat(50)}\n\n`;
            this.chatHistory.forEach(msg => {
                const time = new Date(msg.timestamp).toLocaleTimeString();
                const sender = msg.sender === 'bot' ? 'Iron Lady AI' : 'You';
                content += `[${time}] ${sender}:\n${msg.content.replace(/<[^>]*>/g, '')}\n\n${'─'.repeat(30)}\n\n`;
            });
        } else if (format === 'json') {
            content = JSON.stringify({
                export_date: new Date().toISOString(),
                conversation: this.chatHistory
            }, null, 2);
        }
        
        const blob = new Blob([content], { type: format === 'txt' ? 'text/plain' : 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `iron-lady-chat-${timestamp}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.hideExportModal();
        this.addMessage(`✅ Chat exported successfully as ${format.toUpperCase()} file!`, 'bot');
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', function() {
    window.ironLadyBot = new IronLadyChatbot();
});

// Additional utility functions for enhanced UX
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling behavior
    const messagesArea = document.getElementById('messagesArea');
    if (messagesArea) {
        messagesArea.style.scrollBehavior = 'smooth';
    }
    
    // Add input focus effects
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        messageInput.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    }
    
    // Add button click animations
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') || e.target.classList.contains('quick-btn')) {
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    });
});