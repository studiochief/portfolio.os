// Add this at the very beginning of the file
if (window.performance && window.performance.navigation.type === 2) {
    // This page was loaded via back/forward button
    window.location.reload(true); // Force reload from server
}

// Handle browser back button
window.onpopstate = function(event) {
    if (window.location.pathname.endsWith('index.html')) {
        window.location.reload(true);
    }
};

// Force a fresh start
window.onload = function() {
    // Clear any existing timeouts
    const highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        window.clearTimeout(i);
    }
    
    // Reset all elements
    const sprite = document.getElementById('sprite');
    const loadBtn = document.getElementById('load-btn');
    const fadeImage = document.getElementById('fade-image');
    
    if (sprite) {
        sprite.style.backgroundPosition = '0 0';
        sprite.classList.remove('animate');
    }
    
    if (loadBtn) {
        loadBtn.classList.remove('hidden');
        loadBtn.style.display = 'block';
    }
    
    if (fadeImage) {
        fadeImage.classList.remove('fade-in', 'fade-out');
        fadeImage.style.display = 'none';
        fadeImage.style.visibility = 'hidden';
        fadeImage.style.opacity = '0';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    const sprite = document.getElementById('sprite');
    const loadBtn = document.getElementById('load-btn');
    const fadeImage = document.getElementById('fade-image');
    
    if (!sprite || !loadBtn || !fadeImage) {
        console.error('Required elements not found');
        return;
    }
    
    console.log('All elements found');
    
    loadBtn.addEventListener('click', () => {
        console.log('Button clicked');
        
        // Start sprite animation
        sprite.classList.add('animate');
        console.log('Sprite animation started');
        
        // Hide button
        loadBtn.classList.add('hidden');
        loadBtn.style.display = 'none';
        
        // Wait for sprite animation to complete (1 second)
        setTimeout(() => {
            console.log('Sprite animation complete');
            
            // Show and fade in the image
            fadeImage.style.display = 'block';
            fadeImage.style.visibility = 'visible';
            fadeImage.classList.add('fade-in');
            console.log('Fade image transition started');
            
            // Wait for fade in to complete (1 second) plus stay visible (2 seconds)
            setTimeout(() => {
                console.log('Starting fade out');
                fadeImage.classList.remove('fade-in');
                fadeImage.classList.add('fade-out');
                
                // After fade out completes (1 second), redirect
                setTimeout(() => {
                    console.log('Redirecting to new page');
                    // Push state to history before redirecting
                    window.history.pushState({page: "new-page"}, "", "new-page.html");
                    window.location.replace('new-page.html');
                }, 1000);
            }, 3000); // 1s fade in + 2s stay visible
        }, 1000); // Sprite animation duration
    });
}); 