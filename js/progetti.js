/* ==========================================================================
   DENCA - PROGETTI.JS
   Portfolio filtri, gallery interattiva, e animazioni progetti
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // PORTFOLIO FILTER SYSTEM
    // ==========================================================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projectsGrid');
    
    let currentFilter = 'all';
    let isFiltering = false;
    
    function initializeFilters() {
        if (!filterButtons.length || !projectCards.length) return;
        
        // Add click listeners to filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                if (filter !== currentFilter && !isFiltering) {
                    handleFilterChange(filter, this);
                }
            });
        });
        
        // Initialize with fade-in animation
        animateProjectsEntrance();
        
        console.log('🎯 Portfolio filters initialized');
    }
    
    async function handleFilterChange(newFilter, clickedButton) {
        if (isFiltering) return;
        
        isFiltering = true;
        currentFilter = newFilter;
        
        // Update active button
        updateActiveButton(clickedButton);
        
        // Show filtering state
        if (projectsGrid) {
            projectsGrid.classList.add('filtering');
        }
        
        // Animate out current projects
        await animateProjectsOut();
        
        // Filter projects
        filterProjects(newFilter);
        
        // Animate in filtered projects
        await animateProjectsIn();
        
        // Remove filtering state
        if (projectsGrid) {
            projectsGrid.classList.remove('filtering');
        }
        
        // Track filter usage
        trackFilterUsage(newFilter);
        
        isFiltering = false;
        
        console.log('📂 Filter applied:', newFilter);
    }
    
    function updateActiveButton(activeButton) {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    function filterProjects(filter) {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
    }
    
    // ==========================================================================
    // ANIMATION FUNCTIONS
    // ==========================================================================
    
    function animateProjectsEntrance() {
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.9)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 100);
        });
    }
    
    function animateProjectsOut() {
        return new Promise((resolve) => {
            const visibleCards = Array.from(projectCards).filter(card => 
                !card.classList.contains('hidden')
            );
            
            if (visibleCards.length === 0) {
                resolve();
                return;
            }
            
            visibleCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.3s ease-out';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px) scale(0.9)';
                }, index * 50);
            });
            
            // Wait for all animations to complete
            setTimeout(resolve, visibleCards.length * 50 + 300);
        });
    }
    
    function animateProjectsIn() {
        return new Promise((resolve) => {
            const visibleCards = Array.from(projectCards).filter(card => 
                !card.classList.contains('hidden')
            );
            
            if (visibleCards.length === 0) {
                resolve();
                return;
            }
            
            visibleCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, index * 100);
            });
            
            // Wait for all animations to complete
            setTimeout(resolve, visibleCards.length * 100 + 600);
        });
    }
    
    // ==========================================================================
    // PROJECT CARD INTERACTIONS
    // ==========================================================================
    
    function initializeProjectCards() {
        projectCards.forEach(card => {
            // Enhanced hover effects
            card.addEventListener('mouseenter', function() {
                const overlay = this.querySelector('.project-overlay');
                const image = this.querySelector('.project-image img, .image-placeholder');
                
                if (overlay) {
                    overlay.style.opacity = '1';
                }
                
                if (image) {
                    image.style.transform = 'scale(1.1)';
                }
                
                this.style.transform = 'translateY(-15px)';
                this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
            });
            
            card.addEventListener('mouseleave', function() {
                const overlay = this.querySelector('.project-overlay');
                const image = this.querySelector('.project-image img, .image-placeholder');
                
                if (overlay) {
                    overlay.style.opacity = '0';
                }
                
                if (image) {
                    image.style.transform = 'scale(1)';
                }
                
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
            
            // Click handler for project details
            const viewButton = card.querySelector('.view-project');
            if (viewButton) {
                viewButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    openProjectModal(card);
                });
            }
            
            // Click tracking
            card.addEventListener('click', function() {
                const projectTitle = this.querySelector('.project-title')?.textContent;
                const projectCategory = this.getAttribute('data-category');
                
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'project_view', {
                        event_category: 'portfolio',
                        event_label: projectTitle,
                        project_category: projectCategory
                    });
                }
                
                console.log('🏗️ Project viewed:', projectTitle);
            });
        });
    }
    
    // ==========================================================================
    // PROJECT MODAL/LIGHTBOX
    // ==========================================================================
    
    function openProjectModal(projectCard) {
        const projectData = extractProjectData(projectCard);
        createProjectModal(projectData);
    }
    
    function extractProjectData(card) {
        return {
            title: card.querySelector('.project-title')?.textContent || 'Progetto',
            category: card.querySelector('.project-category')?.textContent || '',
            location: card.querySelector('.project-location')?.textContent || '',
            description: card.querySelector('.project-description')?.textContent || '',
            year: card.querySelector('.project-year')?.textContent || '',
            specs: Array.from(card.querySelectorAll('.project-spec')).map(spec => spec.textContent),
            image: card.querySelector('.image-placeholder')?.innerHTML || ''
        };
    }
    
    function createProjectModal(data) {
        // Remove existing modal
        const existingModal = document.getElementById('projectModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'projectModal';
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeProjectModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeProjectModal()">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-body">
                    <div class="modal-image">
                        <div class="image-placeholder">
                            ${data.image}
                        </div>
                    </div>
                    
                    <div class="modal-info">
                        <div class="modal-header">
                            <span class="modal-category">${data.category}</span>
                            <h2 class="modal-title">${data.title}</h2>
                            <p class="modal-location">
                                <i class="fas fa-map-marker-alt"></i> ${data.location}
                            </p>
                        </div>
                        
                        <div class="modal-description">
                            <p>${data.description}</p>
                        </div>
                        
                        <div class="modal-specs">
                            <h4>Dettagli Tecnici:</h4>
                            <ul>
                                ${data.specs.map(spec => `<li>${spec}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="modal-footer">
                            <span class="modal-year">${data.year}</span>
                            <div class="modal-actions">
                                <button class="modal-btn contact-btn" onclick="contactForProject('${data.title}')">
                                    <i class="fas fa-envelope"></i> Contattaci per un progetto simile
                                </button>
                                <button class="modal-btn share-btn" onclick="shareProject('${data.title}')">
                                    <i class="fas fa-share-alt"></i> Condividi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        addModalStyles();
        
        // Add to page
        document.body.appendChild(modal);
        
        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Track modal open
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_modal_open', {
                event_category: 'engagement',
                event_label: data.title
            });
        }
    }
    
    window.closeProjectModal = function() {
        const modal = document.getElementById('projectModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.remove();
        }, 300);
    };
    
    window.contactForProject = function(projectTitle) {
        // Redirect to contact page with project reference
        const contactUrl = `contatti.html?ref=${encodeURIComponent(projectTitle)}`;
        window.location.href = contactUrl;
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_from_project', {
                event_category: 'conversion',
                event_label: projectTitle
            });
        }
    };
    
    window.shareProject = function(projectTitle) {
        if (navigator.share) {
            navigator.share({
                title: `Progetto Denca: ${projectTitle}`,
                text: `Guarda questo progetto realizzato da Denca: ${projectTitle}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copiato negli appunti!', 'success');
            });
        }
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_share', {
                event_category: 'engagement',
                event_label: projectTitle
            });
        }
    };
    
    // ==========================================================================
    // TESTIMONIALS CAROUSEL
    // ==========================================================================
    
    function initializeTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length === 0) return;
        
        // Staggered entrance animation
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s ease-out';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(card);
        });
        
        // Enhanced hover effects
        testimonialCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            });
        });
    }
    
    // ==========================================================================
    // FEATURED PROJECT INTERACTIONS
    // ==========================================================================
    
    function initializeFeaturedProject() {
        const featuredProject = document.querySelector('.featured-project');
        const featuredCTA = document.querySelector('.featured-cta');
        
        if (!featuredProject) return;
        
        // RIMOSSO: Parallax effect che causava problemi di posizionamento
        // const featuredImage = featuredProject.querySelector('.featured-image');
        // if (featuredImage) {
        //     window.addEventListener('scroll', throttle(() => {
        //         const rect = featuredProject.getBoundingClientRect();
        //         const scrolled = window.pageYOffset;
        //         const rate = scrolled * -0.2;
        //         
        //         if (rect.top < window.innerHeight && rect.bottom > 0) {
        //             featuredImage.style.transform = `translateY(${rate}px)`;
        //         }
        //     }, 16));
        // }
        
        // CTA button enhancement
        if (featuredCTA) {
            featuredCTA.addEventListener('click', function() {
                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'featured_project_cta', {
                        event_category: 'engagement',
                        event_label: 'case_study_view'
                    });
                }
            });
        }
    }
    
    // ==========================================================================
    // LAZY LOADING SIMULATION
    // ==========================================================================
    
    function initializeLazyLoading() {
        const imageContainers = document.querySelectorAll('.project-image, .featured-image');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const container = entry.target;
                    
                    // Simulate loading
                    setTimeout(() => {
                        container.classList.add('loaded');
                        
                        // Add loaded animation
                        const placeholder = container.querySelector('.image-placeholder');
                        if (placeholder) {
                            placeholder.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)';
                        }
                    }, Math.random() * 1000 + 500);
                    
                    imageObserver.unobserve(container);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px 0px'
        });
        
        imageContainers.forEach(container => {
            imageObserver.observe(container);
        });
    }
    
    // ==========================================================================
    // PORTFOLIO ANALYTICS
    // ==========================================================================
    
    function trackFilterUsage(filter) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_filter', {
                event_category: 'portfolio',
                event_label: filter,
                filter_type: filter
            });
        }
        
        console.log('📊 Filter tracked:', filter);
    }
    
    function trackPortfolioEngagement() {
        // Track time spent on portfolio section
        const portfolioSection = document.querySelector('.projects-section');
        if (!portfolioSection) return;
        
        let startTime;
        
        const portfolioObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTime = Date.now();
                } else if (startTime) {
                    const timeSpent = Date.now() - startTime;
                    
                    if (timeSpent > 5000) { // More than 5 seconds
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'portfolio_engagement', {
                                event_category: 'engagement',
                                event_label: 'time_spent',
                                value: Math.round(timeSpent / 1000)
                            });
                        }
                    }
                    
                    startTime = null;
                }
            });
        }, { threshold: 0.5 });
        
        portfolioObserver.observe(portfolioSection);
    }
    
    // ==========================================================================
    // KEYBOARD NAVIGATION
    // ==========================================================================
    
    function initializeKeyboardNavigation() {
        let focusedIndex = 0;
        const focusableCards = Array.from(projectCards).filter(card => 
            !card.classList.contains('hidden')
        );
        
        document.addEventListener('keydown', function(e) {
            if (document.getElementById('projectModal')) {
                // Modal is open
                if (e.key === 'Escape') {
                    closeProjectModal();
                }
                return;
            }
            
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return; // Don't interfere with form inputs
            }
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    focusedIndex = Math.min(focusedIndex + 1, focusableCards.length - 1);
                    focusableCards[focusedIndex]?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    focusedIndex = Math.max(focusedIndex - 1, 0);
                    focusableCards[focusedIndex]?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    break;
                    
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (focusableCards[focusedIndex]) {
                        openProjectModal(focusableCards[focusedIndex]);
                    }
                    break;
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
    
    function showNotification(message, type) {
        // Use notification system from common.js
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(message);
        }
    }
    
    // ==========================================================================
    // MODAL STYLES
    // ==========================================================================
    
    function addModalStyles() {
        if (document.getElementById('project-modal-styles')) return;
        
        const modalCSS = `
            .project-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .project-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: relative;
                max-width: 1000px;
                margin: 50px auto;
                background: white;
                border-radius: 20px;
                overflow: hidden;
                transform: translateY(-50px) scale(0.9);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }
            
            .project-modal.active .modal-content {
                transform: translateY(0) scale(1);
            }
            
            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: white;
                transform: scale(1.1);
            }
            
            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                min-height: 400px;
            }
            
            .modal-image {
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-info {
                padding: 2rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .modal-category {
                background: var(--primary-color);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                display: inline-block;
                margin-bottom: 1rem;
            }
            
            .modal-title {
                font-size: 1.5rem;
                color: var(--secondary-color);
                margin-bottom: 0.5rem;
            }
            
            .modal-location {
                color: var(--text-light);
                margin-bottom: 1.5rem;
            }
            
            .modal-description {
                margin-bottom: 1.5rem;
                line-height: 1.6;
                color: var(--text-light);
            }
            
            .modal-specs h4 {
                color: var(--secondary-color);
                margin-bottom: 0.5rem;
            }
            
            .modal-specs ul {
                list-style: none;
                padding: 0;
            }
            
            .modal-specs li {
                padding: 0.3rem 0;
                color: var(--text-light);
                font-size: 0.9rem;
            }
            
            .modal-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 2rem;
                padding-top: 1rem;
                border-top: 1px solid #eee;
            }
            
            .modal-year {
                background: var(--bg-light);
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: 600;
                color: var(--secondary-color);
            }
            
            .modal-actions {
                display: flex;
                gap: 0.5rem;
            }
            
            .modal-btn {
                padding: 0.6rem 1rem;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-size: 0.85rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .contact-btn {
                background: var(--primary-color);
                color: white;
            }
            
            .contact-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-2px);
            }
            
            .share-btn {
                background: var(--bg-light);
                color: var(--secondary-color);
            }
            
            .share-btn:hover {
                background: var(--secondary-color);
                color: white;
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    margin: 20px;
                    max-width: calc(100% - 40px);
                }
                
                .modal-body {
                    grid-template-columns: 1fr;
                }
                
                .modal-image {
                    height: 200px;
                }
                
                .modal-actions {
                    flex-direction: column;
                    width: 100%;
                }
                
                .modal-footer {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'project-modal-styles';
        style.textContent = modalCSS;
        document.head.appendChild(style);
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function initializeProjectsPage() {
        console.log('🎨 Initializing projects page...');
        
        // Core functionality
        initializeFilters();
        initializeProjectCards();
        initializeTestimonials();
        initializeFeaturedProject();
        initializeLazyLoading();
        
        // Enhanced features
        trackPortfolioEngagement();
        initializeKeyboardNavigation();
        
        console.log('✅ Projects page initialized successfully');
    }
    
    // Start everything
    initializeProjectsPage();
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('projectModal')) {
            closeProjectModal();
        }
    });
    
    console.log('🎨 Progetti.js loaded successfully ✅');
    console.log('🔍 Portfolio filters ready');
    console.log('🖼️ Project modal system active');
    
});

// ==========================================================================
// EXPORT FOR TESTING
// ==========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterProjects,
        openProjectModal,
        closeProjectModal
    };
}