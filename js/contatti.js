/* ==========================================================================
   DENCA - CONTATTI.JS
   Form validation, invio contatti e gestione interazioni pagina contatti
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================================================
    // FORM VALIDATION & SUBMISSION
    // ==========================================================================
    
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        // Form submission handler
        contactForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Privacy checkbox validation
        const privacyCheckbox = document.getElementById('privacy');
        if (privacyCheckbox) {
            privacyCheckbox.addEventListener('change', validatePrivacyCheckbox);
        }
    }
    
    // ==========================================================================
    // FORM SUBMISSION HANDLER
    // ==========================================================================
    
    async function handleFormSubmission(event) {
        event.preventDefault();
        
        // Validate all fields
        const isValid = validateForm();
        if (!isValid) {
            showNotification('Correggi gli errori nel modulo prima di inviare', 'error');
            return;
        }
        
        // Show loading state
        setSubmitButtonLoading(true);
        
        try {
            // Collect form data
            const formData = collectFormData();
            
            // Simulate API call (replace with real endpoint)
            const result = await submitContactForm(formData);
            
            if (result.success) {
                // Show success message
                showSuccessMessage();
                resetForm();
                
                // Analytics tracking (se disponibile)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'contact',
                        event_label: formData.servizio || 'general'
                    });
                }
                
                showNotification('Grazie! La tua richiesta è stata inviata con successo. Ti ricontatteremo entro 24 ore.', 'success');
                
            } else {
                throw new Error(result.message || 'Errore durante l\'invio');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Si è verificato un errore. Riprova o contattaci telefonicamente.', 'error');
        } finally {
            setSubmitButtonLoading(false);
        }
    }
    
    // ==========================================================================
    // FORM VALIDATION FUNCTIONS
    // ==========================================================================
    
    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            errorMessage = `Il campo ${getFieldLabel(field)} è obbligatorio`;
            isValid = false;
        }
        // Email validation
        else if (fieldType === 'email' && value && !isValidEmail(value)) {
            errorMessage = 'Inserisci un indirizzo email valido';
            isValid = false;
        }
        // Phone validation
        else if (fieldName === 'telefono' && value && !isValidPhone(value)) {
            errorMessage = 'Inserisci un numero di telefono valido';
            isValid = false;
        }
        // Text length validation
        else if (fieldType === 'text' && value && value.length < 2) {
            errorMessage = `${getFieldLabel(field)} deve contenere almeno 2 caratteri`;
            isValid = false;
        }
        // Message length validation
        else if (fieldName === 'messaggio' && value && value.length < 10) {
            errorMessage = 'Descrivi il tuo progetto con almeno 10 caratteri';
            isValid = false;
        }
        // Checkbox validation (privacy)
        else if (fieldType === 'checkbox' && field.hasAttribute('required') && !field.checked) {
            errorMessage = 'Devi accettare il trattamento dei dati personali';
            isValid = false;
        }
        
        // Show/hide error
        showFieldError(field, errorMessage);
        
        return isValid;
    }
    
    function validatePrivacyCheckbox() {
        const privacyCheckbox = document.getElementById('privacy');
        const submitButton = document.getElementById('submitBtn');
        
        if (privacyCheckbox && submitButton) {
            submitButton.disabled = !privacyCheckbox.checked;
            
            if (privacyCheckbox.checked) {
                clearFieldError(privacyCheckbox);
            }
        }
    }
    
    // ==========================================================================
    // FIELD ERROR HANDLING
    // ==========================================================================
    
    function showFieldError(field, message) {
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (message) {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
        } else {
            formGroup.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }
    
    function clearFieldError(field) {
        const formGroup = field.closest('.form-group') || field.closest('.checkbox-group');
        formGroup.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    function getFieldLabel(field) {
        const label = field.closest('.form-group').querySelector('label');
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }
    
    // ==========================================================================
    // FORM DATA COLLECTION
    // ==========================================================================
    
    function collectFormData() {
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp and source
        data.timestamp = new Date().toISOString();
        data.source = 'website_contact_form';
        data.page_url = window.location.href;
        data.user_agent = navigator.userAgent;
        
        return data;
    }
    
    // ==========================================================================
    // FORM SUBMISSION API
    // ==========================================================================
    
    async function submitContactForm(data) {
        // Simulazione invio - SOSTITUIRE CON ENDPOINT REALE
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simula successo 95% delle volte
                const success = Math.random() > 0.05;
                
                if (success) {
                    resolve({
                        success: true,
                        message: 'Richiesta inviata con successo',
                        id: 'REQ_' + Date.now()
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Errore temporaneo del server'
                    });
                }
            }, 2000); // Simula latency di 2 secondi
        });
        
        /* IMPLEMENTAZIONE REALE - Decommentare e configurare
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
        
        */
    }
    
    // ==========================================================================
    // UI FEEDBACK FUNCTIONS
    // ==========================================================================
    
    function setSubmitButtonLoading(isLoading) {
        const submitText = submitBtn.querySelector('.submit-text');
        const loadingText = submitBtn.querySelector('.loading');
        
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            submitText.style.display = 'none';
            loadingText.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitText.style.display = 'inline-block';
            loadingText.style.display = 'none';
        }
    }
    
    function showSuccessMessage() {
        if (successMessage) {
            successMessage.classList.add('show');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Hide after 10 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 10000);
        }
    }
    
    function resetForm() {
        contactForm.reset();
        
        // Clear all error states
        const errorGroups = contactForm.querySelectorAll('.form-group.error, .checkbox-group.error');
        errorGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
        
        // Re-disable submit button until privacy is checked again
        validatePrivacyCheckbox();
    }
    
    // ==========================================================================
    // QUICK CONTACT INTERACTIONS
    // ==========================================================================
    
    // Phone number click tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            const phoneNumber = this.href.replace('tel:', '');
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_click', {
                    event_category: 'contact',
                    event_label: phoneNumber
                });
            }
            
            console.log('📞 Phone click tracked:', phoneNumber);
        });
    });
    
    // Email click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            const email = this.href.replace('mailto:', '');
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    event_category: 'contact',
                    event_label: email
                });
            }
            
            console.log('📧 Email click tracked:', email);
        });
    });
    
    // WhatsApp click tracking
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'contact',
                    event_label: 'whatsapp_contact'
                });
            }
            
            console.log('💬 WhatsApp click tracked');
        });
    });
    
    // ==========================================================================
    // MAP INTEGRATION
    // ==========================================================================
    
    // Google Maps placeholder interaction
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // Apri Google Maps in nuova finestra
            const address = 'Via Roma 123, 47521 Cesena FC, Italy';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'map_click', {
                    event_category: 'contact',
                    event_label: 'directions'
                });
            }
        });
        
        // Add visual feedback
        mapPlaceholder.style.cursor = 'pointer';
        mapPlaceholder.title = 'Clicca per aprire in Google Maps';
    }
    
    // ==========================================================================
    // OFFICE HOURS DISPLAY
    // ==========================================================================
    
    // Highlight current day in office hours
    function highlightCurrentDay() {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hoursLists = document.querySelectorAll('.hours-list');
        
        hoursLists.forEach(hoursList => {
            const items = hoursList.querySelectorAll('li');
            items.forEach((item, index) => {
                // Assuming first item is Monday (1), second is Tuesday (2), etc.
                if (index === (currentDay === 0 ? 6 : currentDay - 1)) {
                    item.style.backgroundColor = 'rgba(212, 144, 43, 0.1)';
                    item.style.borderRadius = '8px';
                    item.style.padding = '0.8rem 1rem';
                    item.style.fontWeight = '600';
                }
            });
        });
    }
    
    // Show if office is currently open
    function showOfficeStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        
        let isOpen = false;
        
        // Monday to Friday: 8:00 - 18:00
        if (currentDay >= 1 && currentDay <= 5) {
            isOpen = currentHour >= 8 && currentHour < 18;
        }
        // Saturday: 8:00 - 12:00
        else if (currentDay === 6) {
            isOpen = currentHour >= 8 && currentHour < 12;
        }
        // Sunday: Closed
        
        // Add status indicator
        const officeCards = document.querySelectorAll('.hours-card');
        if (officeCards.length > 0) {
            const statusIndicator = document.createElement('div');
            statusIndicator.className = 'office-status';
            statusIndicator.innerHTML = `
                <div class="status-indicator ${isOpen ? 'open' : 'closed'}">
                    <div class="status-dot"></div>
                    <span>${isOpen ? 'Aperto ora' : 'Chiuso ora'}</span>
                </div>
            `;
            
            statusIndicator.style.cssText = `
                margin-top: 1rem;
                text-align: center;
            `;
            
            officeCards[0].appendChild(statusIndicator);
            
            // Add CSS for status indicator
            const statusCSS = `
                .status-indicator {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                .status-indicator.open {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }
                .status-indicator.closed {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            
            if (!document.getElementById('status-css')) {
                const style = document.createElement('style');
                style.id = 'status-css';
                style.textContent = statusCSS;
                document.head.appendChild(style);
            }
        }
    }
    
    // ==========================================================================
    // UTILITY FUNCTIONS
    // ==========================================================================
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Italian phone format validation
        const phoneRegex = /^(\+39|0039|39)?[\s]?([0-9]{2,3}[\s]?[0-9]{6,7}|[0-9]{3}[\s]?[0-9]{7,8}|[0-9]{10,11})$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function showNotification(message, type) {
        // Use the notification system from common.js
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback alert
            alert(message);
        }
    }
    
    // ==========================================================================
    // INITIALIZATION
    // ==========================================================================
    
    // Initialize page features
    highlightCurrentDay();
    showOfficeStatus();
    
    // Initial privacy checkbox validation
    validatePrivacyCheckbox();
    
    // Auto-focus first field if no hash in URL
    if (!window.location.hash && contactForm) {
        const firstInput = contactForm.querySelector('input:not([type="hidden"]):not([type="checkbox"])');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 500);
        }
    }
    
    // ==========================================================================
    // FORM ANALYTICS & INSIGHTS
    // ==========================================================================
    
    // Track form field interactions
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('input, select, textarea');
        
        formFields.forEach(field => {
            let startTime = null;
            
            field.addEventListener('focus', () => {
                startTime = Date.now();
            });
            
            field.addEventListener('blur', () => {
                if (startTime) {
                    const timeSpent = Date.now() - startTime;
                    console.log(`📊 Field ${field.name}: ${timeSpent}ms interaction time`);
                    
                    // Track slow fields (potential UX issues)
                    if (timeSpent > 30000) { // 30 seconds
                        console.warn(`⚠️ Slow field interaction: ${field.name}`);
                    }
                }
            });
        });
    }
    
    console.log('📧 Contatti.js loaded successfully ✅');
    console.log('📋 Form validation ready');
    console.log('☎️ Contact tracking initialized');
    
});

// ==========================================================================
// EXPORT FUNCTIONS FOR TESTING (if needed)
// ==========================================================================

// For development/testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        isValidPhone,
        validateField,
        collectFormData
    };
}