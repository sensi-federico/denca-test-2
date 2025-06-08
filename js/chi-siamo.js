/* ==========================================================================
   DENCA - CHI-SIAMO.JS
   Timeline animations, team interactions, achievement counters
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // TIMELINE ANIMATIONS
    // ==========================================================================
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    let timelineAnimated = false;
    
    function initializeTimeline() {
        if (!timelineItems.length) return;
        
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;
        
        // Animate timeline line
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !timelineAnimated) {
                    timelineAnimated = true;
                    animateTimelineLine();
                    animateTimelineItems();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observer.observe(timeline);
        
        console.log('📅 Timeline animations initialized');
    }
    
    function animateTimelineLine() {
        const timelineLine = document.querySelector('.timeline::before');
        const timeline = document.querySelector('.timeline');
        
        if (timeline) {
            // Animate the timeline line growing
            const style = document.createElement('style');
            style.textContent = `
                .timeline::before {
                    animation: growTimeline 2s ease-out forwards;
                }
                
                @keyframes growTimeline {
                    from { height: 0; }
                    to { height: 100%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function animateTimelineItems() {
        timelineItems.forEach((item, index) => {
            // Hide items initially
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                
                // Animate the timeline icon
                const icon = item.querySelector('.timeline-icon');
                if (icon) {
                    setTimeout(() => {
                        icon.style.transform = 'translateX(-50%) scale(1.2)';
                        setTimeout(() => {
                            icon.style.transform = 'translateX(-50%) scale(1)';
                        }, 200);
                    }, 300);
                }
                
                // Add pulse effect to year badge
                const yearBadge = item.querySelector('::before');
                if (item) {
                    item.classList.add('timeline-item-animated');
                }
                
            }, index * 400 + 500); // Stagger with timeline line animation
        });
    }
    
    // Enhanced timeline item interactions
    function initializeTimelineInteractions() {
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.timeline-icon');
                const content = this.querySelector('.timeline-content');
                
                if (icon) {
                    icon.style.transform = 'translateX(-50%) scale(1.15) rotate(5deg)';
                    icon.style.background = 'var(--secondary-color)';
                    icon.style.color = 'white';
                }
                
                if (content) {
                    content.style.transform = 'translateX(10px)';
                }
                
                this.style.background = 'rgba(212, 144, 43, 0.05)';
                this.style.borderRadius = '15px';
                this.style.padding = '1rem';
                this.style.margin = '0 -1rem 3rem -1rem';
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.timeline-icon');
                const content = this.querySelector('.timeline-content');
                
                if (icon) {
                    icon.style.transform = 'translateX(-50%) scale(1) rotate(0deg)';
                    icon.style.background = 'white';
                    icon.style.color = 'var(--primary-color)';
                }
                
                if (content) {
                    content.style.transform = 'translateX(0)';
                }
                
                this.style.background = 'transparent';
                this.style.padding = '0';
                this.style.margin = '0 0 3rem 0';
            });
        });
    }
    
    // ==========================================================================
    // TEAM MEMBERS INTERACTIONS
    // ==========================================================================
    
    function initializeTeamMembers() {
        const teamMembers = document.querySelectorAll('.team-member');
        
        if (!teamMembers.length) return;
        
        // Staggered entrance animation
        teamMembers.forEach((member, index) => {
            member.style.opacity = '0';
            member.style.transform = 'translateY(30px) scale(0.9)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(member);
        });
        
        // Enhanced hover effects
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', function() {
                const photo = this.querySelector('.member-photo');
                const info = this.querySelector('.member-info');
                const expertiseTags = this.querySelectorAll('.expertise-tag');
                
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                
                if (photo) {
                    photo.style.transform = 'scale(1.05)';
                }
                
                if (info) {
                    info.style.background = 'linear-gradient(135deg, rgba(212, 144, 43, 0.05) 0%, rgba(44, 62, 80, 0.05) 100%)';
                }
                
                // Animate expertise tags
                expertiseTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.transform = 'scale(1.1)';
                        tag.style.background = 'var(--secondary-color)';
                    }, index * 100);
                });
            });
            
            member.addEventListener('mouseleave', function() {
                const photo = this.querySelector('.member-photo');
                const info = this.querySelector('.member-info');
                const expertiseTags = this.querySelectorAll('.expertise-tag');
                
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                
                if (photo) {
                    photo.style.transform = 'scale(1)';
                }
                
                if (info) {
                    info.style.background = 'transparent';
                }
                
                // Reset expertise tags
                expertiseTags.forEach(tag => {
                    tag.style.transform = 'scale(1)';
                    tag.style.background = 'var(--primary-color)';
                });
            });
            
            // Click to show member details (future enhancement)
            member.addEventListener('click', function() {
                const memberName = this.querySelector('h3')?.textContent;
                const memberRole = this.querySelector('.member-role')?.textContent;
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'team_member_click', {
                        event_category: 'engagement',
                        event_label: memberName,
                        member_role: memberRole
                    });
                }
                
                console.log('👤 Team member clicked:', memberName);
                
                // Future: Open team member detail modal
                // showTeamMemberModal(this);
            });
        });
        
        console.log('👥 Team interactions initialized');
    }
    
    // ==========================================================================
    // ACHIEVEMENT COUNTERS
    // ==========================================================================
    
    const achievementCards = document.querySelectorAll('.achievement-card');
    let achievementsAnimated = false;
    
    function initializeAchievementCounters() {
        if (!achievementCards.length) return;
        
        const achievementsSection = document.querySelector('.achievements-section');
        if (!achievementsSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !achievementsAnimated) {
                    achievementsAnimated = true;
                    animateAchievementCards();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(achievementsSection);
    }
    
    function animateAchievementCards() {
        achievementCards.forEach((card, index) => {
            // Initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.8)';
            
            setTimeout(() => {
                // Entrance animation
                card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
                
                // Start counter animation after entrance
                setTimeout(() => {
                    animateAchievementCounter(card);
                }, 300);
                
            }, index * 150);
        });
    }
    
    function animateAchievementCounter(card) {
        const numberElement = card.querySelector('.achievement-number');
        if (!numberElement) return;
        
        const targetValue = parseInt(numberElement.getAttribute('data-target'));
        if (isNaN(targetValue)) return;
        
        const originalText = numberElement.textContent;
        const hasPlus = originalText.includes('+');
        const hasPercent = originalText.includes('%');
        
        const duration = 2500; // 2.5 seconds
        const steps = 60;
        const stepValue = targetValue / steps;
        const stepDuration = duration / steps;
        
        let currentValue = 0;
        numberElement.textContent = '0';
        
        const counterInterval = setInterval(() => {
            currentValue += stepValue;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(counterInterval);
                
                // Final celebration animation
                numberElement.style.transform = 'scale(1.2)';
                numberElement.style.color = 'var(--secondary-color)';
                setTimeout(() => {
                    numberElement.style.transform = 'scale(1)';
                    numberElement.style.color = 'var(--primary-color)';
                }, 300);
            }
            
            let displayValue = Math.floor(currentValue);
            
            // Format based on original text
            if (hasPlus) {
                numberElement.textContent = displayValue + '+';
            } else if (hasPercent) {
                numberElement.textContent = displayValue + '%';
            } else {
                numberElement.textContent = displayValue;
            }
            
            // Subtle pulse during animation
            const scale = 1 + (Math.sin(currentValue / targetValue * Math.PI) * 0.05);
            numberElement.style.transform = `scale(${scale})`;
            
        }, stepDuration);
    }
    
    // ==========================================================================
    // MISSION & VALUES ANIMATIONS
    // ==========================================================================
    
    function initializeMissionCards() {
        const missionCards = document.querySelectorAll('.mission-card');
        
        if (!missionCards.length) return;
        
        missionCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            
                            // Animate mission icon
                            const icon = entry.target.querySelector('.mission-icon');
                            if (icon) {
                                setTimeout(() => {
                                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                                    setTimeout(() => {
                                        icon.style.transform = 'scale(1) rotate(0deg)';
                                    }, 300);
                                }, 200);
                            }
                            
                        }, index * 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(card);
        });
        
        // Enhanced hover interactions
        missionCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.mission-icon');
                
                this.style.transform = 'translateY(-15px) scale(1.02)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.15)';
                
                if (icon) {
                    icon.style.transform = 'scale(1.15) rotate(10deg)';
                    icon.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--primary-color))';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.mission-icon');
                
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                    icon.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                }
            });
        });
        
        console.log('🎯 Mission cards initialized');
    }
    
    // ==========================================================================
    // CERTIFICATIONS ANIMATIONS
    // ==========================================================================
    
    function initializeCertifications() {
        const certItems = document.querySelectorAll('.cert-item');
        const partnerItems = document.querySelectorAll('.partner-item');
        
        // Animate certifications
        certItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(item);
        });
        
        // Animate partners
        partnerItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(30px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateX(0)';
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(item);
        });
        
        console.log('🏆 Certifications animations initialized');
    }
    
    // ==========================================================================
    // PAGE SCROLL PROGRESS
    // ==========================================================================
    
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
        
        // Add styles
        const progressCSS = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(212, 144, 43, 0.2);
                z-index: 1001;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .scroll-progress.visible {
                opacity: 1;
            }
            
            .scroll-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        
        if (!document.getElementById('scroll-progress-css')) {
            const style = document.createElement('style');
            style.id = 'scroll-progress-css';
            style.textContent = progressCSS;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            const fill = progressBar.querySelector('.scroll-progress-fill');
            fill.style.width = scrollPercent + '%';
            
            // Show/hide based on scroll
            if (scrollTop > 100) {
                progressBar.classList.add('visible');
            } else {
                progressBar.classList.remove('visible');
            }
        }, 10));
    }
    
    // ==========================================================================
    // INTERACTIVE STORY TELLING
    // ==========================================================================
    
    function initializeStoryTelling() {
        const storyParagraphs = document.querySelectorAll('.story-paragraph');
        
        storyParagraphs.forEach((paragraph, index) => {
            paragraph.style.opacity = '0';
            paragraph.style.transform = 'translateY(20px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.8s ease-out';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            
                            // Highlight the paragraph briefly
                            entry.target.style.background = 'rgba(212, 144, 43, 0.05)';
                            entry.target.style.padding = '1rem';
                            entry.target.style.borderRadius = '10px';
                            entry.target.style.borderLeft = '4px solid var(--primary-color)';
                            
                            setTimeout(() => {
                                entry.target.style.background = 'transparent';
                                entry.target.style.padding = '0';
                                entry.target.style.borderLeft = 'none';
                            }, 2000);
                            
                        }, index * 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.6 });
            
            observer.observe(paragraph);
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
    
    // ==========================================================================
    // MOBILE OPTIMIZATIONS
    // ==========================================================================
    
    function initializeMobileOptimizations() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Reduce animation complexity on mobile
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                item.addEventListener('touchstart', function() {
                    this.style.background = 'rgba(212, 144, 43, 0.05)';
                });
                
                item.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.background = 'transparent';
                    }, 200);
                });
            });
            
            // Simplified team member interactions
            const teamMembers = document.querySelectorAll('.team-member');
            teamMembers.forEach(member => {
                member.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                });
                
                member.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        }
    }
    
    // ==========================================================================
    // ANALYTICS TRACKING
    // ==========================================================================
    
    function trackPageEngagement() {
        // Track section viewing
        const sections = document.querySelectorAll('.story-section, .mission-section, .team-section, .achievements-section, .certifications-section');
        
        sections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionName = entry.target.className.split('-')[0];
                        
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'section_view', {
                                event_category: 'about_page',
                                event_label: sectionName
                            });
                        }
                        
                        console.log('📊 Section viewed:', sectionName);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(section);
        });
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function initializeChiSiamoPage() {
        console.log('👥 Initializing Chi Siamo page...');
        
        // Core animations
        initializeTimeline();
        initializeTimelineInteractions();
        initializeTeamMembers();
        initializeAchievementCounters();
        initializeMissionCards();
        initializeCertifications();
        
        // Enhanced features
        initializeScrollProgress();
        initializeStoryTelling();
        initializeMobileOptimizations();
        trackPageEngagement();
        
        console.log('✅ Chi Siamo page initialized successfully');
    }
    
    // Start everything
    initializeChiSiamoPage();
    
    // Add timeline animation CSS
    const timelineCSS = `
        .timeline-item-animated::before {
            animation: pulseBadge 0.6s ease-out;
        }
        
        @keyframes pulseBadge {
            0% { transform: translateX(-50%) scale(1); }
            50% { transform: translateX(-50%) scale(1.2); }
            100% { transform: translateX(-50%) scale(1); }
        }
        
        .timeline-item {
            transition: all 0.3s ease;
        }
        
        .timeline-icon {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .timeline-content {
            transition: all 0.3s ease;
        }
        
        .member-photo {
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .member-info {
            transition: all 0.3s ease;
        }
        
        .expertise-tag {
            transition: all 0.3s ease;
        }
        
        .mission-icon {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .achievement-number {
            transition: all 0.3s ease;
        }
    `;
    
    if (!document.getElementById('chi-siamo-animations')) {
        const style = document.createElement('style');
        style.id = 'chi-siamo-animations';
        style.textContent = timelineCSS;
        document.head.appendChild(style);
    }
    
    console.log('👥 Chi-siamo.js loaded successfully ✅');
    console.log('📅 Timeline animations ready');
    console.log('🏆 Achievement counters ready');
    console.log('👤 Team interactions ready');
    
});

// ==========================================================================
// EXPORT FOR TESTING
// ==========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animateTimelineItems,
        animateAchievementCounter,
        initializeTeamMembers
    };
}