document.addEventListener('DOMContentLoaded', function() {
    // Get all window content elements
    const windowContents = document.querySelectorAll('.window-content');
    
    // Scroll step size (in pixels)
    const SCROLL_STEP = 40;
    let isScrolling = false;
    
    // Add wheel event listener to each window content
    windowContents.forEach(content => {
        content.addEventListener('wheel', function(e) {
            e.preventDefault();
            
            if (isScrolling) return;
            isScrolling = true;
            
            const currentScroll = this.scrollTop;
            const delta = e.deltaY;
            const direction = delta > 0 ? 1 : -1;
            
            // Calculate the next scroll position in larger steps
            const nextScroll = Math.round(currentScroll / SCROLL_STEP) * SCROLL_STEP + (direction * SCROLL_STEP);
            
            // Add a slight delay to make it feel more mechanical
            setTimeout(() => {
                this.scrollTop = nextScroll;
                isScrolling = false;
            }, 150);
        }, { passive: false });
        
        // Also handle scrollbar clicks
        content.addEventListener('scroll', function(e) {
            if (!isScrolling) {
                isScrolling = true;
                const currentScroll = this.scrollTop;
                const nextScroll = Math.round(currentScroll / SCROLL_STEP) * SCROLL_STEP;
                
                setTimeout(() => {
                    this.scrollTop = nextScroll;
                    isScrolling = false;
                }, 150);
            }
        });
        
        // Prevent momentum scrolling on iOS devices
        content.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
    });
}); 