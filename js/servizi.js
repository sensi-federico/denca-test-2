/* ==========================================================================
   DENCA - SERVIZI.JS
   Service page interactions, process animations, service card expansions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // SERVICE CARDS INTERACTIONS
    // ==========================================================================
    
    function initializeServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        if (!serviceCards.length) return;
        
        // Staggered entrance animation
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) scale(0.9)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                            
                            // Animate service icon
                            const icon = entry.target.querySelector('.service-icon');
                            if (icon) {
                                setTimeout(() => {
                                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                                    setTimeout(() => {
                                        icon.style.transform = 'scale(1) rotate(0deg)';
                                    }, 400);
                                }, 300);
                            }
                            
                        }, index * 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(card);
        });
        
        // Enhanced hover and click interactions
        serviceCards.forEach(card => {
            let isExpanded = false;
            
            card.addEventListener('mouseenter', function() {
                if (!isExpanded) {
                    const icon = this.querySelector('.service-icon');
                    const header = this.querySelector('.service-header');
                    
                    this.style.transform = 'translateY(-15px) scale(1.02)';
                    this.style.boxShadow = '0 30px 60px rgba(0,0,0,0.2)';
                    
                    if (icon) {
                        icon.style.transform = 'scale(1.15) rotate(5deg)';
                    }
                    
                    if (header) {
                        header.style.background = 'linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%)';
                    }
                }
            });
            
            card.addEventListener('mouseleave', function() {
                if (!isExpanded) {
                    const icon = this.querySelector('.service-icon');
                    const header = this.querySelector('.service-header');
                    
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                    
                    if (icon) {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }
                    
                    if (header) {
                        header.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)';
                    }
                }
            });
            
            // Click to expand service card
            card.addEventListener('click', function() {
                toggleServiceCard(this);
            });
            
            // CTA button interaction
            const ctaButton = card.querySelector('.cta-button');
            if (ctaButton) {
                ctaButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent card expansion
                    
                    const serviceName = card.querySelector('h3')?.textContent;
                    
                    // Analytics tracking
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'service_cta_click', {
                            event_category: 'conversion',
                            event_label: serviceName
                        });
                    }
                    
                    // Animate button
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 150);
                    
                    console.log('💼 Service CTA clicked:', serviceName);
                });
            }
        });
        
        console.log('💼 Service cards initialized');
    }
    
    // ==========================================================================
    // SERVICE CARD EXPANSION
    // ==========================================================================
    
    function toggleServiceCard(card) {
        const isExpanded = card.classList.contains('expanded');
        
        // Close all other expanded cards
        const allCards = document.querySelectorAll('.service-card');
        allCards.forEach(otherCard => {
            if (otherCard !== card && otherCard.classList.contains('expanded')) {
                collapseServiceCard(otherCard);
            }
        });
        
        if (isExpanded) {
            collapseServiceCard(card);
        } else {
            expandServiceCard(card);
        }
    }
    
    function expandServiceCard(card) {
        card.classList.add('expanded');
        
        // Create expanded content
        const expandedContent = createExpandedContent(card);
        const serviceContent = card.querySelector('.service-content');
        
        if (serviceContent && !card.querySelector('.expanded-details')) {
            serviceContent.appendChild(expandedContent);
        }
        
        // Animate expansion
        card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'translateY(-20px) scale(1.05)';
        card.style.boxShadow = '0 40px 80px rgba(0,0,0,0.25)';
        card.style.zIndex = '10';
        
        // Animate expanded content
        setTimeout(() => {
            expandedContent.style.opacity = '1';
            expandedContent.style.maxHeight = '300px';
        }, 250);
        
        // Track expansion
        const serviceName = card.querySelector('h3')?.textContent;
        if (typeof gtag !== 'undefined') {
            gtag('event', 'service_expand', {
                event_category: 'engagement',
                event_label: serviceName
            });
        }
        
        console.log('📖 Service expanded:', serviceName);
    }
    
    function collapseServiceCard(card) {
        card.classList.remove('expanded');
        
        const expandedContent = card.querySelector('.expanded-details');
        if (expandedContent) {
            expandedContent.style.opacity = '0';
            expandedContent.style.maxHeight = '0';
            
            setTimeout(() => {
                expandedContent.remove();
            }, 300);
        }
        
        // Animate collapse
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        card.style.zIndex = '1';
    }
    
    function createExpandedContent(card) {
        const serviceName = card.querySelector('h3')?.textContent;
        let additionalInfo = '';
        
        // Service-specific additional content
        switch (serviceName) {
            case 'Impianti Fotovoltaici':
                additionalInfo = `
                    <div class="expanded-section">
                        <h4>🔧 Tecnologie Utilizzate</h4>
                        <p>Pannelli monocristallini, inverter di ultima generazione, sistemi di monitoraggio IoT.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>💰 Incentivi e Finanziamenti</h4>
                        <p>Gestione completa pratiche GSE, Superbonus 110%, Ecobonus, finanziamenti a tasso zero.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>⏱️ Tempi di Realizzazione</h4>
                        <p>Installazione standard: 1-2 giorni. Allaccio alla rete: 30-60 giorni dalle pratiche.</p>
                    </div>
                `;
                break;
                
            case 'Infissi':
                additionalInfo = `
                    <div class="expanded-section">
                        <h4>🪟 Materiali Premium</h4>
                        <p>PVC Rehau, Alluminio Schüco, Legno certificato FSC con ferramenta Siegenia.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>🔒 Sicurezza e Isolamento</h4>
                        <p>Vetri antisfondamento, chiusure multipunto, isolamento termico fino a Uw 0.8.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>🎨 Personalizzazione</h4>
                        <p>Oltre 50 colori disponibili, forme speciali, vetri decorativi e controllo solare.</p>
                    </div>
                `;
                break;
                
            case 'Edilizia Residenziale e Industriale':
                additionalInfo = `
                    <div class="expanded-section">
                        <h4>🏗️ Servizi Completi</h4>
                        <p>Progettazione, direzione lavori, pratiche edilizie, coordinamento sicurezza.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>🏢 Settori di Specializzazione</h4>
                        <p>Residential, industrial, commercial, healthcare, educational facilities.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>📋 Certificazioni</h4>
                        <p>SOA OS30 fino a €2.5M, qualificazione Anac, team certificato.</p>
                    </div>
                `;
                break;
                
            case 'Impermeabilizzazioni':
                additionalInfo = `
                    <div class="expanded-section">
                        <h4>🛡️ Sistemi Avanzati</h4>
                        <p>Membrane liquide, guaine bituminose, sistemi green roof, impermeabilizzazioni trasparenti.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>🔍 Diagnosi Specializzata</h4>
                        <p>Termografia, test di tenuta, analisi delle cause, progettazione mirata.</p>
                    </div>
                    <div class="expanded-section">
                        <h4>✅ Garanzie Estese</h4>
                        <p>Fino a 10 anni sui materiali, 5 anni sulla manodopera, assistenza h24.</p>
                    </div>
                `;
                break;
        }
        
        const expandedDiv = document.createElement('div');
        expandedDiv.className = 'expanded-details';
        expandedDiv.innerHTML = `
            <div class="expanded-content">
                ${additionalInfo}
                <div class="expanded-actions">
                    <button class="expanded-btn primary" onclick="requestQuote('${serviceName}')">
                        <i class="fas fa-calculator"></i> Richiedi Preventivo Dettagliato
                    </button>
                    <button class="expanded-btn secondary" onclick="downloadBrochure('${serviceName}')">
                        <i class="fas fa-download"></i> Scarica Brochure
                    </button>
                </div>
            </div>
        `;
        
        // Add styles for expanded content
        expandedDiv.style.cssText = `
            opacity: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
            margin-top: 1rem;
            border-top: 1px solid #eee;
            padding-top: 1rem;
        `;
        
        return expandedDiv;
    }
    
    // Global functions for expanded actions
    window.requestQuote = function(serviceName) {
        // Redirect to contact page with service reference
        const contactUrl = `contatti.html?service=${encodeURIComponent(serviceName)}`;
        window.location.href = contactUrl;
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'quote_request', {
                event_category: 'conversion',
                event_label: serviceName
            });
        }
    };
    
    window.downloadBrochure = function(serviceName) {
        // Simulate PDF download
        showNotification(`Brochure "${serviceName}" in preparazione. Ti invieremo il link via email.`, 'info');
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'brochure_download', {
                event_category: 'engagement',
                event_label: serviceName
            });
        }
        
        console.log('📄 Brochure requested:', serviceName);
    };
    
    // ==========================================================================
    // PROCESS STEPS ANIMATION
    // ==========================================================================
    
    function initializeProcessSteps() {
        const processSteps = document.querySelectorAll('.process-step');
        
        if (!processSteps.length) return;
        
        // Staggered entrance with connection lines
        processSteps.forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px) scale(0.9)';
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                            
                            // Animate step number
                            const stepNumber = entry.target.querySelector('.step-number');
                            if (stepNumber) {
                                setTimeout(() => {
                                    stepNumber.style.transform = 'scale(1.2)';
                                    stepNumber.style.background = 'var(--secondary-color)';
                                    setTimeout(() => {
                                        stepNumber.style.transform = 'scale(1)';
                                        stepNumber.style.background = 'var(--primary-color)';
                                    }, 300);
                                }, 200);
                            }
                            
                        }, index * 200);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(step);
        });
        
        // Enhanced hover interactions
        processSteps.forEach((step, index) => {
            step.addEventListener('mouseenter', function() {
                const stepNumber = this.querySelector('.step-number');
                
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.background = 'white';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1.15)';
                    stepNumber.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                }
                
                // Highlight next step
                const nextStep = processSteps[index + 1];
                if (nextStep) {
                    nextStep.style.opacity = '0.7';
                    nextStep.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });
            
            step.addEventListener('mouseleave', function() {
                const stepNumber = this.querySelector('.step-number');
                
                this.style.transform = 'translateY(0) scale(1)';
                this.style.background = 'var(--bg-light)';
                this.style.boxShadow = 'none';
                
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1)';
                    stepNumber.style.background = 'var(--primary-color)';
                }
                
                // Reset next step
                const nextStep = processSteps[index + 1];
                if (nextStep) {
                    nextStep.style.opacity = '1';
                    nextStep.style.transform = 'translateY(0) scale(1)';
                }
            });
            
            // Click to highlight process flow
            step.addEventListener('click', function() {
                highlightProcessFlow(index);
            });
        });
        
        console.log('⚙️ Process steps initialized');
    }
    
    function highlightProcessFlow(startIndex) {
        const processSteps = document.querySelectorAll('.process-step');
        
        // Reset all steps
        processSteps.forEach(step => {
            step.style.opacity = '0.3';
            step.style.transform = 'scale(0.95)';
        });
        
        // Highlight flow from clicked step
        for (let i = startIndex; i < processSteps.length; i++) {
            setTimeout(() => {
                processSteps[i].style.opacity = '1';
                processSteps[i].style.transform = 'scale(1.05)';
                processSteps[i].style.background = 'rgba(212, 144, 43, 0.1)';
                
                const stepNumber = processSteps[i].querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.background = 'var(--secondary-color)';
                }
                
                // Reset after animation
                setTimeout(() => {
                    processSteps[i].style.transform = 'scale(1)';
                    processSteps[i].style.background = 'var(--bg-light)';
                    
                    if (stepNumber) {
                        stepNumber.style.background = 'var(--primary-color)';
                    }
                }, 1000);
                
            }, (i - startIndex) * 300);
        }
        
        // Reset all steps after flow animation
        setTimeout(() => {
            processSteps.forEach(step => {
                step.style.opacity = '1';
                step.style.transform = 'scale(1)';
            });
        }, processSteps.length * 300 + 1000);
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'process_step_click', {
                event_category: 'engagement',
                event_label: `step_${startIndex + 1}`
            });
        }
    }
    
    // ==========================================================================
    // SERVICE COMPARISON TABLE
    // ==========================================================================
    
    function initializeServiceComparison() {
        // Create comparison table (if doesn't exist)
        const servicesSection = document.querySelector('.services-section');
        if (servicesSection && !document.querySelector('.service-comparison')) {
            createServiceComparisonTable();
        }
    }
    
    function createServiceComparisonTable() {
        const comparisonHTML = `
            <div class="service-comparison">
                <div class="section-title">
                    <h2>Confronto Servizi</h2>
                    <p>Tutte le informazioni principali sui nostri servizi a colpo d'occhio</p>
                </div>
                
                <div class="comparison-cards">
                    <div class="comparison-card">
                        <div class="comparison-icon">
                            <i class="fas fa-solar-panel"></i>
                        </div>
                        <h4>Impianti Fotovoltaici</h4>
                        <div class="comparison-details">
                            <div class="detail-item">
                                <span class="detail-label">⏱️ Durata:</span>
                                <span class="detail-value">1-3 giorni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">🛡️ Garanzia:</span>
                                <span class="detail-value">25 anni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">💰 Preventivo:</span>
                                <span class="detail-value highlight">Gratuito</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📋 Include:</span>
                                <span class="detail-value">Progetto + Installazione + Pratiche</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-card">
                        <div class="comparison-icon">
                            <i class="fas fa-window-maximize"></i>
                        </div>
                        <h4>Infissi</h4>
                        <div class="comparison-details">
                            <div class="detail-item">
                                <span class="detail-label">⏱️ Durata:</span>
                                <span class="detail-value">1 giorno</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">🛡️ Garanzia:</span>
                                <span class="detail-value">10 anni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">💰 Preventivo:</span>
                                <span class="detail-value highlight">Gratuito</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📋 Include:</span>
                                <span class="detail-value">Sopralluogo + Installazione + Smaltimento</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-card">
                        <div class="comparison-icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <h4>Edilizia</h4>
                        <div class="comparison-details">
                            <div class="detail-item">
                                <span class="detail-label">⏱️ Durata:</span>
                                <span class="detail-value">Variabile</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">🛡️ Garanzia:</span>
                                <span class="detail-value">10 anni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">💰 Preventivo:</span>
                                <span class="detail-value highlight">Gratuito</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📋 Include:</span>
                                <span class="detail-value">Progetto + Direzione Lavori + Pratiche</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="comparison-card">
                        <div class="comparison-icon">
                            <i class="fas fa-tint-slash"></i>
                        </div>
                        <h4>Impermeabilizzazioni</h4>
                        <div class="comparison-details">
                            <div class="detail-item">
                                <span class="detail-label">⏱️ Durata:</span>
                                <span class="detail-value">1-2 giorni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">🛡️ Garanzia:</span>
                                <span class="detail-value">10 anni</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">💰 Preventivo:</span>
                                <span class="detail-value highlight">Gratuito</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">📋 Include:</span>
                                <span class="detail-value">Diagnosi + Materiali + Installazione</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-cta">
                    <p>Non sai quale servizio fa per te? <strong>Contattaci per una consulenza gratuita!</strong></p>
                    <a href="contatti.html" class="comparison-btn">
                        <i class="fas fa-phone"></i> Richiedi Consulenza Gratuita
                    </a>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.services-section .container');
        if (container) {
            const comparisonDiv = document.createElement('div');
            comparisonDiv.innerHTML = comparisonHTML;
            container.appendChild(comparisonDiv);
            
            // Add comparison table styles
            addComparisonTableStyles();
            
            // Animate comparison cards
            const cards = document.querySelectorAll('.comparison-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    }
    
    // ==========================================================================
    // FLOATING ACTION BUTTON
    // ==========================================================================
    
    function initializeFloatingActions() {
        // Create floating action button for quick contact
        const fab = document.createElement('div');
        fab.className = 'floating-action-button';
        fab.innerHTML = `
            <button class="fab-main" onclick="toggleFabMenu()">
                <i class="fas fa-plus"></i>
            </button>
            <div class="fab-menu">
                <button class="fab-item" onclick="quickContact('phone')" title="Chiama">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="fab-item" onclick="quickContact('whatsapp')" title="WhatsApp">
                    <i class="fab fa-whatsapp"></i>
                </button>
                <button class="fab-item" onclick="quickContact('email')" title="Email">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="fab-item" onclick="quickContact('quote')" title="Preventivo">
                    <i class="fas fa-calculator"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(fab);
        addFloatingActionStyles();
        
        console.log('🎯 Floating action button initialized');
    }
    
    window.toggleFabMenu = function() {
        const fab = document.querySelector('.floating-action-button');
        const fabMain = fab.querySelector('.fab-main');
        const fabMenu = fab.querySelector('.fab-menu');
        
        fab.classList.toggle('active');
        
        if (fab.classList.contains('active')) {
            fabMain.innerHTML = '<i class="fas fa-times"></i>';
            fabMenu.style.opacity = '1';
            fabMenu.style.visibility = 'visible';
        } else {
            fabMain.innerHTML = '<i class="fas fa-plus"></i>';
            fabMenu.style.opacity = '0';
            fabMenu.style.visibility = 'hidden';
        }
    };
    
    window.quickContact = function(type) {
        switch (type) {
            case 'phone':
                window.location.href = 'tel:+390547123456';
                break;
            case 'whatsapp':
                window.open('https://wa.me/393331234567', '_blank');
                break;
            case 'email':
                window.location.href = 'mailto:info@denca.it';
                break;
            case 'quote':
                window.location.href = 'contatti.html#contactForm';
                break;
        }
        
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'fab_contact', {
                event_category: 'contact',
                event_label: type
            });
        }
        
        // Close FAB menu
        toggleFabMenu();
    };
    
    // ==========================================================================
    // SERVICE PAGE ANALYTICS
    // ==========================================================================
    
    function trackServicePageEngagement() {
        let serviceViewTime = {};
        
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            const serviceName = card.querySelector('h3')?.textContent;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        serviceViewTime[serviceName] = Date.now();
                    } else if (serviceViewTime[serviceName]) {
                        const timeSpent = Date.now() - serviceViewTime[serviceName];
                        
                        if (timeSpent > 3000) { // More than 3 seconds
                            if (typeof gtag !== 'undefined') {
                                gtag('event', 'service_engagement', {
                                    event_category: 'engagement',
                                    event_label: serviceName,
                                    value: Math.round(timeSpent / 1000)
                                });
                            }
                        }
                        
                        delete serviceViewTime[serviceName];
                    }
                });
            }, { threshold: 0.7 });
            
            observer.observe(card);
        });
    }
    
    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    function showNotification(message, type) {
        // Use notification system from common.js
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            console.log(message);
        }
    }
    
    function addComparisonTableStyles() {
        if (document.getElementById('comparison-table-styles')) return;
        
        const tableCSS = `
            .service-comparison {
                margin: 4rem 0;
                padding: 0;
                background: transparent;
            }
            
            .service-comparison .section-title {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .service-comparison .section-title h2 {
                font-size: clamp(2rem, 4vw, 2.5rem);
                color: var(--secondary-color);
                margin-bottom: 1rem;
                position: relative;
            }
            
            .service-comparison .section-title h2::after {
                content: '';
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 80px;
                height: 3px;
                background: var(--primary-color);
                border-radius: 2px;
            }
            
            .service-comparison .section-title p {
                font-size: 1.2rem;
                color: var(--text-light);
                max-width: 600px;
                margin: 0 auto;
            }
            
            .comparison-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 2rem;
                margin-bottom: 3rem;
            }
            
            .comparison-card {
                background: white;
                padding: 2rem;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                text-align: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .comparison-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                transform: scaleX(0);
                transition: all 0.3s ease;
            }
            
            .comparison-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            }
            
            .comparison-card:hover::before {
                transform: scaleX(1);
            }
            
            .comparison-icon {
                width: 80px;
                height: 80px;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1.5rem auto;
                color: white;
                font-size: 2rem;
                transition: all 0.3s ease;
            }
            
            .comparison-card:hover .comparison-icon {
                transform: scale(1.1) rotate(5deg);
            }
            
            .comparison-card h4 {
                font-size: 1.3rem;
                color: var(--secondary-color);
                margin-bottom: 1.5rem;
                font-weight: 600;
            }
            
            .comparison-details {
                text-align: left;
            }
            
            .detail-item {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1rem;
                padding: 0.8rem 0;
                border-bottom: 1px solid rgba(0,0,0,0.05);
            }
            
            .detail-item:last-child {
                border-bottom: none;
            }
            
            .detail-label {
                font-weight: 600;
                color: var(--secondary-color);
                font-size: 0.9rem;
                flex-shrink: 0;
                margin-right: 1rem;
            }
            
            .detail-value {
                color: var(--text-light);
                font-size: 0.9rem;
                text-align: right;
                line-height: 1.4;
            }
            
            .detail-value.highlight {
                background: var(--primary-color);
                color: white;
                padding: 0.3rem 0.8rem;
                border-radius: 15px;
                font-weight: 600;
                font-size: 0.8rem;
            }
            
            .comparison-cta {
                text-align: center;
                background: linear-gradient(135deg, var(--bg-light) 0%, #e9ecef 100%);
                padding: 2.5rem;
                border-radius: 20px;
                margin-top: 2rem;
            }
            
            .comparison-cta p {
                font-size: 1.2rem;
                color: var(--text-light);
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            .comparison-cta strong {
                color: var(--secondary-color);
            }
            
            .comparison-btn {
                display: inline-block;
                background: var(--primary-color);
                color: white;
                padding: 1rem 2rem;
                text-decoration: none;
                border-radius: 50px;
                font-weight: 600;
                font-size: 1.1rem;
                transition: all 0.3s ease;
                box-shadow: 0 5px 15px rgba(212, 144, 43, 0.3);
            }
            
            .comparison-btn:hover {
                background: var(--secondary-color);
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
                text-decoration: none;
                color: white;
            }
            
            @media (max-width: 768px) {
                .comparison-cards {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                .comparison-card {
                    padding: 1.5rem;
                }
                
                .comparison-icon {
                    width: 60px;
                    height: 60px;
                    font-size: 1.5rem;
                }
                
                .detail-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
                
                .detail-label {
                    margin-right: 0;
                }
                
                .detail-value {
                    text-align: left;
                }
                
                .comparison-cta {
                    padding: 2rem 1.5rem;
                }
                
                .comparison-cta p {
                    font-size: 1.1rem;
                }
            }
            
            @media (max-width: 480px) {
                .comparison-card {
                    padding: 1.2rem;
                }
                
                .comparison-card h4 {
                    font-size: 1.1rem;
                }
                
                .detail-label,
                .detail-value {
                    font-size: 0.85rem;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'comparison-table-styles';
        style.textContent = tableCSS;
        document.head.appendChild(style);
    }
    
    function addFloatingActionStyles() {
        if (document.getElementById('fab-styles')) return;
        
        const fabCSS = `
            .floating-action-button {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                z-index: 1000;
            }
            
            .fab-main {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                box-shadow: 0 8px 25px rgba(212, 144, 43, 0.4);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .fab-main:hover {
                transform: scale(1.1);
                box-shadow: 0 12px 35px rgba(212, 144, 43, 0.6);
            }
            
            .fab-menu {
                position: absolute;
                bottom: 70px;
                right: 0;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .fab-item {
                display: block;
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: var(--secondary-color);
                border: none;
                color: white;
                margin-bottom: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .fab-item:hover {
                background: var(--primary-color);
                transform: scale(1.1);
            }
            
            @media (max-width: 768px) {
                .floating-action-button {
                    bottom: 1rem;
                    right: 1rem;
                }
                
                .fab-main {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
                
                .fab-item {
                    width: 40px;
                    height: 40px;
                    font-size: 0.9rem;
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'fab-styles';
        style.textContent = fabCSS;
        document.head.appendChild(style);
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    function initializeServicesPage() {
        console.log('🛠️ Initializing services page...');
        
        // Core functionality
        initializeServiceCards();
        initializeProcessSteps();
        initializeServiceComparison();
        initializeFloatingActions();
        
        // Analytics and tracking
        trackServicePageEngagement();
        
        console.log('✅ Services page initialized successfully');
    }
    
    // Start everything
    initializeServicesPage();
    
    // Add service page specific CSS
    const servicePageCSS = `
        .expanded-details {
            border-top: 1px solid rgba(212, 144, 43, 0.2);
            margin-top: 1rem;
            padding-top: 1rem;
        }
        
        .expanded-section {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(248, 249, 250, 0.5);
            border-radius: 8px;
            border-left: 3px solid var(--primary-color);
        }
        
        .expanded-section h4 {
            color: var(--secondary-color);
            margin-bottom: 0.5rem;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .expanded-section p {
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0;
        }
        
        .expanded-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            flex-wrap: wrap;
        }
        
        .expanded-btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .expanded-btn.primary {
            background: var(--primary-color);
            color: white;
        }
        
        .expanded-btn.primary:hover {
            background: var(--secondary-color);
            transform: translateY(-2px);
        }
        
        .expanded-btn.secondary {
            background: var(--bg-light);
            color: var(--secondary-color);
            border: 1px solid var(--primary-color);
        }
        
        .expanded-btn.secondary:hover {
            background: var(--primary-color);
            color: white;
            transform: translateY(-2px);
        }
        
        .service-card.expanded {
            position: relative;
            z-index: 10;
        }
        
        .process-step {
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .step-number {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 768px) {
            .expanded-actions {
                flex-direction: column;
            }
            
            .expanded-btn {
                width: 100%;
                justify-content: center;
            }
            
            .service-card.expanded {
                transform: translateY(-10px) scale(1.02) !important;
            }
        }
    `;
    
    if (!document.getElementById('services-page-styles')) {
        const style = document.createElement('style');
        style.id = 'services-page-styles';
        style.textContent = servicePageCSS;
        document.head.appendChild(style);
    }
    
    console.log('🛠️ Servizi.js loaded successfully ✅');
    console.log('💼 Service cards expansion ready');
    console.log('⚙️ Process flow animations ready');
    console.log('🎯 Floating action button active');
    
});

// ==========================================================================
// EXPORT FOR TESTING
// ==========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleServiceCard,
        expandServiceCard,
        collapseServiceCard,
        highlightProcessFlow
    };
}