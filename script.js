// Initialisation AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Gestion de la galerie
document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery-grid');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-content img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const galleryItems = [...document.querySelectorAll('.gallery-item')];

    // Filtres de la galerie
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gestion du lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const currentItem = galleryItems[index];
        const imgSrc = currentItem.querySelector('img').src;
        const title = currentItem.querySelector('h3').textContent;
        const description = currentItem.querySelector('p').textContent;

        lightboxImg.src = imgSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        updateLightboxNavigation();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxNavigation() {
        const visibleItems = galleryItems.filter(item => 
            window.getComputedStyle(item).display !== 'none'
        );
        
        lightboxPrev.style.visibility = currentImageIndex > 0 ? 'visible' : 'hidden';
        lightboxNext.style.visibility = 
            currentImageIndex < visibleItems.length - 1 ? 'visible' : 'hidden';
    }

    // Événements du lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', () => {
        if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
    });

    lightboxNext.addEventListener('click', () => {
        if (currentImageIndex < galleryItems.length - 1) {
            openLightbox(currentImageIndex + 1);
        }
    });

    // Navigation au clavier
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                if (currentImageIndex > 0) openLightbox(currentImageIndex - 1);
                break;
            case 'ArrowRight':
                if (currentImageIndex < galleryItems.length - 1) {
                    openLightbox(currentImageIndex + 1);
                }
                break;
        }
    });
});

// Smooth scroll amélioré
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 100;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Navigation sticky avec effet de transition
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-up');
        nav.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Curseur personnalisé
const cursor = document.querySelector('#cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animation fluide du curseur
function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px) rotate(${dx * 0.05}deg)`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Effet hover sur les éléments interactifs
document.querySelectorAll('a, button, .gallery-item').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px) scale(1.5)`;
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px) scale(1)`;
    });
});

// Animation des sections au scroll
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease-out';
    sectionObserver.observe(section);
});

// Kawaii elements animation
const kawaiiEmojis = ['✨', '🌸', '💖', '🎀', '🌟', '🍡', '🌈', '🦄'];

function createKawaiiElement() {
    const emoji = document.createElement('div');
    emoji.className = 'floating-emoji';
    emoji.textContent = kawaiiEmojis[Math.floor(Math.random() * kawaiiEmojis.length)];
    
    // Random starting position
    emoji.style.top = `${Math.random() * window.innerHeight}px`;
    emoji.style.left = '-50px';
    
    document.body.appendChild(emoji);
    
    // Remove element after animation
    emoji.addEventListener('animationend', () => {
        emoji.remove();
    });
}

// Create new emoji every 3 seconds
setInterval(createKawaiiElement, 3000);

// Gallery filtering with cute animation
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        galleryItems.forEach(item => {
            gsap.to(item, {
                scale: filter === 'all' || item.dataset.category === filter ? 1 : 0.8,
                opacity: filter === 'all' || item.dataset.category === filter ? 1 : 0.3,
                duration: 0.4,
                ease: "back.out(1.7)"
            });
        });
    });
});

// Smooth scroll with cute bounce
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: target,
                offsetY: 70
            },
            ease: "back.out(1.4)"
        });
    });
});

// Cursor trail effect
const createTrail = (e) => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.innerHTML = '💖';
    trail.style.left = e.pageX + 'px';
    trail.style.top = e.pageY + 'px';
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 1000);
};

document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        createTrail(e);
    }
});

// Three.js background animation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector('#canvas-container').appendChild(renderer.domElement);

// Création de particules nature
const geometry = new THREE.BufferGeometry();
const vertices = [];
for (let i = 0; i < 1000; i++) {
    vertices.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
    );
}
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0x557153, size: 2 });
const points = new THREE.Points(geometry, material);
scene.add(points);

camera.position.z = 1000;

// Animation de la scène
function animate() {
    requestAnimationFrame(animate);
    points.rotation.x += 0.001;
    points.rotation.y += 0.001;
    renderer.render(scene, camera);
}
animate();

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Gestion de la modale pour la galerie
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let currentIndex = 0;

    // Fonction pour ouvrir la modale
    function openModal(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const title = item.querySelector('.overlay h3').textContent;
        const description = item.querySelector('.overlay p').textContent;

        currentIndex = index;
        modalImg.src = img.src;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        updateNavigationButtons();
    }

    // Fonction pour fermer la modale
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        modalImg.src = '';
    }

    // Fonction pour mettre à jour les boutons de navigation
    function updateNavigationButtons() {
        prevBtn.style.display = currentIndex > 0 ? 'block' : 'none';
        nextBtn.style.display = currentIndex < galleryItems.length - 1 ? 'block' : 'none';
    }

    // Fonction pour naviguer vers l'image précédente
    function showPreviousImage() {
        if (currentIndex > 0) {
            openModal(currentIndex - 1);
        }
    }

    // Fonction pour naviguer vers l'image suivante
    function showNextImage() {
        if (currentIndex < galleryItems.length - 1) {
            openModal(currentIndex + 1);
        }
    }

    // Ajouter les écouteurs d'événements pour chaque image de la galerie
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    // Écouteurs d'événements pour les contrôles de la modale
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', showPreviousImage);
    nextBtn.addEventListener('click', showNextImage);

    // Fermer la modale en cliquant en dehors de l'image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('show')) return;

        switch (e.key) {
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
            case 'Escape':
                closeModal();
                break;
        }
    });

    // Gestion du swipe sur mobile
    let touchStartX = 0;
    let touchEndX = 0;

    modalImg.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modalImg.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;

        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0) {
                showPreviousImage();
            } else {
                showNextImage();
            }
        }
    }
});

// Navigation mobile
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

function toggleMenu() {
    // Toggle menu
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle body scroll
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Toggle menu when clicking hamburger
hamburger.addEventListener('click', toggleMenu);

// Close menu when clicking on a link
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
        toggleMenu();
    }
});

// Close menu when window is resized to desktop size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// Création d'étoiles flottantes
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = '✨';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}

setInterval(createSparkle, 500);

// Animation smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease-out';
    observer.observe(section);
});

// Effet de hover kawaii sur les liens
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        const emoji = document.createElement('div');
        emoji.textContent = '💖';
        emoji.style.position = 'absolute';
        emoji.style.left = '50%';
        emoji.style.top = '50%';
        emoji.style.transform = 'translate(-50%, -50%)';
        emoji.style.fontSize = '1.5rem';
        emoji.style.pointerEvents = 'none';
        emoji.style.animation = 'float 1s ease-out forwards';
        element.appendChild(emoji);

        setTimeout(() => {
            emoji.remove();
        }, 1000);
    });
});

// Animation du logo
const logo = document.querySelector('.logo');
let rotation = 0;

function animateLogo() {
    rotation += 1;
    logo.style.transform = `rotate(${Math.sin(rotation * Math.PI / 180) * 5}deg)`;
    requestAnimationFrame(animateLogo);
}

animateLogo();
