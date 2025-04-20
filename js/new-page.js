// Window management
let openWindows = [];

function openWindow(windowId) {
    console.log(`Attempting to open window: ${windowId}`);
    const window = document.getElementById(`${windowId}-window`);
    
    if (!window) {
        console.error(`Window with ID ${windowId}-window not found`);
        return;
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
    }, 250); // Match animation duration
    
    // Add to open windows array if not already there
    if (!openWindows.includes(windowId)) {
        openWindows.push(windowId);
    }
    
    // Update z-index to bring window to front
    updateWindowZIndex();
    console.log(`Window ${windowId} opened successfully`);
}

function closeWindow(windowId) {
    console.log(`Attempting to close window: ${windowId}`);
    const window = document.getElementById(`${windowId}-window`);
    
    if (!window) {
        console.error(`Window with ID ${windowId}-window not found`);
        return;
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
    }, 250); // Match animation duration
    
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
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

// Function to open window and close start menu
function openWindowAndCloseMenu(windowId) {
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
    // Add a timestamp to the URL to prevent caching
    const timestamp = new Date().getTime();
    window.location.href = `index.html?t=${timestamp}`;
}

// Add this event listener at the bottom of the file
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        goBackToIndex();
    }
}); 