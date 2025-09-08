// Iron Lady Chatbot Application - With OpenAI API Bonus
require('dotenv').config();

class IronLadyChatbot {

  constructor() {
    // Get DOM elements
    this.messagesArea = document.getElementById('messagesArea');
    this.messageInput = document.getElementById('messageInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.clearBtn = document.getElementById('clearChatBtn');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.quickActions = document.getElementById('quickActions');
    if (!this.messagesArea || !this.messageInput || !this.sendBtn) {
      console.error('Critical DOM elements missing:', {
        messagesArea: !!this.messagesArea,
        messageInput: !!this.messageInput,
        sendBtn: !!this.sendBtn
      });
    }
    this.loadKnowledgeBase();
    this.setupEventListeners();
    setTimeout(() => { this.showWelcomeMessage(); }, 500);
  }

  loadKnowledgeBase() {
    this.knowledgeBase = {
      faqs: [
        {
          question: "What programs does Iron Lady offer?",
          answer: "Iron Lady offers three main programs:<br><br>🎯 <strong>Leadership Essentials Program</strong> - Focusing on shameless pitching, strategic maximization, and unapologetic mindset<br><br>💰 <strong>1-crore Club</strong> - For high achievers targeting 1-crore income<br><br>👩💼 <strong>100 Board Members</strong> - To develop board-ready women leaders<br><br>All are 3-month certificate programs designed for women leaders at different career stages."
        },
        {
          question: "What is the program duration?",
          answer: "All Iron Lady programs are <strong>3-month certificate programs</strong> with weekly sessions from industry experts and business leaders. Each program is designed to provide intensive, practical leadership training that fits into your busy schedule."
        },
        {
          question: "Is the program online or offline?",
          answer: "Iron Lady offers <strong>both online and offline delivery options</strong> to suit your preferences and schedule:<br><br>💻 <strong>Online</strong>: Participate from anywhere with live interactive sessions<br>🏢 <strong>Offline</strong>: In-person sessions conducted at ITPL, Bengaluru<br><br>You can choose the format that works best for you!"
        },
        {
          question: "Are certificates provided?",
          answer: "<strong>Yes!</strong> All Iron Lady programs provide certificates from <strong>Tata Institute of Social Sciences</strong> upon completion. This prestigious certification adds significant value to your professional profile and validates your leadership development journey."
        },
        {
          question: "Who are the mentors/coaches?",
          answer: "Our programs are led by <strong>successful CEOs and Ex-CEOs</strong> who serve as program leaders and mentors. These industry veterans bring real-world leadership experience, practical insights, and proven strategies to help you excel in your leadership journey."
        },
        {
          question: "Where are offline programs held?",
          answer: "Offline programs are conducted at <strong>ITPL (International Tech Park Limited), Bengaluru</strong>. This modern, professional venue provides the perfect environment for learning and networking with fellow women leaders."
        }
      ]
    };

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
    if (this.sendBtn) {
      this.sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleSendMessage();
      });
    }
    if (this.messageInput) {
      this.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleSendMessage();
        }
      });
      this.messageInput.addEventListener('input', () => {
        this.toggleSendButton();
      });
    }
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearChat();
      });
    }
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-btn') || (e.target.parentElement && e.target.parentElement.classList.contains('quick-btn'))) {
        e.preventDefault();
        const btn = e.target.classList.contains('quick-btn') ? e.target : e.target.parentElement;
        const question = btn.getAttribute('data-question');
        if (question) this.handleQuickQuestion(question);
      }
    });
    this.toggleSendButton();
  }

  showWelcomeMessage() {
    const welcomeText = `👋 <strong>Welcome to Iron Lady Leadership Programs!</strong><br><br>
I'm here to help you learn about our transformative leadership programs designed specifically for ambitious women leaders.<br><br>
🌟 <strong>What I can help you with:</strong><br>
• Information about our 3 leadership programs<br>
• Program duration and delivery options<br>
• Certification details<br>
• Mentor information<br>
• Location and logistics<br><br>
Feel free to ask me anything or click on the quick questions below to get started!`;
    this.addMessage(welcomeText, 'bot');
  }

  async handleSendMessage() {
    if (!this.messageInput) return;
    const message = this.messageInput.value.trim();
    if (!message) return;
    this.addMessage(message, 'user');
    this.messageInput.value = '';
    this.toggleSendButton();
    this.hideQuickActions();
    this.showTypingIndicator();
    let response = this.generateResponse(message);
    if (response === null) {
      response = await this.getAIResponse(message);
    }
    this.hideTypingIndicator();
    this.addMessage(response, 'bot');
  }

  async handleQuickQuestion(question) {
    this.addMessage(question, 'user');
    this.hideQuickActions();
    this.showTypingIndicator();
    let response = this.generateResponse(question);
    if (response === null) {
      response = await this.getAIResponse(question);
    }
    this.hideTypingIndicator();
    this.addMessage(response, 'bot');
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    // Direct FAQ matching
    for (const faq of this.knowledgeBase.faqs) {
      if (this.isQuestionMatch(message, faq.question.toLowerCase())) {
        return faq.answer;
      }
    }
    // Keyword-based matching
    const matchedCategory = this.findBestMatch(message);
    if (matchedCategory) {
      const idx = Object.keys(this.keywordMap).indexOf(matchedCategory);
      return this.knowledgeBase.faqs[idx].answer;
    }
    // Fallback: return null so AI fallback triggers
    return null;
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
        if (message.includes(keyword)) score++;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = category;
      }
    }
    return highestScore > 0 ? bestMatch : null;
  }

  // == The AI Bonus Fallback ==
  async getAIResponse(userMessage) {
    // WARNING: Never expose real API keys in production!
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const url = 'https://api.openai.com/v1/chat/completions';
    this.addMessage('_Let me check that with our AI advisor..._', 'bot');
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: "system", content: "You are an assistant answering questions about Iron Lady leadership programs. If the query is not about Iron Lady, politely refuse." },
            { role: "user", content: userMessage }
          ],
          max_tokens: 200
        })
      });
      const data = await response.json();
      if (data.choices && data.choices.length) {
        return data.choices[0].message.content.trim();
      }
      return "Sorry, I couldn't find an answer to your question!";
    } catch (e) {
      return "Sorry, there was a problem accessing our AI advisor.";
    }
  }

  addMessage(text, sender) {
    if (!this.messagesArea) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'bot' ? '👑' : '👤';
    const content = document.createElement('div');
    content.className = 'message-content';
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.innerHTML = this.formatMessage(text);
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
      .replace(/🎯|💰|👩💼|💻|🏢|👑|👤|🌟|✨|⏰|🎓|📍|🔹|🚀/g, '$&amp;');
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
    if (confirm('Are you sure you want to clear the chat history?')) {
      if (this.messagesArea) {
        this.messagesArea.innerHTML = '';
        this.showQuickActions();
        setTimeout(() => { this.showWelcomeMessage(); }, 200);
      }
    }
  }
}

// Initialize the chatbot when DOM is ready
let chatbotInstance = null;
function initializeChatbot() {
  if (!chatbotInstance) {
    try {
      chatbotInstance = new IronLadyChatbot();
    } catch (error) {
      console.error('Error initializing chatbot:', error);
    }
  }
}
document.addEventListener('DOMContentLoaded', initializeChatbot);
window.addEventListener('load', initializeChatbot);
setTimeout(initializeChatbot, 1000);
