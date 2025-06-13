/* ==========================================================================
   DENCA - COMMON.JS
   Funzionalità JavaScript condivise per tutte le pagine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // HAMBURGER MENU NAVIGATION
    // ==========================================================================
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    window.toggleMenu = function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    };
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });

    // ==========================================================================
    // SMOOTH SCROLLING
    // ==========================================================================
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================================
    // BACK TO TOP BUTTON
    // ==========================================================================
    
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // NEWSLETTER SUBSCRIPTION
    // ==========================================================================
    
    window.subscribeNewsletter = function(event) {
        event.preventDefault();
        
        const form = event.target;
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = form.querySelector('button');
        const email = emailInput.value.trim();
        
        // Basic email validation
        if (!email || !isValidEmail(email)) {
            showNotification('Inserisci un indirizzo email valido', 'error');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call (replace with real endpoint)
        setTimeout(() => {
            // Reset form
            emailInput.value = '';
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            
            // Show success message
            showNotification('Grazie! Ti sei iscritto alla newsletter con successo.', 'success');
        }, 1500);
    };

    // ==========================================================================
    // HEADER SCROLL BEHAVIOR
    // ==========================================================================
    
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow on scroll
        if (scrollTop > 10) {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // ==========================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================================================
    
    // Animate elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special handling for counter elements
                if (entry.target.hasAttribute('data-target')) {
                    animateCounter(entry.target);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    const animateElements = document.querySelectorAll('.service-card, .why-us-list li, .stat-card, .process-step, .testimonial-card, .achievement-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // ==========================================================================
    // COUNTER ANIMATION
    // ==========================================================================
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with + or % if needed
            let displayValue = Math.floor(current);
            const originalText = element.textContent;
            
            if (originalText.includes('+')) {
                element.textContent = displayValue + '+';
            } else if (originalText.includes('%')) {
                element.textContent = displayValue + '%';
            } else if (originalText.includes('/')) {
                element.textContent = displayValue + '/7';
            } else {
                element.textContent = displayValue;
            }
        }, 16);
    }

    // ==========================================================================
    // NOTIFICATION SYSTEM
    // ==========================================================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }

    // ==========================================================================
    // FORM UTILITIES
    // ==========================================================================
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================================================
    // PERFORMANCE MONITORING
    // ==========================================================================
    
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('🚀 Page load time:', loadTime + 'ms');
            
            // Report slow pages (development only)
            if (loadTime > 3000) {
                console.warn('⚠️ Slow page load detected:', loadTime + 'ms');
            }
        }
    });

    // ==========================================================================
    // ACCESSIBILITY IMPROVEMENTS
    // ==========================================================================
    
    // Keyboard navigation for mobile menu
    hamburger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // Focus trap for mobile menu
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                toggleMenu();
                hamburger.focus();
            }
        });
    }

    // ==========================================================================
    // CONSOLE BRANDING
    // ==========================================================================
    
    console.log('%c🏗️ DENCA Website', 'color: #d4902b; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with ❤️ by Denca Team', 'color: #2c3e50; font-size: 12px;');
    console.log('%cCommon.js loaded successfully ✅', 'color: #27ae60; font-size: 12px;');

});

// ==========================================================================
// CSS ANIMATIONS (da aggiungere al CSS globale se mancante)
// ==========================================================================

const additionalCSS = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    padding: 0.2rem;
    border-radius: 50%;
    transition: background 0.2s;
}

.notification-close:hover {
    background: rgba(255,255,255,0.2);
}

.animate-in {
    animation: slideInUp 0.6s ease-out forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

// Inject additional CSS if needed
if (!document.querySelector('#common-animations')) {
    const style = document.createElement('style');
    style.id = 'common-animations';
    style.textContent = additionalCSS;
    document.head.appendChild(style);
}

/* ==========================================================================
   FLOATING ACTION BUTTON - VERSIONE CORRETTA E STANDARDIZZATA
   Da SOSTITUIRE completamente nel common.js
   ========================================================================== */

// ==========================================================================
// FLOATING ACTION BUTTON INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Delay per assicurare che la pagina sia completamente caricata
    setTimeout(initializeStandardizedFAB, 800);
});

function initializeStandardizedFAB() {
    // Rimuovi eventuali FAB esistenti per evitare duplicati
    removeExistingFABs();
    
    // Crea il FAB standardizzato
    const fab = createUniformFAB();
    document.body.appendChild(fab);
    
    // Inizializza le interazioni
    setupUniformFABInteractions();
    
    // Effetto pulse di benvenuto
    setTimeout(() => {
        const fabMain = document.querySelector('.fab-main');
        if (fabMain) {
            fabMain.classList.add('pulse');
            setTimeout(() => fabMain.classList.remove('pulse'), 4000);
        }
    }, 2000);
    
    console.log('🎯 Standardized FAB initialized on:', window.location.pathname);
}

function removeExistingFABs() {
    const existingFABs = document.querySelectorAll('.floating-action-button');
    existingFABs.forEach(fab => fab.remove());
}

function createUniformFAB() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-button';
    fab.setAttribute('aria-label', 'Menu contatti rapidi');
    
    // STRUTTURA IDENTICA per TUTTE le pagine
    fab.innerHTML = `
        <button class="fab-main" 
                onclick="toggleUniformFabMenu()" 
                aria-label="Menu contatti rapidi" 
                type="button">
            <i class="fas fa-plus"></i>
        </button>
        <div class="fab-menu" role="menu" aria-hidden="true">
            <a href="tel:+390547123456" 
               class="fab-item uniform-fab-item" 
               data-tooltip="Chiama Ora" 
               role="menuitem"
               aria-label="Chiama il numero 0547 123456">
                <i class="fas fa-phone"></i>
            </a>
            <a href="https://wa.me/393331234567" 
               class="fab-item uniform-fab-item" 
               data-tooltip="WhatsApp" 
               target="_blank" 
               rel="noopener noreferrer"
               role="menuitem"
               aria-label="Contatta via WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </a>
            <a href="mailto:info@denca.it" 
               class="fab-item uniform-fab-item" 
               data-tooltip="Email" 
               role="menuitem"
               aria-label="Invia email a info@denca.it">
                <i class="fas fa-envelope"></i>
            </a>
            <a href="contatti.html#contactForm" 
               class="fab-item uniform-fab-item" 
               data-tooltip="Preventivo" 
               role="menuitem"
               aria-label="Richiedi preventivo gratuito">
                <i class="fas fa-calculator"></i>
            </a>
        </div>
    `;
    
    return fab;
}

function setupUniformFABInteractions() {
    // Click fuori per chiudere
    document.addEventListener('click', function(e) {
        const fab = document.querySelector('.floating-action-button');
        if (fab && !fab.contains(e.target) && fab.classList.contains('active')) {
            toggleUniformFabMenu();
        }
    });
    
    // Tasto Escape per chiudere
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const fab = document.querySelector('.floating-action-button');
            if (fab && fab.classList.contains('active')) {
                toggleUniformFabMenu();
            }
        }
    });
    
    // Track clicks su tutti gli item
    setTimeout(() => {
        const fabItems = document.querySelectorAll('.uniform-fab-item');
        fabItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const tooltip = this.getAttribute('data-tooltip');
                const href = this.getAttribute('href');
                
                // Analytics unificato
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'fab_contact_click', {
                        event_category: 'contact',
                        event_label: tooltip,
                        contact_method: getContactType(href),
                        page_location: window.location.pathname
                    });
                }
                
                console.log('📞 FAB Contact:', {
                    method: tooltip,
                    page: window.location.pathname.split('/').pop(),
                    href: href
                });
                
                // Chiudi menu dopo click su link interni
                if (href.includes('contatti.html')) {
                    setTimeout(() => toggleUniformFabMenu(), 300);
                }
            });
        });
    }, 100);
    
    // Comportamento scroll
    setupScrollBehavior();
}

// Funzione globale per toggle menu
window.toggleUniformFabMenu = function() {
    const fab = document.querySelector('.floating-action-button');
    if (!fab) return;
    
    const fabMain = fab.querySelector('.fab-main');
    const fabMenu = fab.querySelector('.fab-menu');
    const fabItems = fab.querySelectorAll('.uniform-fab-item');
    
    fab.classList.toggle('active');
    
    if (fab.classList.contains('active')) {
        // APERTURA - animazione sequenziale verso l'alto
        fabMain.innerHTML = '<i class="fas fa-times"></i>';
        fabMain.setAttribute('aria-label', 'Chiudi menu contatti');
        fabMenu.setAttribute('aria-hidden', 'false');
        
        // Reset positions per animazione
        fabItems.forEach(item => {
            item.style.transform = 'translateY(70px) scale(0.8)';
            item.style.opacity = '0';
        });
        
        // Animazione sequenziale verso l'alto
        fabItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.opacity = '1';
            }, index * 100 + 50); // 100ms di delay tra ogni bottone
        });
        
        // Focus per accessibilità
        setTimeout(() => {
            const firstItem = fabItems[0];
            if (firstItem) firstItem.focus();
        }, 400);
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'fab_menu_open', {
                event_category: 'engagement',
                event_label: 'contact_menu',
                page_location: window.location.pathname
            });
        }
        
    } else {
        // CHIUSURA - animazione veloce verso il basso
        fabMain.innerHTML = '<i class="fas fa-plus"></i>';
        fabMain.setAttribute('aria-label', 'Menu contatti rapidi');
        fabMenu.setAttribute('aria-hidden', 'true');
        
        // Animazione di chiusura
        fabItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(70px) scale(0.8)';
                item.style.opacity = '0';
            }, index * 30); // Chiusura più veloce
        });
        
        fabMain.focus();
    }
};

function setupScrollBehavior() {
    let scrollTimer = null;
    
    window.addEventListener('scroll', function() {
        const fab = document.querySelector('.floating-action-button');
        if (!fab) return;
        
        if (scrollTimer) clearTimeout(scrollTimer);
        
        // Nascondi leggermente durante lo scroll
        fab.style.opacity = '0.7';
        fab.style.transform = 'scale(0.95)';
        
        // Mostra dopo che lo scroll si è fermato
        scrollTimer = setTimeout(() => {
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
            
            // Chiudi menu se aperto durante scroll
            if (fab.classList.contains('active')) {
                toggleUniformFabMenu();
            }
        }, 150);
    }, { passive: true });
}

function getContactType(href) {
    if (href.startsWith('tel:')) return 'phone';
    if (href.includes('wa.me')) return 'whatsapp';
    if (href.startsWith('mailto:')) return 'email';
    if (href.includes('contatti')) return 'quote_form';
    return 'other';
}

// ==========================================================================
// ATTENTION FEATURES
// ==========================================================================

// Pulse per inattività utente
let inactivityTimer = null;

function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        const fabMain = document.querySelector('.fab-main');
        const fab = document.querySelector('.floating-action-button');
        
        if (fabMain && fab && !fab.classList.contains('active')) {
            fabMain.classList.add('pulse');
            setTimeout(() => fabMain.classList.remove('pulse'), 3000);
        }
    }, 30000); // 30 secondi
}

// Traccia attività utente
['click', 'scroll', 'keydown', 'mousemove', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true });
});

// ==========================================================================
// EMERGENCY CONTACT (Fuori orario)
// ==========================================================================

function addEmergencyContact() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    
    // Fuori orario: prima delle 8, dopo le 18, o weekend
    const isAfterHours = hour < 8 || hour > 18 || day === 0 || day === 6;
    
    if (isAfterHours) {
        setTimeout(() => {
            const fabMenu = document.querySelector('.fab-menu');
            if (fabMenu && !fabMenu.querySelector('.emergency-fab-item')) {
                const emergencyBtn = document.createElement('a');
                emergencyBtn.href = 'tel:+393331234567';
                emergencyBtn.className = 'fab-item uniform-fab-item emergency-fab-item';
                emergencyBtn.setAttribute('data-tooltip', 'Emergenze 24/7');
                emergencyBtn.setAttribute('role', 'menuitem');
                emergencyBtn.setAttribute('aria-label', 'Chiamata emergenza 24/7');
                emergencyBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                
                // Aggiungi come primo elemento
                fabMenu.insertBefore(emergencyBtn, fabMenu.firstChild);
                
                console.log('🚨 Emergency contact added (after hours)');
            }
        }, 1000);
    }
}

// Verifica contatto emergenza
addEmergencyContact();

// ==========================================================================
// DEBUGGING E CLEANUP
// ==========================================================================

// Cleanup finale per evitare conflitti
setTimeout(() => {
    const allFABs = document.querySelectorAll('.floating-action-button');
    if (allFABs.length > 1) {
        // Mantieni solo il primo, rimuovi gli altri
        for (let i = 1; i < allFABs.length; i++) {
            allFABs[i].remove();
        }
        console.log('🧹 Removed duplicate FABs');
    }
    
    // Verifica che tutti i bottoni siano presenti
    const fabItems = document.querySelectorAll('.uniform-fab-item');
    console.log(`✅ FAB initialized with ${fabItems.length} contact buttons`);
    
    if (fabItems.length !== 4) {
        console.warn('⚠️ Expected 4 FAB buttons, found:', fabItems.length);
    }
}, 2000);

console.log('🎯 Uniform FAB system loaded successfully ✅');