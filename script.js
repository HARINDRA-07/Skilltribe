// Function to load and update profile photo from localStorage
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

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load profile photo from localStorage
    loadProfilePhoto();

    // Listen for storage changes to update profile photo when changed on other pages/tabs
    window.addEventListener('storage', function (e) {
        if (e.key === 'userProfile') {
            loadProfilePhoto();
        }
    });

    // Also listen for custom storage event (for same-tab updates)
    window.addEventListener('storage', function (e) {
        if (e.key === 'userProfile' || e.type === 'storage') {
            loadProfilePhoto();
        }
    });

    // Add click event to profile photo to redirect to profile page
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        profilePhoto.addEventListener('click', function () {
            window.location.href = 'profile.html';
        });
        // Make it visually clear it's clickable
        profilePhoto.style.cursor = 'pointer';
    }

    // Initialize chat features
    initChatFeatures();

    // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('nav ul');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));

            // Prevent scrolling when menu is open
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') &&
            !e.target.closest('nav') &&
            !e.target.closest('.mobile-nav-toggle')) {
            navMenu.classList.remove('active');
            mobileNavToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // SPA Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const profileIcon = document.getElementById('profile-icon');
    const pages = document.querySelectorAll('.page-content');

    // Function to show a specific page
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show the selected page
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });
    }

    // Add click event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            window.scrollTo(0, 0);
        });
    });

    // Profile icon click event
    if (profileIcon) {
        profileIcon.addEventListener('click', function () {
            showPage('profile');
            window.scrollTo(0, 0);
        });
    }

    // Handle hash navigation
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            showPage(hash);
        }
    }

    // Initial load
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    // Update profile icon image
    function updateProfileIcon() {
        const headerProfileImg = document.getElementById('header-profile-img');
        if (headerProfileImg) {
            try {
                const currentUser = SkillTribeDB.getCurrentUser();
                if (currentUser && currentUser.avatar) {
                    headerProfileImg.src = currentUser.avatar;
                }
            } catch (error) {
                console.error('Error updating profile icon:', error);
            }
        }
    }

    // Update profile icon when page loads
    if (typeof SkillTribeDB !== 'undefined') {
        updateProfileIcon();
    }

    // Smooth scrolling for navigation links
    const scrollLinks = document.querySelectorAll('nav a:not(.nav-link)');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');

                if (mobileNavToggle) {
                    const spans = mobileNavToggle.querySelectorAll('span');
                    spans.forEach(span => span.classList.remove('active'));
                }
            }

            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                // Smooth scroll to target
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // CTA Button actions
    const ctaButtons = document.querySelectorAll('.cta-button');

    ctaButtons.forEach(button => {
        button.addEventListener('click', function () {
            alert('Welcome to SkillTribe! Sign up now to join our community of collaborators.');
        });
    });

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card, .audience-card');

    // Simple function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Add animation class when scrolled into view
    function animateOnScroll() {
        featureCards.forEach(card => {
            if (isInViewport(card)) {
                card.classList.add('animate');
            }
        });
    }

    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Check on initial load
    animateOnScroll();

    // Chat Features Implementation
    function initChatFeatures() {
        // DOM Elements
        const chatIcon = document.getElementById('chatIcon');
        const notificationDot = document.getElementById('notificationDot');
        const profilePhoto = document.getElementById('profilePhoto');
        const profileNotification = document.getElementById('profileNotification');

        // Add click event to chat icon to redirect to messages page
        if (chatIcon) {
            chatIcon.addEventListener('click', function () {
                window.location.href = 'messages.html';
            });
        }

        // Mock contacts data for notifications
        const contacts = [
            {
                id: 'sherpAI',
                name: 'SherpAI',
                avatar: 'https://ui-avatars.com/api/?name=SherpAI&background=4a6cf7&color=fff',
                status: 'online'
            },
            {
                id: 'john_doe',
                name: 'John Doe',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=2ecc71&color=fff',
                status: 'online'
            },
            {
                id: 'jane_smith',
                name: 'Jane Smith',
                avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=e74c3c&color=fff',
                status: 'offline'
            },
            {
                id: 'alex_johnson',
                name: 'Alex Johnson',
                avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=f39c12&color=fff',
                status: 'online'
            }
        ];

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

        // Toggle notification dot
        function toggleNotificationDot(show) {
            if (!notificationDot) return;

            if (show) {
                notificationDot.classList.add('active');
            } else {
                notificationDot.classList.remove('active');
            }
        }

        // Setup event listeners

        // Simulate notifications
        setTimeout(() => {
            toggleNotificationDot(true);
            showNotification('🔔 John Doe reconnected — say hi!');
        }, 5000);

        // Simulate periodic notifications
        setInterval(() => {
            if (Math.random() > 0.7) {
                const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
                toggleNotificationDot(true);
                showNotification(`🔔 ${randomContact.name} sent a message — check it out!`);
            }
        }, 30000);
    }
    // --- New Animation & Interaction Logic ---

    // 1. Scroll Animations (Reveal on Scroll)
    const revealElements = document.querySelectorAll('.hero .container, .problem, .solution, .feature-card, .differentiator, .audience-card, .contact .container');

    // Add reveal class to these elements initially
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Custom Cursor Effect
    // Create cursor elements
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);

    // Track mouse position
    window.addEventListener('mousemove', function (e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows cursor exactly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline tracks with a bit of animation (handled by CSS transition or simple JS delay)
        // Using direct assignment here, CSS transition handles the smoothing
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;

        // Check for hover targets to animate cursor
        // We use document.elementFromPoint or just rely on the event target from mousemove 
        // Bubbling works fine here
        const target = e.target;
        const isClickable = target.matches('a, button, .clickable, input, textarea, select, .feature-card, .audience-card') ||
            target.closest('a, button, .clickable, .feature-card, .audience-card');

        if (isClickable) {
            cursorOutline.classList.add('hovered');
        } else {
            cursorOutline.classList.remove('hovered');
        }
    });

    // 3. Hero Parallax Effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;

            heroSection.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
        });

        // Reset on leave
        heroSection.addEventListener('mouseleave', () => {
            heroSection.style.backgroundPosition = 'center';
        });
    }

    // 4. 3D Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.feature-card, .audience-card, .differentiator');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on mouse position within card
            // Center of card is 0,0
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            // Remove the transform inline style so CSS hover effects (translateY) can work if needed, 
            // but here we are resetting to 0. 
            // Note: Our CSS has a hover effect: `transform: translateY(-5px);`
            // We should respect that if possible, but 3D tilt overrides it while moving.
            // On mouseleave, we want it to go back to normal.
            // Timeout to clear inline transform to let CSS take over if hovered? 
            // Actually, mouseleave means we are NOT hovering, so resetting to identity is correct.
            card.style.transform = '';
        });
    });

});