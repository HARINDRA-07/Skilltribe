// Mock data for contacts and messages
const contacts = [
    {
        id: 'sherpAI',
        name: 'SherpAI',
        avatar: 'https://ui-avatars.com/api/?name=SherpAI&background=4a6cf7&color=fff',
        status: 'online',
        lastMessage: 'How can I help you today?',
        lastMessageTime: '12:30 PM',
        unreadCount: 0
    },
    {
        id: 'john_doe',
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2ecc71&color=fff',
        status: 'online',
        lastMessage: 'Let\'s collaborate on the project!',
        lastMessageTime: '10:15 AM',
        unreadCount: 2
    },
    {
        id: 'jane_smith',
        name: 'Jane Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=e74c3c&color=fff',
        status: 'offline',
        lastMessage: 'I\'ll send you the design files tomorrow.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0
    },
    {
        id: 'alex_johnson',
        name: 'Alex Johnson',
        avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=f39c12&color=fff',
        status: 'online',
        lastMessage: 'The meeting is scheduled for 3 PM.',
        lastMessageTime: 'Yesterday',
        unreadCount: 1
    }
];

const messages = {
    'sherpAI': [
        {
            id: 1,
            sender: 'sherpAI',
            content: 'Hello! I\'m SherpAI, your AI assistant. How can I help you today?',
            timestamp: '12:25 PM'
        },
        {
            id: 2,
            sender: 'sherpAI',
            content: 'I\'m here to assist you with any questions or tasks. Feel free to ask me anything!',
            timestamp: '12:30 PM'
        }
    ],
    'john_doe': [
        {
            id: 1,
            sender: 'john_doe',
            content: 'Hi there! I saw your profile and I think we could work together.',
            timestamp: '10:10 AM'
        },
        {
            id: 2,
            sender: 'user',
            content: 'That sounds great! What kind of project do you have in mind?',
            timestamp: '10:12 AM'
        },
        {
            id: 3,
            sender: 'john_doe',
            content: 'Let\'s collaborate on the project!',
            timestamp: '10:15 AM'
        }
    ],
    'jane_smith': [
        {
            id: 1,
            sender: 'user',
            content: 'Hi Jane, how\'s the design coming along?',
            timestamp: '3:45 PM'
        },
        {
            id: 2,
            sender: 'jane_smith',
            content: 'It\'s going well! I\'m almost finished with the homepage.',
            timestamp: '4:00 PM'
        },
        {
            id: 3,
            sender: 'jane_smith',
            content: 'I\'ll send you the design files tomorrow.',
            timestamp: '4:05 PM'
        }
    ],
    'alex_johnson': [
        {
            id: 1,
            sender: 'alex_johnson',
            content: 'Hey, are you available for a meeting tomorrow?',
            timestamp: '2:30 PM'
        },
        {
            id: 2,
            sender: 'user',
            content: 'Yes, I\'m free in the afternoon. What time works for you?',
            timestamp: '2:45 PM'
        },
        {
            id: 3,
            sender: 'alex_johnson',
            content: 'The meeting is scheduled for 3 PM.',
            timestamp: '3:00 PM'
        }
    ]
};

// DOM Elements
const contactsList = document.getElementById('contactsList');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const chatIcon = document.getElementById('chatIcon');
const notificationDot = document.getElementById('notificationDot');
const profilePhoto = document.getElementById('profilePhoto');
const profileNotification = document.getElementById('profileNotification');
const currentChatName = document.getElementById('currentChatName');
const currentChatStatus = document.getElementById('currentChatStatus');

// Current active chat
let currentChat = 'sherpAI';
let unreadMessages = false;

// Initialize the application
function init() {
    renderContacts();
    renderMessages(currentChat);
    setupEventListeners();

    // Show notification dot if there are unread messages
    updateNotificationDot();
}

// Render contacts in the sidebar
function renderContacts() {
    contactsList.innerHTML = '';

    contacts.forEach(contact => {
        const contactElement = createContactElement(contact);
        contactsList.appendChild(contactElement);
    });
}

// Create contact element for the sidebar
function createContactElement(contact) {
    const contactElement = document.createElement('div');
    contactElement.className = `contact-item ${contact.id === currentChat ? 'active' : ''}`;
    contactElement.dataset.id = contact.id;

    contactElement.innerHTML = `
        <div class="contact-avatar">
            <img src="${contact.avatar}" alt="${contact.name}">
            <div class="contact-status-indicator ${contact.status}"></div>
        </div>
        <div class="contact-info">
            <div class="contact-name">${contact.name}</div>
            <div class="contact-last-message">${contact.lastMessage}</div>
        </div>
        <div class="contact-meta">
            <div class="contact-time">${contact.lastMessageTime}</div>
            ${contact.unreadCount > 0 ? `<div class="contact-unread">${contact.unreadCount}</div>` : ''}
        </div>
    `;

    contactElement.addEventListener('click', () => {
        setActiveContact(contact.id);
    });

    return contactElement;
}

// Set active contact and render messages
function setActiveContact(contactId) {
    currentChat = contactId;

    // Update active state in contacts list
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.id === contactId) {
            item.classList.add('active');
        }
    });

    // Update chat header
    const contact = contacts.find(c => c.id === contactId);
    currentChatName.textContent = contact.name;
    currentChatStatus.textContent = contact.status === 'online' ? 'Online' : 'Offline';
    currentChatStatus.className = `chat-contact-status ${contact.status}`;

    // Reset unread count
    contact.unreadCount = 0;
    renderContacts();
    updateNotificationDot();

    // Render messages
    renderMessages(contactId);
}

// Render messages for a specific contact
function renderMessages(contactId) {
    chatMessages.innerHTML = '';

    if (!messages[contactId]) {
        messages[contactId] = [];
    }

    messages[contactId].forEach(message => {
        const messageElement = createMessageElement(message);
        chatMessages.appendChild(messageElement);
    });

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Create message element
function createMessageElement(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender === 'user' ? 'outgoing' : 'incoming'}`;

    const contact = contacts.find(c => c.id === message.sender);
    const avatar = contact ? contact.avatar : 'https://ui-avatars.com/api/?name=User&background=random';

    let attachmentsHTML = '';
    if (message.attachments && message.attachments.length > 0) {
        attachmentsHTML = '<div class="message-attachments">';
        message.attachments.forEach(file => {
            if (file.type.startsWith('image/')) {
                attachmentsHTML += `<div class="attachment-image"><img src="${file.data}" alt="${file.name}"></div>`;
            } else {
                attachmentsHTML += `<div class="attachment-file"><span class="file-icon">📄</span> <span class="file-name">${file.name}</span></div>`;
            }
        });
        attachmentsHTML += '</div>';
    }

    messageElement.innerHTML = `
        ${message.sender !== 'user' ? `
            <div class="message-avatar">
                <img src="${avatar}" alt="${message.sender}">
            </div>
        ` : ''}
        <div class="message-content">
            <div class="message-bubble">
                ${attachmentsHTML}
                ${message.content ? `<div class="message-text">${message.content}</div>` : ''}
            </div>
            <div class="message-time">${message.timestamp}</div>
        </div>
    `;

    return messageElement;
}

// Global array to store selected files
let selectedFiles = [];

// Send a message
function sendMessage() {
    const content = messageInput.value.trim();

    if (content === '' && selectedFiles.length === 0) {
        return;
    }

    // Initialize chat if it doesn't exist
    if (!messages[currentChat]) {
        messages[currentChat] = [];
    }

    // Create new message
    const newMessage = {
        id: messages[currentChat].length + 1,
        sender: 'user',
        content: content,
        timestamp: formatTime(new Date()),
        attachments: [...selectedFiles] // Create a copy of selected files
    };

    // Add message to the list
    messages[currentChat].push(newMessage);

    // Update last message in contacts
    const contactIndex = contacts.findIndex(c => c.id === currentChat);
    contacts[contactIndex].lastMessage = selectedFiles.length > 0 ? (content ? content : 'Sent an attachment') : content;
    contacts[contactIndex].lastMessageTime = 'Just now';

    // Render messages and contacts
    renderMessages(currentChat);
    renderContacts();

    // Clear input and attachments
    messageInput.value = '';
    selectedFiles = [];
    document.getElementById('attachmentPreview').innerHTML = '';
    document.getElementById('fileInput').value = ''; // Reset file input

    // If chatting with SherpAI, generate AI response
    if (currentChat === 'sherpAI') {
        setTimeout(() => {
            // SherpAI only responds to text for now
            if (content) {
                generateSherpAIResponse(content);
            }
        }, 1000);
    } else {
        // Simulate response from other contacts
        simulateResponse(currentChat);
    }
}

// Handle file input change
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
        // Mocking file upload: Read as Data URL
        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = {
                name: file.name,
                type: file.type,
                data: e.target.result
            };
            selectedFiles.push(fileData);
            renderAttachmentPreview();
        };
        reader.readAsDataURL(file);
    });
}

// Render attachment preview in input area
function renderAttachmentPreview() {
    const previewContainer = document.getElementById('attachmentPreview');
    previewContainer.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'attachment-preview-item';

        if (file.type.startsWith('image/')) {
            item.innerHTML = `<img src="${file.data}" alt="${file.name}">`;
        } else {
            item.innerHTML = `<div class="file-icon">📄</div><span class="file-name">${file.name}</span>`;
        }

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-attachment';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            selectedFiles.splice(index, 1);
            renderAttachmentPreview();
        };
        item.appendChild(removeBtn);

        previewContainer.appendChild(item);
    });
}

// AI Configuration - Replace with your Gemini API key
const GEMINI_API_KEY = 'API key'; // Add your Gemini API key here
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Generate AI response using Gemini API
async function generateSherpAIResponse(userMessage) {
    // If no API key is set, use fallback responses
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API Key is missing. Fallback disabled by user request.');
        addResponseMessage('sherpAI', "⚠️ Error: No Gemini API Key provided. Please check the code.");
        return;
    }

    try {
        // Build conversation history for context
        // Gemini expects: { contents: [ { role: 'user'|'model', parts: [{ text: '...' }] } ] }
        const contents = [];

        if (messages.sherpAI && messages.sherpAI.length > 0) {
            // We take the last 10 messages. This INCLUDES the message the user just sent.
            const recentMessages = messages.sherpAI.slice(-10);

            // Logic to ensure strict User -> Model -> User alternation
            // We will rebuild the history to ensure valid turn-taking for Gemini

            let lastRole = null;

            recentMessages.forEach(msg => {
                const role = msg.sender === 'user' ? 'user' : 'model';

                // If it's the first message, or different from last role, add it
                if (lastRole !== role) {
                    contents.push({
                        role: role,
                        parts: [{ text: msg.content }]
                    });
                    lastRole = role;
                } else {
                    // If same role as previous, append text to previous message part
                    // Gemini handles multiple parts, or we can just append text
                    const lastContent = contents[contents.length - 1];
                    lastContent.parts[0].text += "\n" + msg.content;
                }
            });

            // Ensure the last message is from 'user' (it should be, since user just sent it)
            // If the last message in history is NOT user (unlikely if logic is correct), we might have an issue.
            if (contents.length > 0 && contents[contents.length - 1].role !== 'user') {
                // Force add the user message if for some reason it wasn't the last one processed
                contents.push({
                    role: 'user',
                    parts: [{ text: userMessage }]
                });
            }
        } else {
            // Fallback if history is empty (shouldn't happen as user just sent message)
            contents.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });
        }

        // System instruction - refined to prevent repetition
        const systemInstruction = {
            parts: [{ text: 'You are SherpAI, a friendly and helpful AI assistant for SkillTribe. Powered by Google Gemini. Your goal is to help users find collaborators and manage projects. Answer the user\'s question directly. Do NOT start your response with the user\'s name or message. Keep responses concise (1-2 sentences) and conversational.' }]
        };

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemInstruction: systemInstruction,
                contents: contents,
                generationConfig: {
                    maxOutputTokens: 200,
                    temperature: 0.7
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error Details:', errorData);
            throw new Error(`API request failed: ${response.status} ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // Gemini response structure: candidates[0].content.parts[0].text
        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0) {

            const aiResponse = data.candidates[0].content.parts[0].text.trim();
            addResponseMessage('sherpAI', aiResponse);
        } else {
            console.error('Unexpected Gemini Response:', data);
            throw new Error('Empty or unexpected response format from Gemini API');
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        // Fallback removed as per user request. Errors are reported directly.
        addResponseMessage('sherpAI', `⚠️ Error connecting to SherpAI (Gemini): ${error.message}. Please check console for details.`);
    }
}

// Fallback intelligent responses - DEPRECATED/REMOVED
function generateFallbackResponse(userMessage) {
    console.log("Fallback disabled.");
}

// Helper function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
        return 1.0;
    }

    // Simple word-based similarity check
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));

    return commonWords.length / Math.max(words1.length, words2.length);
}

// Add response message
function addResponseMessage(sender, content) {
    const newMessage = {
        id: messages[currentChat].length + 1,
        sender: sender,
        content: content,
        timestamp: formatTime(new Date())
    };

    // Add message to the list
    messages[currentChat].push(newMessage);

    // Update last message in contacts
    const contactIndex = contacts.findIndex(c => c.id === sender);
    contacts[contactIndex].lastMessage = content;
    contacts[contactIndex].lastMessageTime = 'Just now';

    // Render messages and contacts
    renderMessages(currentChat);
    renderContacts();
}

// Simulate response from contacts
// Simulate response from contacts
function simulateResponse(contactId) {
    // Only simulate responses occasionally
    if (Math.random() > 0.7) {
        return;
    }

    setTimeout(() => {
        const responses = [
            'That sounds great!',
            'I\'ll get back to you on that.',
            'Let\'s discuss this further in our next meeting.',
            'Thanks for the update!',
            'I\'ll send you the details soon.'
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // If user is not in this chat, increment unread count
        if (currentChat !== contactId) {
            const contactIndex = contacts.findIndex(c => c.id === contactId);
            contacts[contactIndex].unreadCount += 1;
            renderContacts();
            updateNotificationDot();

            // Show notification
            showNotification(`🔔 ${contacts[contactIndex].name} sent a message — check it out!`);
        } else {
            addResponseMessage(contactId, randomResponse);
        }
    }, 5000 + Math.random() * 10000); // Random delay between 5-15 seconds
}

// Format time
function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Update notification dot
function updateNotificationDot() {
    const hasUnread = contacts.some(contact => contact.unreadCount > 0);

    if (hasUnread) {
        notificationDot.classList.add('active');
        unreadMessages = true;
    } else {
        notificationDot.classList.remove('active');
        unreadMessages = false;
    }
}

// Show notification under profile photo
function showNotification(message) {
    if (!profileNotification) return;

    const notificationMessage = profileNotification.querySelector('.notification-message');
    if (notificationMessage) {
        notificationMessage.textContent = message;
        profileNotification.classList.add('active');

        // Setup close button
        const closeButton = profileNotification.querySelector('.notification-close');
        if (closeButton) {
            // Remove any existing event listeners by cloning the button
            const newCloseButton = closeButton.cloneNode(true);
            closeButton.parentNode.replaceChild(newCloseButton, closeButton);

            // Add new event listener
            newCloseButton.addEventListener('click', function (e) {
                e.stopPropagation();
                profileNotification.classList.remove('active');
            });
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            profileNotification.classList.remove('active');
        }, 5000);
    }
}

// Simulate contact reconnecting
function simulateReconnect() {
    setInterval(() => {
        if (Math.random() > 0.9) { // 10% chance every interval
            const offlineContacts = contacts.filter(contact => contact.status === 'offline');

            if (offlineContacts.length > 0) {
                const randomContact = offlineContacts[Math.floor(Math.random() * offlineContacts.length)];
                randomContact.status = 'online';

                renderContacts();

                if (currentChat === randomContact.id) {
                    currentChatStatus.textContent = 'Online';
                    currentChatStatus.className = 'chat-contact-status online';
                }

                showNotification(`🔔 ${randomContact.name} reconnected — say hi!`);
            }
        }
    }, 30000); // Check every 30 seconds
}

// Setup event listeners
function setupEventListeners() {
    // Send message on button click
    sendMessageBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // File input listener
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }

    // Add click event to profile photo to redirect to profile page
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function () {
            window.location.href = 'profile.html';
        });
        // Make it visually clear it's clickable
        profilePhoto.style.cursor = 'pointer';
    }

    // Check URL parameters for contact
    const urlParams = new URLSearchParams(window.location.search);
    const contactParam = urlParams.get('contact');

    if (contactParam && contacts.some(c => c.id === contactParam)) {
        setActiveContact(contactParam);
    }
}

// Function to load profile photo from localStorage
function loadProfilePhoto() {
    const profilePhotoImg = document.querySelector('#profilePhoto img');
    if (profilePhotoImg) {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const userProfile = JSON.parse(savedProfile);
                if (userProfile.avatar) {
                    profilePhotoImg.src = userProfile.avatar;
                }
            }
        } catch (error) {
            console.error('Error loading profile photo:', error);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Load profile photo from localStorage
    loadProfilePhoto();

    // Listen for storage changes to update profile photo
    window.addEventListener('storage', function (e) {
        if (e.key === 'userProfile') {
            loadProfilePhoto();
        }
    });

    init();
    simulateReconnect();

    // Simulate initial notification
    setTimeout(() => {
        showNotification('🔔 Welcome to SkillTribe Messages!');
    }, 2000);
});

// WebSocket simulation for real-time updates
function simulateWebSocket() {
    // In a real implementation, this would be a WebSocket connection
    // const socket = new WebSocket('wss://api.example.com/ws');
    // 
    // socket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     
    //     if (data.type === 'message') {
    //         // Handle new message
    //         if (currentChat !== data.sender) {
    //             const contactIndex = contacts.findIndex(c => c.id === data.sender);
    //             contacts[contactIndex].unreadCount += 1;
    //             renderContacts();
    //             updateNotificationDot();
    //             showNotification(`🔔 ${contacts[contactIndex].name} sent a message — check it out!`);
    //         } else {
    //             addResponseMessage(data.sender, data.content);
    //         }
    //     } else if (data.type === 'status') {
    //         // Handle status change
    //         const contactIndex = contacts.findIndex(c => c.id === data.userId);
    //         contacts[contactIndex].status = data.status;
    //         renderContacts();
    //         renderPopupContacts();
    //         
    //         if (data.status === 'online') {
    //             showNotification(`🔔 ${contacts[contactIndex].name} reconnected — say hi!`);
    //         }
    //     }
    // };

    // Instead, we'll simulate random events
    setInterval(() => {
        // Simulate random message
        if (Math.random() > 0.8) {
            const randomContactIndex = Math.floor(Math.random() * contacts.length);
            const randomContact = contacts[randomContactIndex];

            if (randomContact.id !== 'sherpAI') { // Skip SherpAI for random messages
                const responses = [
                    'Hey, how\'s it going?',
                    'Do you have time to chat?',
                    'I have a new project idea!',
                    'Have you seen the latest updates?',
                    'Let\'s catch up soon!'
                ];

                const randomResponse = responses[Math.floor(Math.random() * responses.length)];

                if (currentChat !== randomContact.id) {
                    randomContact.unreadCount += 1;
                    randomContact.lastMessage = randomResponse;
                    randomContact.lastMessageTime = 'Just now';
                    renderContacts();
                    updateNotificationDot();
                    showNotification(`🔔 ${randomContact.name} sent a message — check it out!`);
                } else {
                    addResponseMessage(randomContact.id, randomResponse);
                }
            }
        }
    }, 60000); // Check every minute
}

// Start WebSocket simulation
simulateWebSocket();
