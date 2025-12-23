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
});
