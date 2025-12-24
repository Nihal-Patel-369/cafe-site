// Clint's Cafe - Interactive Elements
document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.innerHTML = navLinks.classList.contains('active') ? '&times;' : '&#9776;';
        });
    }

    // Scroll Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Slow down Night Life Video & Custom Loop (Start at 6s)
    const nightLifeVideo = document.getElementById('nightLifeVideo');
    if (nightLifeVideo) {
        nightLifeVideo.playbackRate = 0.6;

        const startVideo = () => {
            if (nightLifeVideo.currentTime < 6) {
                nightLifeVideo.currentTime = 6;
            }
            nightLifeVideo.play().catch(e => console.log("Autoplay prevented:", e));
        };

        if (nightLifeVideo.readyState >= 1) {
            startVideo();
        } else {
            nightLifeVideo.addEventListener('loadedmetadata', startVideo);
        }

        // Loop back to 6s instead of 0
        nightLifeVideo.addEventListener('ended', () => {
            nightLifeVideo.currentTime = 6;
            nightLifeVideo.play();
        });
    }

    // Smooth Scroll-Driven Video Overlay Effect (Mobile)
    const handleSmoothVideoOverlay = () => {
        // Only run on mobile devices
        if (window.innerWidth > 768) return;

        const storySection = document.querySelector('.story-section');
        if (!storySection) return;

        const storyImage = storySection.querySelector('.story-image');
        const storyText = storySection.querySelector('.story-text');

        if (!storyImage || !storyText) return;

        // Create dark overlay for video (like hero section)
        let videoOverlay = storyImage.querySelector('.video-overlay');
        if (!videoOverlay) {
            videoOverlay = document.createElement('div');
            videoOverlay.className = 'video-overlay';
            videoOverlay.style.position = 'absolute';
            videoOverlay.style.top = '0';
            videoOverlay.style.left = '0';
            videoOverlay.style.width = '100%';
            videoOverlay.style.height = '100%';
            videoOverlay.style.background = 'rgba(15, 15, 15, 0.6)';
            videoOverlay.style.opacity = '0';
            videoOverlay.style.transition = 'opacity 0.3s ease';
            videoOverlay.style.pointerEvents = 'none';
            videoOverlay.style.zIndex = '2';
            storyImage.style.position = 'relative';
            storyImage.appendChild(videoOverlay);
        }

        const sectionRect = storySection.getBoundingClientRect();
        const videoRect = storyImage.getBoundingClientRect();
        const headerHeight = 80;

        // Calculate scroll progress
        // Phase 1: Video reaches top of viewport (becomes fixed)
        const phase1Start = sectionRect.top;
        const phase1End = headerHeight;

        // Phase 2: Description slides over video
        const videoHeight = storyImage.offsetHeight;
        const textHeight = storyText.offsetHeight;
        const scrollRange = textHeight; // Exact range - no extra scroll

        // Check if section is in viewport
        if (sectionRect.top <= headerHeight && sectionRect.bottom > headerHeight) {
            // Calculate how much we've scrolled into the section
            const scrollProgress = Math.max(0, headerHeight - sectionRect.top);

            // Phase 1: Make video sticky (0 to videoHeight scroll)
            if (scrollProgress < videoHeight) {
                storyImage.style.position = 'fixed';
                storyImage.style.top = headerHeight + 'px';
                storyImage.style.left = '0';
                storyImage.style.width = '100%';
                storyImage.style.zIndex = '5';
                storyImage.style.transition = 'none';

                // Keep description below video initially
                storyText.style.transform = 'translateY(0)';
                storyText.style.opacity = '0.5';

                // No overlay yet
                videoOverlay.style.opacity = '0';
            }

            // Phase 2: Slide description over video
            else if (scrollProgress >= videoHeight && scrollProgress < videoHeight + scrollRange) {
                const phase2Progress = (scrollProgress - videoHeight) / scrollRange;
                const translateY = -textHeight * phase2Progress;

                storyImage.style.position = 'fixed';
                storyImage.style.top = headerHeight + 'px';
                storyImage.style.left = '0';
                storyImage.style.width = '100%';
                storyImage.style.zIndex = '5';

                // Smoothly slide description up
                storyText.style.transform = `translateY(${translateY}px)`;
                storyText.style.opacity = '1';
                storyText.style.transition = 'opacity 0.3s ease';

                // Gradually darken video as description overlays it
                videoOverlay.style.opacity = phase2Progress.toString();
            }

            // Phase 3: Description fully aligned on video - both scroll together
            else {
                storyImage.style.position = 'relative';
                storyImage.style.top = '';
                storyImage.style.left = '';
                storyImage.style.width = '';
                storyImage.style.zIndex = '';

                // Keep description in its final overlay position
                storyText.style.transform = `translateY(-${textHeight}px)`;
                storyText.style.opacity = '1';

                // Full overlay
                videoOverlay.style.opacity = '1';
            }
        } else {
            // Reset when section is out of viewport
            storyImage.style.position = '';
            storyImage.style.top = '';
            storyImage.style.left = '';
            storyImage.style.width = '';
            storyImage.style.zIndex = '';

            storyText.style.transform = '';
            storyText.style.opacity = '';

            // Remove overlay
            videoOverlay.style.opacity = '0';
        }
    };

    // Use requestAnimationFrame for smooth scroll handling
    let ticking = false;
    const smoothScrollHandler = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleSmoothVideoOverlay();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Add scroll listener
    window.addEventListener('scroll', smoothScrollHandler, { passive: true });

    // Also run on resize
    window.addEventListener('resize', handleSmoothVideoOverlay);

    // Run once on load
    handleSmoothVideoOverlay();
});
