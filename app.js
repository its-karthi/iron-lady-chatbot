// Iron Lady Chatbot Application
class IronLadyChatbot {
    constructor() {
        console.log('Initializing Iron Lady Chatbot...');
        
        // Get DOM elements
        this.messagesArea = document.getElementById('messagesArea');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearBtn = document.getElementById('clearChatBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.quickActions = document.getElementById('quickActions');
        
        // Check if required elements exist
        if (!this.messagesArea || !this.messageInput || !this.sendBtn) {
            console.error('Critical DOM elements missing:', {
                messagesArea: !!this.messagesArea,
                messageInput: !!this.messageInput,
                sendBtn: !!this.sendBtn
            });
        }
        
        this.loadKnowledgeBase();
        this.setupEventListeners();
        
        // Show welcome message after a short delay
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 500);
    }

    loadKnowledgeBase() {
        this.knowledgeBase = {
            faqs: [
                {
                    question: "What programs does Iron Lady offer?",
                    answer: "Iron Lady offers three main programs:\n\n🎯 **Leadership Essentials Program** - Focusing on shameless pitching, strategic maximization, and unapologetic mindset\n\n💰 **1-crore Club** - For high achievers targeting 1-crore income\n\n👩‍💼 **100 Board Members** - To develop board-ready women leaders\n\nAll are 3-month certificate programs designed for women leaders at different career stages."
                },
                {
                    question: "What is the program duration?",
                    answer: "All Iron Lady programs are **3-month certificate programs** with weekly sessions from industry experts and business leaders. Each program is designed to provide intensive, practical leadership training that fits into your busy schedule."
                },
                {
                    question: "Is the program online or offline?",
                    answer: "Iron Lady offers **both online and offline delivery options** to suit your preferences and schedule:\n\n💻 **Online**: Participate from anywhere with live interactive sessions\n🏢 **Offline**: In-person sessions conducted at ITPL, Bengaluru\n\nYou can choose the format that works best for you!"
                },
                {
                    question: "Are certificates provided?",
                    answer: "**Yes!** All Iron Lady programs provide certificates from **Tata Institute of Social Sciences** upon completion. This prestigious certification adds significant value to your professional profile and validates your leadership development journey."
                },
                {
                    question: "Who are the mentors/coaches?",
                    answer: "Our programs are led by **successful CEOs and Ex-CEOs** who serve as program leaders and mentors. These industry veterans bring real-world leadership experience, practical insights, and proven strategies to help you excel in your leadership journey."
                },
                {
                    question: "Where are offline programs held?",
                    answer: "Offline programs are conducted at **ITPL (International Tech Park Limited), Bengaluru**. This modern, professional venue provides the perfect environment for learning and networking with fellow women leaders."
                }
            ]
        };

        // Create keyword mapping for better question matching
        this.keywordMap = {
            programs: ['program', 'course', 'training', 'offer', 'available', 'options'],
            duration: ['duration', 'time', 'long', 'period', 'months', 'weeks'],
            delivery: ['online', 'offline', 'virtual', 'person', 'mode', 'format'],
            certificates: ['certificate', 'certification', 'credential', 'qualify', 'accredited'],
            mentors: ['mentor', 'coach', 'teacher', 'instructor', 'leader', 'guide', 'who'],
            location: ['location', 'place', 'venue', 'address', 'where', 'bengaluru', 'bangalore', 'itpl']
        };
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Send button click handler
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Send button clicked');
                this.handleSendMessage();
            });
            console.log('Send button listener added');
        }

        // Enter key handler for message input
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    console.log('Enter key pressed');
                    this.handleSendMessage();
                }
            });

            this.messageInput.addEventListener('input', () => {
                this.toggleSendButton();
            });
            console.log('Message input listeners added');
        }

        // Clear chat button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clear button clicked');
                this.clearChat();
            });
            console.log('Clear button listener added');
        }
        
        // Quick action buttons using event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-btn') || e.target.parentElement.classList.contains('quick-btn')) {
                e.preventDefault();
                const btn = e.target.classList.contains('quick-btn') ? e.target : e.target.parentElement;
                const question = btn.getAttribute('data-question');
                console.log('Quick button clicked:', question);
                if (question) {
                    this.handleQuickQuestion(question);
                }
            }
        });
        console.log('Quick action listeners set up');

        // Initial button state
        this.toggleSendButton();
    }

    showWelcomeMessage() {
        const welcomeText = `👋 **Welcome to Iron Lady Leadership Programs!**

I'm here to help you learn about our transformative leadership programs designed specifically for ambitious women leaders.

🌟 **What I can help you with:**
• Information about our 3 leadership programs
• Program duration and delivery options
• Certification details
• Mentor information
• Location and logistics

Feel free to ask me anything or click on the quick questions below to get started!`;

        this.addMessage(welcomeText, 'bot');
        console.log('Welcome message displayed');
    }

    handleSendMessage() {
        if (!this.messageInput) {
            console.error('Message input not found');
            return;
        }

        const message = this.messageInput.value.trim();
        console.log('Handling send message:', message);
        
        if (!message) {
            console.log('Empty message, returning');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input and update button state
        this.messageInput.value = '';
        this.toggleSendButton();
        this.hideQuickActions();
        
        // Show typing indicator and generate response
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1500);
    }

    handleQuickQuestion(question) {
        console.log('Handling quick question:', question);
        
        // Add user message
        this.addMessage(question, 'user');
        this.hideQuickActions();
        
        // Show typing indicator and generate response
        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(question);
            this.addMessage(response, 'bot');
        }, 1200);
    }

    generateResponse(userMessage) {
        console.log('Generating response for:', userMessage);
        const message = userMessage.toLowerCase();
        
        // Direct FAQ matching
        for (const faq of this.knowledgeBase.faqs) {
            if (this.isQuestionMatch(message, faq.question.toLowerCase())) {
                return faq.answer;
            }
        }

        // Keyword-based matching
        const matchedCategory = this.findBestMatch(message);
        console.log('Matched category:', matchedCategory);
        
        switch (matchedCategory) {
            case 'programs':
                return this.knowledgeBase.faqs[0].answer;
            case 'duration':
                return this.knowledgeBase.faqs[1].answer;
            case 'delivery':
                return this.knowledgeBase.faqs[2].answer;
            case 'certificates':
                return this.knowledgeBase.faqs[3].answer;
            case 'mentors':
                return this.knowledgeBase.faqs[4].answer;
            case 'location':
                return this.knowledgeBase.faqs[5].answer;
            default:
                return this.getDefaultResponse(message);
        }
    }

    isQuestionMatch(userMessage, faqQuestion) {
        const userWords = userMessage.split(' ').filter(word => word.length > 2);
        const faqWords = faqQuestion.split(' ').filter(word => word.length > 2);
        
        let matchCount = 0;
        for (const userWord of userWords) {
            for (const faqWord of faqWords) {
                if (userWord.includes(faqWord) || faqWord.includes(userWord)) {
                    matchCount++;
                    break;
                }
            }
        }
        
        return matchCount >= Math.min(2, userWords.length);
    }

    findBestMatch(message) {
        let bestMatch = null;
        let highestScore = 0;

        for (const [category, keywords] of Object.entries(this.keywordMap)) {
            let score = 0;
            for (const keyword of keywords) {
                if (message.includes(keyword)) {
                    score++;
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestMatch = category;
            }
        }

        return highestScore > 0 ? bestMatch : null;
    }

    getDefaultResponse(message) {
        const responses = [
            `I'd be happy to help you learn more about Iron Lady's leadership programs! 🌟

Here are some topics I can assist you with:

🎯 **Our Programs**: Leadership Essentials, 1-crore Club, 100 Board Members
⏰ **Duration**: 3-month certificate programs
💻 **Delivery**: Online and offline options
🏆 **Certificates**: From Tata Institute of Social Sciences
👥 **Mentors**: Successful CEOs and Ex-CEOs
📍 **Location**: ITPL, Bengaluru

What would you like to know more about?`,

            `Great question! While I specialize in information about Iron Lady's leadership programs, I'd be happy to help you with:

✨ Program details and features
⏰ Duration and scheduling
💻 Online vs offline options  
🎓 Certification information
👨‍💼 Information about our mentors
📍 Location details

Is there something specific about our programs you'd like to explore?`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(text, sender) {
        if (!this.messagesArea) {
            console.error('Messages area not found');
            return;
        }

        console.log('Adding message:', sender, text.substring(0, 50) + '...');

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '👑' : '👤';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        // Convert markdown-style formatting to HTML
        const formattedText = this.formatMessage(text);
        messageText.innerHTML = formattedText;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-time';
        timestamp.textContent = this.getCurrentTime();
        
        content.appendChild(messageText);
        content.appendChild(timestamp);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/🎯|💰|👩‍💼|💻|🏢|👨‍💼|🌟|✨|⏰|🎓|📍|🔹|🚀/g, '<span style="font-size: 1.1em;">$&</span>');
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.add('show');
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.remove('show');
        }
    }

    toggleSendButton() {
        if (this.sendBtn && this.messageInput) {
            const hasText = this.messageInput.value.trim().length > 0;
            this.sendBtn.disabled = !hasText;
        }
    }

    hideQuickActions() {
        if (this.quickActions) {
            this.quickActions.style.display = 'none';
        }
    }

    showQuickActions() {
        if (this.quickActions) {
            this.quickActions.style.display = 'block';
        }
    }

    scrollToBottom() {
        if (this.messagesArea) {
            setTimeout(() => {
                this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
            }, 100);
        }
    }

    clearChat() {
        console.log('Clearing chat');
        if (confirm('Are you sure you want to clear the chat history?')) {
            if (this.messagesArea) {
                this.messagesArea.innerHTML = '';
            }
            this.showQuickActions();
            setTimeout(() => {
                this.showWelcomeMessage();
            }, 200);
        }
    }
}

// Initialize the chatbot when DOM is ready
let chatbotInstance = null;

function initializeChatbot() {
    if (!chatbotInstance) {
        console.log('Initializing chatbot...');
        try {
            chatbotInstance = new IronLadyChatbot();
            console.log('Chatbot initialized successfully');
        } catch (error) {
            console.error('Error initializing chatbot:', error);
        }
    }
}

// Multiple initialization points to ensure it works
document.addEventListener('DOMContentLoaded', initializeChatbot);
window.addEventListener('load', initializeChatbot);

// Fallback initialization after a delay
setTimeout(initializeChatbot, 1000);