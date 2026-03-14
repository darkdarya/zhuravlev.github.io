document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.price-card, .portfolio-item, .tag').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastSpan = toast.querySelector('span');
    
    if (message) {
        toastSpan.textContent = message;
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        showToast('Спасибо! Заявка принята. Мы свяжемся с вами.');
        
        this.reset();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    initGalleries();
    
    initGalleryTabs();
    
});

function initGalleries() {
    const galleries = document.querySelectorAll('.gallery-container');
    
    galleries.forEach(gallery => {
        const slider = gallery.querySelector('.gallery-slider');
        const slides = gallery.querySelectorAll('.gallery-slide');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        const dotsContainer = gallery.querySelector('.gallery-dots');
        
        if (!slider || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        
        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('gallery-dot');
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
                
                dotsContainer.appendChild(dot);
            }
        }
        
        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            
            currentIndex = index;
            
            slider.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            updateButtons();
            
            updateDots();
        }
        
        function updateButtons() {
            if (prevBtn) {
                if (currentIndex === 0) {
                    prevBtn.disabled = true;
                    prevBtn.style.opacity = '0.3';
                } else {
                    prevBtn.disabled = false;
                    prevBtn.style.opacity = '1';
                }
            }
            
            if (nextBtn) {
                if (currentIndex === totalSlides - 1) {
                    nextBtn.disabled = true;
                    nextBtn.style.opacity = '0.3';
                } else {
                    nextBtn.disabled = false;
                    nextBtn.style.opacity = '1';
                }
            }
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            
            const dots = dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        createDots();
        goToSlide(0);
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    if (currentIndex < totalSlides - 1) {
                        goToSlide(currentIndex + 1);
                    }
                } else {
                    if (currentIndex > 0) {
                        goToSlide(currentIndex - 1);
                    }
                }
            }
        }
    });
}

function initGalleryTabs() {
    const tabs = document.querySelectorAll('.gallery-tab');
    const galleries = document.querySelectorAll('.gallery-container');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            galleries.forEach(gallery => {
                gallery.classList.remove('active');
            });
            
            const activeGallery = document.getElementById(`gallery-${category}`);
            if (activeGallery) {
                activeGallery.classList.add('active');
                
                const slider = activeGallery.querySelector('.gallery-slider');
                if (slider) {
                    slider.style.transform = 'translateX(0%)';
                }
            }
        });
    });
}