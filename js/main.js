// Data Fetching
async function fetchContent() {
    try {
        const response = await fetch('./data/home.json');
        const data = await response.json();
        populateHero(data.hero);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function populateHero(heroData) {
    document.getElementById('hero-greeting').textContent = heroData.greeting;
    document.getElementById('hero-subtitle').textContent = heroData.subtitle;
}

// Custom Cursor
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Slight delay on outline for organic feel
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 150, fill: "forwards" });
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

// Loading Screen & Initial Reveal
function initLoader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.visibility = 'hidden';
                triggerReveal();
            }, 1500);
        }, 1000);
    });
}

// Scroll Animations & Parallax
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-text');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}

function triggerReveal() {
    document.querySelectorAll('.hero .reveal-text').forEach(el => el.classList.add('active'));
}

// Floating Navigation
function initNav() {
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });
}

// Cinematic Floating Particles
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(184, 168, 154, ${p.alpha})`; // Accent color
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    animate();
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    fetchContent();
    initCursor();
    initLoader();
    initNav();
    initScrollReveal();
    initParticles();
});
