// Profile page functionality
document.addEventListener('DOMContentLoaded', function () {
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

    // Load profile photo on page load
    loadProfilePhoto();

    // Listen for storage changes to update profile photo
    window.addEventListener('storage', function (e) {
        if (e.key === 'userProfile') {
            loadProfilePhoto();
        }
    });

    // Get DOM elements
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const locationInput = document.getElementById('location');
    const titleInput = document.getElementById('title');
    const companyInput = document.getElementById('company');
    const bioInput = document.getElementById('bio');
    const saveProfileBtn = document.getElementById('save-profile');
    const changeAvatarBtn = document.getElementById('change-avatar');

    // Load current user data (from localStorage or use defaults)
    loadUserProfile();

    // Add click event to profile photo to stay on profile page (no redirect needed)
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
        // On profile page, clicking photo scrolls to top
        profilePhoto.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        // Make it visually clear it's clickable
        profilePhoto.style.cursor = 'pointer';
    }

    // Save profile changes
    saveProfileBtn.addEventListener('click', saveUserProfile);

    // Change avatar
    changeAvatarBtn.addEventListener('click', function () {
        document.getElementById('avatar-upload').click();
    });

    // Handle file upload
    document.getElementById('avatar-upload').addEventListener('change', handleFileUpload);

    // Load user profile data from localStorage or use defaults
    function loadUserProfile() {
        const savedProfile = localStorage.getItem('userProfile');
        let currentUser;

        if (savedProfile) {
            const saved = JSON.parse(savedProfile);
            // Merge saved data with defaults for missing fields
            currentUser = {
                avatar: saved.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(saved.name || 'User')}&background=random`,
                name: saved.name || "Default User",
                title: saved.title || "Explorer",
                email: saved.email || "user@example.com",
                location: saved.location || "Global",
                company: saved.company || "SkillTribe",
                bio: saved.bio || "Hi there!"
            };
        } else {
            // Default user data if no profile exists
            currentUser = {
                avatar: "https://ui-avatars.com/api/?name=Guest&background=random",
                name: "Guest User",
                title: "Professional Explorer",
                email: "guest@skilltribe.com",
                location: "Online",
                company: "SkillTribe Community",
                bio: "Welcome! Feel free to edit this profile."
            };
        }

        // Set values in form
        profileAvatar.src = currentUser.avatar;
        profileName.textContent = currentUser.name;
        profileTitle.textContent = currentUser.title || 'Welcome!';

        // Update header profile photo
        loadProfilePhoto();

        // Set form input values
        fullnameInput.value = currentUser.name;
        titleInput.value = currentUser.title;
        emailInput.value = currentUser.email;
        locationInput.value = currentUser.location;
        companyInput.value = currentUser.company;
        bioInput.value = currentUser.bio;
    }

    // Logout Functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('userProfile');
                window.location.href = 'login.html';
            }
        });
    }

    // Save user profile data to localStorage
    function saveUserProfile() {
        let avatarSrc = profileAvatar.src;
        const newName = fullnameInput.value.trim();

        // If the avatar is a default ui-avatars link, update it with the new name
        if (avatarSrc.includes('ui-avatars.com/api/')) {
            avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`;
            profileAvatar.src = avatarSrc;
        }

        const updatedUser = {
            avatar: avatarSrc,
            name: newName,
            title: titleInput.value.trim(),
            email: emailInput.value.trim(),
            location: locationInput.value.trim(),
            company: companyInput.value.trim(),
            bio: bioInput.value.trim()
        };

        // Save to localStorage
        localStorage.setItem('userProfile', JSON.stringify(updatedUser));

        // Update header profile photo on current page
        const headerProfilePhoto = document.querySelector('#profilePhoto img');
        if (headerProfilePhoto) {
            headerProfilePhoto.src = updatedUser.avatar;
        }

        // Update display elements
        profileName.textContent = updatedUser.name;
        profileTitle.textContent = updatedUser.title;

        // Trigger storage event so other tabs/pages can update
        window.dispatchEvent(new Event('storage'));

        // Show success message
        showNotification('Profile updated successfully!');
    }

    // Handle avatar file upload
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            const newAvatarSrc = e.target.result;
            profileAvatar.src = newAvatarSrc;

            // Update header profile photo on current page
            const headerProfilePhoto = document.querySelector('#profilePhoto img');
            if (headerProfilePhoto) {
                headerProfilePhoto.src = newAvatarSrc;
            }

            // Save to localStorage immediately so it updates on all pages
            const savedProfile = localStorage.getItem('userProfile');
            let currentUser;

            if (savedProfile) {
                currentUser = JSON.parse(savedProfile);
            } else {
                // Default user data if no profile exists
                currentUser = {
                    avatar: "https://ui-avatars.com/api/?name=User&background=4a6cf7&size=200&color=fff",
                    name: "John Doe",
                    title: "Full Stack Developer",
                    email: "john.doe@example.com",
                    location: "San Francisco, CA",
                    company: "Tech Innovations Inc.",
                    bio: "Passionate developer with 5+ years of experience in web and mobile application development. Skilled in JavaScript, React, Node.js, and Python."
                };
            }

            // Update avatar in user profile
            currentUser.avatar = newAvatarSrc;

            // Save updated profile to localStorage
            localStorage.setItem('userProfile', JSON.stringify(currentUser));

            // Trigger storage event so other tabs/pages can update
            window.dispatchEvent(new Event('storage'));
        };
        reader.readAsDataURL(file);
    }

    // Show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});