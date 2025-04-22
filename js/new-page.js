// Add this at the beginning of the file
document.addEventListener('DOMContentLoaded', () => {
    // Play startup chime
    const startupChime = document.getElementById('startup-chime');
    if (startupChime) {
        startupChime.play().catch(error => {
            console.log('Autoplay prevented:', error);
        });
    }
    
    // Start the staggered loading after a short delay
    setTimeout(startStaggeredLoading, 500);

    // CRT Effect Toggle
    const crtToggle = document.getElementById('crt-toggle');
    const crtOverlay = document.querySelector('.crt-overlay');
    
    // Load saved preference
    const crtEnabled = localStorage.getItem('crtEnabled');
    if (crtEnabled !== null) {
        crtToggle.checked = crtEnabled === 'true';
        crtOverlay.style.display = crtEnabled === 'true' ? 'block' : 'none';
    }

    // Toggle CRT effect
    crtToggle.addEventListener('change', () => {
        const isEnabled = crtToggle.checked;
        crtOverlay.style.display = isEnabled ? 'block' : 'none';
        localStorage.setItem('crtEnabled', isEnabled);
        playSound('click-sound');
    });
});

function startStaggeredLoading() {
    const elements = [
        ...document.querySelectorAll('.sidebar .icon'),
        document.querySelector('.trashcan-container'),
        document.querySelector('.taskbar'),
        document.querySelector('.start-button'),
        document.querySelector('.clock')
    ];

    // Add fade-in-element class to all elements
    elements.forEach(el => {
        if (el) el.classList.add('fade-in-element');
    });

    // Calculate total animation time
    const delayBetweenElements = 200; // 200ms between each element
    const totalElements = elements.length;
    const totalAnimationTime = totalElements * delayBetweenElements;

    // Stagger the animations
    elements.forEach((el, index) => {
        if (el) {
            setTimeout(() => {
                el.classList.add('show');
            }, index * delayBetweenElements);
        }
    });

    // Show instructions window after all elements have loaded
    setTimeout(() => {
        openWindow('instructions');
    }, totalAnimationTime + 800); // Increased buffer to ensure all animations complete
}

// Add these functions for the portfolio glow effect
function startPortfolioGlow() {
    const portfolioIcon = document.querySelector('.sidebar .icon:first-child');
    portfolioIcon.classList.add('glow');
}

function stopPortfolioGlow() {
    const portfolioIcon = document.querySelector('.sidebar .icon:first-child');
    portfolioIcon.classList.remove('glow');
}

// Window management
let openWindows = [];

function setLoadingState(duration = 500) {
    document.body.classList.add('loading-state');
    setTimeout(() => {
        document.body.classList.remove('loading-state');
    }, duration);
}

function openWindow(windowId) {
    setLoadingState();
    console.log(`Attempting to open window: ${windowId}`);
    const window = document.getElementById(`${windowId}-window`);
    
    if (!window) {
        console.error(`Window with ID ${windowId}-window not found`);
        return;
    }

    // Stop the portfolio glow effect when any window is opened
    stopPortfolioGlow();
    
    // Play click sound when opening window, except for instructions and mobile warning
    if (windowId !== 'instructions' && windowId !== 'mobile-warning') {
        playSound('click-sound');
    }
    
    // Make sure the window is visible and on top
    window.style.display = 'block';
    window.style.opacity = '1';
    window.style.visibility = 'visible';
    
    // Add animation class
    window.classList.add('window-opening');
    
    // Remove animation class after it completes
    setTimeout(() => {
        window.classList.remove('window-opening');
    }, 250);
    
    // Add to open windows array if not already there
    if (!openWindows.includes(windowId)) {
        openWindows.push(windowId);
    }
    
    // Update z-index to bring window to front
    updateWindowZIndex();
    console.log(`Window ${windowId} opened successfully`);
}

function closeWindow(windowId) {
    setLoadingState(300);
    console.log(`Attempting to close window: ${windowId}`);
    const window = document.getElementById(`${windowId}-window`);
    
    if (!window) {
        console.error(`Window with ID ${windowId}-window not found`);
        return;
    }
    
    // Play close sound when closing window, except for mobile warning
    if (windowId !== 'mobile-warning') {
        playSound('close-sound');
    }
    
    // Add closing animation class
    window.classList.add('window-closing');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
        window.classList.remove('window-closing');
        // Hide the window
        window.style.display = 'none';
        window.style.opacity = '0';
        window.style.visibility = 'hidden';
        
        // Remove from open windows array
        openWindows = openWindows.filter(id => id !== windowId);
        
        // Update z-index of remaining windows
        updateWindowZIndex();

        // Start portfolio glow when instructions window is closed
        if (windowId === 'instructions') {
            startPortfolioGlow();
        }
    }, 250);
    
    console.log(`Window ${windowId} closed successfully`);
}

function updateWindowZIndex() {
    openWindows.forEach((windowId, index) => {
        const window = document.getElementById(`${windowId}-window`);
        if (window) {
            window.style.zIndex = 1000 + index;
        }
    });
}

// Image viewer
function openImageWindow(imageId) {
    console.log(`Attempting to open image: ${imageId}`);
    const imageViewer = document.getElementById('image-viewer-window');
    const displayedImage = document.getElementById('displayed-image');
    const imageTitle = document.getElementById('image-viewer-title');
    
    // Set image source based on imageId
    displayedImage.src = `img/${imageId}.png`;
    displayedImage.onerror = function() {
        // Try jpg if png fails
        displayedImage.src = `img/${imageId}.jpg`;
    };
    
    // Update the window title
    imageTitle.textContent = imageId.replace(/-/g, ' ').toUpperCase();
    
    // Open the window
    openWindow('image-viewer');
}

// Error window
function openErrorWindow(errorType) {
    // Play error sound
    playSound('error-sound');
    
    // Close all open windows first
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(window => {
        window.style.display = 'none';
        window.style.opacity = '0';
        window.style.visibility = 'hidden';
    });
    
    // Clear the openWindows array
    openWindows = [];
    
    const errorWindow = document.getElementById('error-window');
    const errorMessage = document.getElementById('error-message');
    
    switch(errorType) {
        case 'image.jpg':
            errorMessage.textContent = 'This file is corrupted and cannot be opened.';
            break;
        case 'Old Designs':
            errorMessage.textContent = 'Access denied. These files are permanently deleted.';
            break;
        case 'Computervirus':
            errorMessage.textContent = 'WARNING: This file contains a virus! Opening it may harm your computer.';
            break;
        default:
            errorMessage.textContent = 'There was an unexpected error.';
    }
    
    openWindow('error');
    
    // Reset animation by removing and re-adding the active class
    errorWindow.classList.remove('active');
    void errorWindow.offsetWidth; // Trigger reflow to restart animation
    errorWindow.classList.add('active');
}

// Start menu
function toggleStartMenu() {
    playSound('click-sound');
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to open window and close start menu
function openWindowAndCloseMenu(windowId) {
    playSound('click-sound');
    openWindow(windowId);
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = 'none';
}

// Add click event listener to close start menu when clicking outside
document.addEventListener('click', (event) => {
    const startMenu = document.getElementById('start-menu');
    const startButton = document.querySelector('.start-button');
    
    // Check if click is outside both the start menu and start button
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        startMenu.style.display = 'none';
    }
});

// Clock
function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();

// Media player
let currentMedia = null;
const audioPlayer = document.getElementById('audio-player');
const videoPlayer = document.getElementById('video-player');
const playerControls = document.getElementById('player-controls');
const nowPlaying = document.getElementById('now-playing');

function playMedia(mediaId) {
    playerControls.style.display = 'block';
    currentMedia = mediaId;
    
    if (mediaId.startsWith('audio')) {
        audioPlayer.style.display = 'block';
        videoPlayer.style.display = 'none';
        audioPlayer.src = `media/${mediaId}.mp3`;
        nowPlaying.textContent = `Now playing: ${mediaId}`;
    } else if (mediaId.startsWith('video')) {
        videoPlayer.style.display = 'block';
        audioPlayer.style.display = 'none';
        videoPlayer.src = `media/${mediaId}.mp4`;
        nowPlaying.textContent = `Now playing: ${mediaId}`;
    }
}

function togglePlay() {
    if (currentMedia.startsWith('audio')) {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    } else if (currentMedia.startsWith('video')) {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    }
}

// Phonebook
const contacts = {
    contact1: {
        photo: 'img/contact1.jpg',
        fullname: 'Jan Jansen',
        project: 'MC Uden Website',
        date: 'January 2023',
        description: 'Collaborated on the redesign of the MC Uden website, focusing on user experience and modern design principles.'
    },
    contact2: {
        photo: 'img/contact2.jpg',
        fullname: 'Piet Pieters',
        project: 'Veghel Hartsave App',
        date: 'March 2023',
        description: 'Worked together on the development of the Veghel Hartsave mobile application.'
    },
    contact3: {
        photo: 'img/contact3.jpg',
        fullname: 'Marie van Dijk',
        project: 'Studio Chief Branding',
        date: 'May 2023',
        description: 'Collaborated on the rebranding of Studio Chief, creating a new visual identity.'
    },
    contact4: {
        photo: 'img/contact4.jpg',
        fullname: 'Lisa de Vries',
        project: 'De Pul Website',
        date: 'July 2023',
        description: 'Worked on the website redesign for De Pul, implementing modern design trends.'
    }
};

function showContact(contactId) {
    const contact = contacts[contactId];
    if (contact) {
        document.getElementById('contact-photo').src = contact.photo;
        document.getElementById('contact-fullname').textContent = contact.fullname;
        document.getElementById('contact-project').textContent = contact.project;
        document.getElementById('contact-date').textContent = contact.date;
        document.getElementById('contact-description').textContent = contact.description;
    }
}

// Add this function at the top of the file, after the openWindows array
function goBackToIndex() {
    // Play closing chime
    playSound('closing-chime');
    
    // Create and add fade element
    const fadeElement = document.createElement('div');
    fadeElement.className = 'fade-to-black';
    document.body.appendChild(fadeElement);
    
    // Add a small delay before redirecting to allow the chime to play
    setTimeout(() => {
        // Add a timestamp to the URL to prevent caching
        const timestamp = new Date().getTime();
        window.location.href = `index.html?t=${timestamp}`;
    }, 2000); // 2000ms (2 seconds) delay to let the chime play
}

// Add this event listener at the bottom of the file
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        goBackToIndex();
    }
});

// Sound effects
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0; // Reset the sound to start
        // Set volume to 0.2 (20%) for click and close sounds, 0.5 (50%) for error sound, 1 (100%) for other sounds
        sound.volume = soundId === 'error-sound' ? 0.5 : (soundId === 'click-sound' || soundId === 'close-sound') ? 0.2 : 1;
        sound.play().catch(error => {
            console.log('Sound playback prevented:', error);
        });
    }
}

// Add click sound to all icons
document.addEventListener('DOMContentLoaded', () => {
    const icons = document.querySelectorAll('.icon');
    icons.forEach(icon => {
        icon.addEventListener('click', () => {
            playSound('click-sound');
        });
    });
});

// Viewport size checking
function checkViewportSize() {
    const isMobile = window.innerWidth <= 767;
    const sidebar = document.querySelector('.sidebar');
    const taskbar = document.querySelector('.taskbar');
    const trashcan = document.querySelector('.trashcan-container');
    const startMenu = document.getElementById('start-menu');
    const instructionsWindow = document.getElementById('instructions-window');
    
    if (isMobile) {
        // Show mobile content
        if (sidebar) sidebar.style.display = 'block';
        if (taskbar) taskbar.style.display = 'flex';
        if (trashcan) trashcan.style.display = 'block';
        if (startMenu) startMenu.style.display = 'none';
        if (instructionsWindow) instructionsWindow.style.display = 'block';
    } else {
        // Show desktop content
        if (sidebar) sidebar.style.display = 'block';
        if (taskbar) taskbar.style.display = 'flex';
        if (trashcan) trashcan.style.display = 'block';
        if (startMenu) startMenu.style.display = 'none';
        if (instructionsWindow) instructionsWindow.style.display = 'block';
    }
}

// Add event listeners for viewport size changes
window.addEventListener('load', checkViewportSize);
window.addEventListener('resize', checkViewportSize); 