// Collaborate Page JavaScript

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

document.addEventListener('DOMContentLoaded', function () {
    // Load profile photo from localStorage
    loadProfilePhoto();

    // Listen for storage changes to update profile photo
    window.addEventListener('storage', function (e) {
        if (e.key === 'userProfile') {
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

    // Load data from localStorage
    loadCollaborateData();

    // Initialize filter functionality
    initFilters();

    // Initialize project cards interaction
    initProjectCards();

    // Initialize pagination
    initPagination();

    // Initialize carousel
    initCarousel();
});

// Load collaborate data from localStorage
function loadCollaborateData() {
    // Load projects data
    const savedProjects = localStorage.getItem('collaborateProjects');
    if (savedProjects) {
        const projectsData = JSON.parse(savedProjects);
        renderProjects(projectsData);
    }

    // Load people data
    const savedPeople = localStorage.getItem('collaboratePeople');
    if (savedPeople) {
        const peopleData = JSON.parse(savedPeople);
        renderPeople(peopleData);
    } else {
        // If no saved data, save current data
        saveCurrentData();
    }
}

// Save current data to localStorage
function saveCurrentData() {
    // Save projects
    const projectCards = document.querySelectorAll('.project-card');
    const projectsData = Array.from(projectCards).map(card => {
        return {
            title: card.querySelector('h3').textContent,
            description: card.querySelector('p').textContent,
            skills: Array.from(card.querySelectorAll('.skill-tag')).map(skill => skill.textContent),
            author: card.querySelector('.project-author').textContent,
            date: card.querySelector('.project-date').textContent,
            // Handle optional new fields with fallbacks
            teamLead: card.querySelector('.team-lead') ? card.querySelector('.team-lead').textContent : 'Unknown',
            lookingFor: card.querySelector('.looking-for') ? card.querySelector('.looking-for').textContent : 'Collaborator'
        };
    });
    localStorage.setItem('collaborateProjects', JSON.stringify(projectsData));

    // Save people
    const peopleCards = document.querySelectorAll('.person-card');
    const peopleData = Array.from(peopleCards).map(card => {
        return {
            name: card.querySelector('h3').textContent,
            field: card.querySelector('.person-field').textContent,
            skills: Array.from(card.querySelectorAll('.skill-tag')).map(skill => skill.textContent),
            photo: card.querySelector('.person-photo img').src,
            banner: card.querySelector('.person-banner').style.backgroundImage.replace('url("', '').replace('")', '')
        };
    });
    localStorage.setItem('collaboratePeople', JSON.stringify(peopleData));
}

// Render projects from data
function renderProjects(projectsData) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Clear existing projects
    projectsGrid.innerHTML = '';

    // Create and append project cards
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        // Create skills HTML
        const skillsHTML = project.skills.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('');

        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-details">
                <div class="detail">
                    <span class="label">Team Lead:</span>
                    <span class="value team-lead">${project.teamLead || 'Unknown'}</span>
                </div>
                <div class="detail">
                    <span class="label">Looking For:</span>
                    <span class="value looking-for">${project.lookingFor || 'Collaborator'}</span>
                </div>
                <div class="detail">
                    <span class="label">Duration:</span>
                    <span class="value">Flexible</span>
                </div>
                <div class="detail">
                    <span class="label">Location:</span>
                    <span class="value">Remote</span>
                </div>
            </div>
            <div class="project-skills">
                ${skillsHTML}
            </div>
            <div class="project-details-footer" style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.85rem; color: #94a3b8;">
                <span class="project-author">${project.author}</span>
                <span class="project-date">${project.date}</span>
            </div>
            <div class="project-footer">
                <button class="apply-button">Get Involved</button>
                <button class="save-button">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });

    // Re-initialize project cards interaction
    initProjectCards();
}

// Render people from data
function renderPeople(peopleData) {
    const carouselTrack = document.querySelector('.carousel-track');
    if (!carouselTrack) return;

    // Clear existing people cards
    carouselTrack.innerHTML = '';

    // Create and append person cards
    peopleData.forEach(person => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';

        // Create skills HTML
        const skillsHTML = person.skills.map(skill =>
            `<span class="skill-tag">${skill}</span>`
        ).join('');

        personCard.innerHTML = `
            <div class="person-banner" style="background-image: url('${person.banner}')"></div>
            <div class="person-photo">
                <img src="${person.photo}" alt="${person.name}">
            </div>
            <div class="person-info">
                <h3>${person.name}</h3>
                <p class="person-field">${person.field}</p>
                <div class="person-skills">
                    ${skillsHTML}
                </div>
            </div>
        `;

        carouselTrack.appendChild(personCard);
    });

    // Re-initialize carousel
    initCarousel();
}

// People Carousel Functionality
// Global cleanup variable to prevent double-initialization
let carouselCleanup = null;

function initCarousel() {
    // Cleanup previous instance if it exists
    if (carouselCleanup) {
        carouselCleanup();
        carouselCleanup = null;
    }

    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const cards = document.querySelectorAll('.person-card');

    if (!track || !prevButton || !nextButton || cards.length === 0) return;

    // Get the current gap between cards from CSS
    const getGap = () => {
        const styles = window.getComputedStyle(track);
        const gapValue = styles.gap || styles.columnGap || '0px';
        return parseFloat(gapValue) || 0;
    };

    let gap = getGap();
    let cardWidth = cards[0].getBoundingClientRect().width + gap;
    let visibleCount = Math.max(1, Math.floor(track.parentElement.getBoundingClientRect().width / cardWidth));
    let currentIndex = 0;
    let maxIndex = Math.max(0, cards.length - visibleCount);
    let autoplayInterval;

    function recalc() {
        gap = getGap();
        cardWidth = cards[0].getBoundingClientRect().width + gap;
        visibleCount = Math.max(1, Math.floor(track.parentElement.getBoundingClientRect().width / cardWidth));
        maxIndex = Math.max(0, cards.length - visibleCount);
        moveToSlide(currentIndex);
    }

    function moveToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        updateButtonStates();
    }

    function updateButtonStates() {
        const atStart = currentIndex === 0;
        const atEnd = currentIndex >= maxIndex;
        prevButton.disabled = atStart;
        nextButton.disabled = atEnd;
        prevButton.style.opacity = atStart ? '0.5' : '1';
        nextButton.style.opacity = atEnd ? '0.5' : '1';
        prevButton.setAttribute('aria-disabled', atStart ? 'true' : 'false');
        nextButton.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
    }

    // Event Handlers
    const handlePrevClick = () => moveToSlide(currentIndex - 1);
    const handleNextClick = () => moveToSlide(currentIndex + 1);
    const handleResize = recalc;

    // Button Listeners
    prevButton.addEventListener('click', handlePrevClick);
    nextButton.addEventListener('click', handleNextClick);

    // Ensure the buttons remain clickable above the track
    prevButton.style.pointerEvents = 'auto';
    nextButton.style.pointerEvents = 'auto';

    // Resize Listener
    window.addEventListener('resize', handleResize);

    // Initialize position and states
    moveToSlide(0);

    // Touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    };

    track.addEventListener('touchstart', handleTouchStart, { passive: true });
    track.addEventListener('touchend', handleTouchEnd, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // Minimum swipe distance
        if (touchStartX - touchEndX > swipeThreshold) {
            moveToSlide(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            moveToSlide(currentIndex - 1);
        }
    }

    // Auto-play functionality
    function startAutoplay() {
        stopAutoplay(); // Clear existing to be safe
        autoplayInterval = setInterval(() => {
            if (currentIndex < maxIndex) {
                moveToSlide(currentIndex + 1);
            } else {
                moveToSlide(0);
            }
        }, 5000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    startAutoplay();

    // Pause autoplay handlers
    const handleMouseEnter = stopAutoplay;
    const handleMouseLeave = startAutoplay;

    track.parentElement.addEventListener('mouseenter', handleMouseEnter);
    track.parentElement.addEventListener('mouseleave', handleMouseLeave);
    track.parentElement.addEventListener('touchstart', handleMouseEnter, { passive: true });
    track.parentElement.addEventListener('touchend', handleMouseLeave, { passive: true });

    // Assign cleanup function for the next initialization
    carouselCleanup = () => {
        prevButton.removeEventListener('click', handlePrevClick);
        nextButton.removeEventListener('click', handleNextClick);
        window.removeEventListener('resize', handleResize);
        track.removeEventListener('touchstart', handleTouchStart);
        track.removeEventListener('touchend', handleTouchEnd);
        track.parentElement.removeEventListener('mouseenter', handleMouseEnter);
        track.parentElement.removeEventListener('mouseleave', handleMouseLeave);
        track.parentElement.removeEventListener('touchstart', handleMouseEnter);
        track.parentElement.removeEventListener('touchend', handleMouseLeave);
        stopAutoplay();
    };
}

function initFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchInput = document.querySelector('.search-input');

    // Load saved filter values
    loadFilterValues();

    // Handle filter changes
    filterSelects.forEach(select => {
        select.addEventListener('change', function () {
            applyFilters();
            saveFilterValues();
        });
    });

    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            applyFilters();
            saveFilterValues();
        });
    }
}

// Save filter values to localStorage
function saveFilterValues() {
    const filterSelects = document.querySelectorAll('.filter-select');
    const searchInput = document.querySelector('.search-input');

    const filterValues = {
        selects: Array.from(filterSelects).map(select => ({
            id: select.id,
            value: select.value
        })),
        search: searchInput ? searchInput.value : ''
    };

    localStorage.setItem('collaborateFilters', JSON.stringify(filterValues));
}

// Load filter values from localStorage
function loadFilterValues() {
    const savedFilters = localStorage.getItem('collaborateFilters');
    if (!savedFilters) return;

    const filterValues = JSON.parse(savedFilters);

    // Set select values
    filterValues.selects.forEach(filter => {
        const select = document.getElementById(filter.id);
        if (select) select.value = filter.value;
    });

    // Set search input
    const searchInput = document.querySelector('.search-input');
    if (searchInput && filterValues.search) {
        searchInput.value = filterValues.search;
    }

    // Apply filters
    applyFilters();
}

// Apply filters to projects
function applyFilters() {
    const searchInput = document.querySelector('.search-input');
    const filterSelects = document.querySelectorAll('.filter-select');
    const projectCards = document.querySelectorAll('.project-card');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const filters = {};

    // Get filter values
    filterSelects.forEach(select => {
        if (select.value !== 'all') {
            filters[select.id] = select.value.toLowerCase();
        }
    });

    // Filter projects
    projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const skills = Array.from(card.querySelectorAll('.skill')).map(skill => skill.textContent.toLowerCase());

        // Check if project matches search term
        const matchesSearch = searchTerm === '' ||
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            skills.some(skill => skill.includes(searchTerm));

        // Check if project matches all filters
        let matchesFilters = true;
        if (filters.skillFilter) {
            matchesFilters = skills.some(skill => skill.includes(filters.skillFilter));
        }

        // Show/hide project based on filters
        card.style.display = matchesSearch && matchesFilters ? 'block' : 'none';
    });

    // Save current state
    saveCurrentData();
}

function initProjectCards() {
    // Add event listeners to all apply buttons
    const applyButtons = document.querySelectorAll('.apply-button');
    applyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const projectTitle = this.closest('.project-card').querySelector('h3').textContent;
            alert(`You've applied to collaborate on: ${projectTitle}`);
            // Save changes to localStorage
            saveCurrentData();
        });
    });

    // Add event listeners to all save buttons
    const saveButtons = document.querySelectorAll('.save-button');
    saveButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('saved');
            const isSaved = this.classList.contains('saved');

            // Update icon
            if (isSaved) {
                this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
                this.style.color = '#4a6cf7';
            } else {
                this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>';
                this.style.color = '';
            }
            // Save changes to localStorage
            saveCurrentData();
        });
    });

    // Add click event to toggle expanded state
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Only toggle if not clicking a button
            if (!e.target.closest('button')) {
                this.classList.toggle('expanded');
                // Save changes to localStorage
                saveCurrentData();
            }
        });
    });
}

function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-button');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // In a real app, this would load the corresponding page of projects
            // For demo purposes, we'll just scroll to top
            window.scrollTo({
                top: document.querySelector('.collaborate-content').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
}