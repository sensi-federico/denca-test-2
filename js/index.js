/* ==========================================================================
   DENCA - INDEX.JS
   Homepage animations, counter effects, e interazioni specifiche
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // HERO SECTION INTERACTIONS
    // ==========================================================================
    
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (hero && heroContent) {
        // Parallax effect on scroll
        window.addEventListener('scroll', throttle(handleHeroParallax, 16));
        
        // CTA button interactions
        initializeCTAButtons();
        
        // Typing effect for hero subtitle (optional enhancement)
        initializeTypingEffect();
    }
    
    function handleHeroParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // Hide scroll indicator after scrolling
        if (scrollIndicator && scrolled > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else if (scrollIndicator && scrolled <= 100) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    }
    
    function initializeCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Track CTA clicks
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cta_click', {
                        event_category: 'engagement',
                        event_label: buttonText,
                        event_location: 'hero'
                    });
                }
                
                console.log('🎯 CTA clicked:', buttonText);
            });
        });
    }
    
    function initializeTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;
        
        const originalText = subtitle.innerHTML;
        const shouldAnimate = window.innerWidth > 768; // Only on desktop
        
        if (shouldAnimate) {
            subtitle.innerHTML = '';
            subtitle.style.borderRight = '2px solid rgba(255,255,255,0.8)';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    subtitle.innerHTML += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                } else {
                    // Remove cursor after typing
                    setTimeout(() => {
                        subtitle.style.borderRight = 'none';
                    }, 1000);
                }
            };
            
            // Start typing after hero loads
            setTimeout(typeWriter, 1000);
        }
    }
    
    // ==========================================================================
    // STATISTICS COUNTER ANIMATIONS
    // ==========================================================================
    
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    
    function initializeCounters() {
        const statsSection = document.querySelector('.why-us-section');
        if (!statsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    animateAllCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(statsSection);
    }
    
    function animateAllCounters() {
        statNumbers.forEach((counter, index) => {
            // Stagger animation start
            setTimeout(() => {
                animateCounter(counter);
            }, index * 200);
        });
    }
    
    function animateCounter(element) {
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        const isTime = originalText.includes('/');
        
        let targetValue;
        if (isTime) {
            targetValue = 24; // "24/7"
        } else {
            targetValue = parseInt(originalText.replace(/[^\d]/g, ''));
        }
        
        if (isNaN(targetValue)) return;
        
        const duration = 2000; // 2 seconds
        const steps = 60; // 60 fps
        const stepValue = targetValue / steps;
        const stepDuration = duration / steps;
        
        let currentValue = 0;
        element.textContent = '0';
        
        const counterInterval = setInterval(() => {
            currentValue += stepValue;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counterInterval);
            }
            
            let displayValue = Math.floor(currentValue);
            
            // Format based on original text
            if (hasPlus) {
                element.textContent = displayValue + '+';
            } else if (hasPercent) {
                element.textContent = displayValue + '%';
            } else if (isTime) {
                element.textContent = displayValue + '/7';
            } else {
                element.textContent = displayValue;
            }
            
            // Add pulsing effect during animation
            element.style.transform = 'scale(1.05)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 100);
            
        }, stepDuration);
    }
    
    // ==========================================================================
    // SERVICE CARDS INTERACTIONS
    // ==========================================================================
    
    function initializeServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            // Staggered entrance animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            // Animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease-out';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(card);
            
            // Enhanced hover effects
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    icon.style.color = 'var(--secondary-color)';
                }
                
                // Subtle card lift
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.service-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.color = 'var(--primary-color)';
                }
                
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Click tracking
            card.addEventListener('click', function() {
                const serviceTitle = this.querySelector('h3')?.textContent;
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'service_card_click', {
                        event_category: 'engagement',
                        event_label: serviceTitle
                    });
                }
                
                console.log('🏗️ Service card clicked:', serviceTitle);
            });
        });
    }
    
    // ==========================================================================
    // WHY CHOOSE US SECTION ANIMATIONS
    // ==========================================================================
    
    function initializeWhyChooseUs() {
        const whyUsList = document.querySelector('.why-us-list');
        if (!whyUsList) return;
        
        const listItems = whyUsList.querySelectorAll('li');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    listItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = 'slideInLeft 0.6s ease-out forwards';
                            item.style.opacity = '1';
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        // Hide items initially
        listItems.forEach(item => {
            item.style.opacity = '0';
        });
        
        observer.observe(whyUsList);
    }
    
    // ==========================================================================
    // STAT CARDS HOVER EFFECTS
    // ==========================================================================
    
    function initializeStatCards() {
        const statCards = document.querySelectorAll('.stat-card');
        
        statCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const number = this.querySelector('.stat-number');
                const label = this.querySelector('.stat-label');
                
                // Enhanced hover animation
                this.style.transform = 'translateY(-8px) scale(1.03)';
                this.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                
                if (number) number.style.color = 'white';
                if (label) label.style.color = 'white';
            });
            
            card.addEventListener('mouseleave', function() {
                const number = this.querySelector('.stat-number');
                const label = this.querySelector('.stat-label');
                
                this.style.transform = 'translateY(0) scale(1)';
                this.style.background = 'var(--bg-light)';
                
                if (number) number.style.color = 'var(--primary-color)';
                if (label) label.style.color = 'var(--text-light)';
            });
        });
    }
    
    // ==========================================================================
    // SCROLL-TRIGGERED ANIMATIONS
    // ==========================================================================
    
    function initializeScrollAnimations() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Track section views for analytics
                    const sectionClass = entry.target.className;
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'section_view', {
                            event_category: 'engagement',
                            event_label: sectionClass
                        });
                    }
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });
        
        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // ==========================================================================
    // CALL-TO-ACTION OPTIMIZATION
    // ==========================================================================
    
    function initializeCTAOptimization() {
        const finalCTA = document.querySelector('.cta-final-section .cta-button');
        
        if (finalCTA) {
            // Add urgency effect
            let pulseInterval;
            
            const ctaObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start subtle pulsing
                        pulseInterval = setInterval(() => {
                            finalCTA.style.transform = 'scale(1.02)';
                            setTimeout(() => {
                                finalCTA.style.transform = 'scale(1)';
                            }, 200);
                        }, 3000);
                        
                        ctaObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            ctaObserver.observe(finalCTA);
            
            // Clear interval when user leaves page
            window.addEventListener('beforeunload', () => {
                if (pulseInterval) clearInterval(pulseInterval);
            });
        }
    }
    
    // ==========================================================================
    // PERFORMANCE MONITORING
    // ==========================================================================
    
    function monitorPerformance() {
        // Track slow animations
        const performanceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.duration > 16) { // Slower than 60fps
                    console.warn('🐌 Slow animation detected:', entry.name, entry.duration + 'ms');
                }
            });
        });
        
        if ('PerformanceObserver' in window) {
            performanceObserver.observe({ entryTypes: ['measure'] });
        }
        
        // Memory usage monitoring (development only)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);
                
                if (usedMB > limitMB * 0.8) {
                    console.warn('⚠️ High memory usage:', usedMB + 'MB / ' + limitMB + 'MB');
                }
            }, 30000); // Check every 30 seconds
        }
    }
    
    // ==========================================================================
    // MOBILE-SPECIFIC OPTIMIZATIONS
    // ==========================================================================
    
    function initializeMobileOptimizations() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reduce animation complexity on mobile
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                card.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
            
            // Optimize parallax for mobile
            window.removeEventListener('scroll', handleHeroParallax);
            
            // Add mobile-specific interactions
            addMobileSwipeSupport();
        }
    }
    
    function addMobileSwipeSupport() {
        // Add swipe support for service cards (optional enhancement)
        const servicesGrid = document.querySelector('.services-grid');
        if (!servicesGrid) return;
        
        let startX, startY, distX, distY;
        
        servicesGrid.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });
        
        servicesGrid.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const touch = e.touches[0];
            distX = touch.clientX - startX;
            distY = touch.clientY - startY;
            
            // Prevent default scrolling if horizontal swipe
            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        });
    }
    
    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
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
    
    // ==========================================================================
    // PAGE VISIBILITY API
    // ==========================================================================
    
    function handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            console.log('⏸️ Page hidden - pausing animations');
        } else {
            // Resume animations when tab becomes visible
            console.log('▶️ Page visible - resuming animations');
        }
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function initializeHomepage() {
        console.log('🏠 Initializing homepage...');
        
        // Core animations
        initializeCounters();
        initializeServiceCards();
        initializeWhyChooseUs();
        initializeStatCards();
        initializeScrollAnimations();
        initializeCTAOptimization();
        
        // Mobile optimizations
        initializeMobileOptimizations();
        
        // Performance monitoring (development only)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            monitorPerformance();
        }
        
        // Page visibility handling
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        console.log('✅ Homepage initialized successfully');
    }
    
    // Start everything
    initializeHomepage();
    
    // ==========================================================================
    // RESIZE HANDLER
    // ==========================================================================
    
    window.addEventListener('resize', debounce(() => {
        const isMobile = window.innerWidth <= 768;
        
        // Reinitialize mobile optimizations if screen size changed
        if (isMobile && !window.mobileOptimized) {
            initializeMobileOptimizations();
            window.mobileOptimized = true;
        } else if (!isMobile && window.mobileOptimized) {
            window.mobileOptimized = false;
            // Re-add parallax for desktop
            window.addEventListener('scroll', throttle(handleHeroParallax, 16));
        }
    }, 250));
    
    // ==========================================================================
    // DEVELOPMENT HELPERS
    // ==========================================================================
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Add development console commands
        window.dencaDebug = {
            triggerCounters: () => animateAllCounters(),
            resetAnimations: () => location.reload(),
            logPerformance: () => console.table(performance.getEntriesByType('navigation'))
        };
        
        console.log('🛠️ Development mode active');
        console.log('💡 Use dencaDebug.triggerCounters() to test counters');
    }
    
    console.log('🏠 Index.js loaded successfully ✅');
});

// ==========================================================================
// CSS ANIMATIONS (inject if missing)
// ==========================================================================

const homepageCSS = `
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.in-view {
    animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.service-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-number {
    transition: all 0.3s ease;
}

@media (max-width: 768px) {
    .hero {
        background-attachment: scroll !important;
    }
}
`;

// Inject CSS if not already present
if (!document.getElementById('homepage-animations')) {
    const style = document.createElement('style');
    style.id = 'homepage-animations';
    style.textContent = homepageCSS;
    document.head.appendChild(style);
}