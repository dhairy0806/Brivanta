class BrivantaChatbot {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        this.clearBtn = document.querySelector('.feature-btn:has(.fa-trash)');
        this.newChatBtn = document.querySelector('.feature-btn:has(.fa-plus)');
        
        this.init();
    }

    init() {
        // Event listeners
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.ctrlKey && e.key === 'Enter') this.sendMessage();
        });
        
        this.clearBtn.addEventListener('click', () => this.clearChat());
        this.newChatBtn.addEventListener('click', () => this.newChat());
        
        // Focus input
        this.messageInput.focus();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show loading
        this.showLoading();

        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            this.hideLoading();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideLoading();
            this.addMessage("Sorry, I encountered an error. Please try again!", 'bot');
            console.error('Error:', error);
        }
    }

    async getAIResponse(message) {
        // Using xAI Grok API (replace with your API key)
        const API_KEY = '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'; // Get from https://openrouter.ai/api/v1/chat/completions/
        
        const response = await fetch('openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                 'HTTP-Referer': 'https://dhairy0806.github.io',
    'X-Title': 'Brivanta'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are Brivanta, a helpful AI assistant created by xAI. Be friendly, helpful, and provide detailed, accurate responses. You can help with coding, writing, math, analysis, and more.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 2000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = sender === 'bot' 
            ? '<div class="avatar bot-avatar"><i class="fas fa-robot"></i></div>'
            : '<div class="avatar user-avatar"><i class="fas fa-user"></i></div>';

        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${this.formatMessage(content)}</p>
            </div>
        `;

        this.chatContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        // Basic markdown support
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showLoading() {
        this.loadingSpinner.style.display = 'flex';
    }

    hideLoading() {
        this.loadingSpinner.style.display = 'none';
    }

    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    clearChat() {
        if (confirm('Clear all messages?')) {
            this.chatContainer.innerHTML = `
                <div class="message bot-message">
                    <div class="avatar bot-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p><strong>Brivanta:</strong> Chat cleared! How can I help you today?</p>
                    </div>
                </div>
            `;
            this.scrollToBottom();
        }
    }

    newChat() {
        if (confirm('Start a new conversation?')) {
            this.clearChat();
        }
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new BrivantaChatbot();

});




