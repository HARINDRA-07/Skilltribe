const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const googleBtns = document.querySelectorAll('.google-btn');

// Toggle panel animation
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Handle form submission
const signUpForm = document.getElementById('signupForm');
const signInForm = document.getElementById('signinForm');

// Helper to get all registered users
const getRegisteredUsers = () => {
    const users = localStorage.getItem('skilltribe_users');
    return users ? JSON.parse(users) : [];
};

// Helper to save a new user
const saveUser = (user) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('skilltribe_users', JSON.stringify(users));
};

// Helper to extract name from email
const getNameFromEmail = (email) => {
    return email.split('@')[0];
};

// Signup Handler
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = signUpForm.querySelector('button');
    const inputs = signUpForm.querySelectorAll('input');
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const password = inputs[2].value.trim();

    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    const originalText = btn.innerText;
    btn.innerText = 'Creating Account...';
    btn.disabled = true;

    // Simulate delay
    setTimeout(() => {
        // Save to "database" (localStorage)
        saveUser({ name, email, password });

        // Save current session
        localStorage.setItem('userProfile', JSON.stringify({
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
        }));

        btn.innerText = originalText;
        btn.disabled = false;

        alert(`Registration successful! Welcome, ${name}.`);
        window.location.href = 'index.html';
    }, 800);
});

// Login Handler
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = signInForm.querySelector('button');
    const inputs = signInForm.querySelectorAll('input');
    const email = inputs[0].value.trim();
    const password = inputs[1].value.trim();

    if (!email || !password) {
        alert('Please fill in both email and password');
        return;
    }

    const originalText = btn.innerText;
    btn.innerText = 'Signing In...';
    btn.disabled = true;

    setTimeout(() => {
        const users = getRegisteredUsers();
        const existingUser = users.find(u => u.email === email && u.password === password);

        let profileName;
        if (existingUser) {
            profileName = existingUser.name;
        } else {
            // Fallback: use part before @ in email as name
            profileName = getNameFromEmail(email);
        }

        // Save session
        localStorage.setItem('userProfile', JSON.stringify({
            name: profileName,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName)}&background=random`
        }));

        window.location.href = 'index.html';
    }, 800);
});

// Google Button (Disconnected)
googleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Google Sign In is currently disabled for this demo.');
    });
});

// Custom Cursor Logic
document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;

        // Check for hover targets
        const target = e.target;
        const isClickable = target.matches('a, button, input, .social') ||
            target.closest('a, button, input, .social');

        if (isClickable) {
            cursorOutline.classList.add('hovered');
        } else {
            cursorOutline.classList.remove('hovered');
        }
    });
});
