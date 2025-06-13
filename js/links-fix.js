/* ==========================================================================
   DENCA - JAVASCRIPT LINKS FIX
   Correzione dei link interni errati in tutti i file JS
   ========================================================================== */

/**
 * CORREZIONI NECESSARIE NEI FILE JAVASCRIPT:
 * 
 * 1. index.js - Correggere i link nei CTA buttons
 * 2. servizi.js - Correggere i link nei form actions
 * 3. progetti.js - Correggere i link nel modal
 * 4. contatti.js - Nessuna correzione necessaria
 * 5. chi-siamo.js - Nessuna correzione necessaria
 */

// ==========================================================================
// CORREZIONI PER INDEX.JS
// ==========================================================================

/* 
SOSTITUIRE in index.js alla riga ~85 circa:

❌ ERRATO:
<a href="contact.html" class="cta-button cta-primary">
<a href="projects.html" class="cta-button cta-secondary">

✅ CORRETTO:
<a href="contatti.html" class="cta-button cta-primary">
<a href="progetti.html" class="cta-button cta-secondary">
*/

// Funzione per correggere automaticamente i link nell'HTML
function fixInternalLinks() {
    console.log('🔧 Correzione link interni in corso...');
    
    // Correzione link contatti
    const contactLinks = document.querySelectorAll('a[href="contact.html"]');
    contactLinks.forEach(link => {
        link.href = 'contatti.html';
        console.log('✅ Corretto link contatti:', link);
    });
    
    // Correzione link progetti
    const projectLinks = document.querySelectorAll('a[href="projects.html"]');
    projectLinks.forEach(link => {
        link.href = 'progetti.html';
        console.log('✅ Corretto link progetti:', link);
    });
    
    // Correzione link servizi
    const serviceLinks = document.querySelectorAll('a[href="services.html"]');
    serviceLinks.forEach(link => {
        link.href = 'servizi.html';
        console.log('✅ Corretto link servizi:', link);
    });
    
    console.log('✅ Correzione link interni completata');
}

// ==========================================================================
// CORREZIONI PER SERVIZI.JS
// ==========================================================================

/* 
SOSTITUIRE in servizi.js alla riga ~350 circa:

❌ ERRATO:
window.requestQuote = function(serviceName) {
    const contactUrl = `contatti.html?service=${encodeURIComponent(serviceName)}`;
    window.location.href = contactUrl;
}

✅ CORRETTO (già corretto, ma verificare):
window.requestQuote = function(serviceName) {
    const contactUrl = `contatti.html?service=${encodeURIComponent(serviceName)}`;
    window.location.href = contactUrl;
}
*/

// Funzione migliorata per gestire i parametri URL
function handleServiceQuoteRequest(serviceName, urgency = 'normal') {
    const params = new URLSearchParams({
        service: serviceName,
        urgency: urgency,
        source: 'servizi_page'
    });
    
    const contactUrl = `contatti.html?${params.toString()}`;
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'quote_request_detailed', {
            event_category: 'conversion',
            event_label: serviceName,
            service_urgency: urgency
        });
    }
    
    window.location.href = contactUrl;
}

// ==========================================================================
// CORREZIONI PER PROGETTI.JS
// ==========================================================================

/* 
SOSTITUIRE in progetti.js alla riga ~280 circa:

❌ ERRATO:
window.contactForProject = function(projectTitle) {
    const contactUrl = `contatti.html?ref=${encodeURIComponent(projectTitle)}`;
    window.location.href = contactUrl;
}

✅ CORRETTO (già corretto, ma aggiungere più parametri):
*/

function contactForProject(projectTitle, projectCategory = '') {
    const params = new URLSearchParams({
        ref: projectTitle,
        type: 'project_inquiry',
        category: projectCategory,
        source: 'progetti_page'
    });
    
    const contactUrl = `contatti.html?${params.toString()}`;
    
    // Analytics tracking migliorato
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_from_project_enhanced', {
            event_category: 'conversion',
            event_label: projectTitle,
            project_category: projectCategory
        });
    }
    
    window.location.href = contactUrl;
}

// ==========================================================================
// FUNZIONI UTILITY PER GESTIONE URL E PARAMETRI
// ==========================================================================

/**
 * Ottiene i parametri URL dalla pagina corrente
 * Utile per pre-compilare i form di contatto
 */
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        service: params.get('service'),
        ref: params.get('ref'),
        type: params.get('type'),
        category: params.get('category'),
        source: params.get('source'),
        urgency: params.get('urgency')
    };
}

/**
 * Pre-compila il form di contatto basandosi sui parametri URL
 * Da chiamare nel file contatti.js
 */
function prefillContactForm() {
    const params = getUrlParameters();
    
    if (params.service) {
        const serviceSelect = document.getElementById('servizio');
        if (serviceSelect) {
            // Mappa i nomi dei servizi ai valori del select
            const serviceMapping = {
                'Impianti Fotovoltaici': 'fotovoltaico',
                'Infissi': 'infissi',
                'Edilizia Residenziale e Industriale': 'edilizia',
                'Impermeabilizzazioni': 'impermeabilizzazioni'
            };
            
            const selectValue = serviceMapping[params.service] || params.service.toLowerCase();
            serviceSelect.value = selectValue;
        }
    }
    
    if (params.urgency) {
        const urgencySelect = document.getElementById('urgenza');
        if (urgencySelect) {
            urgencySelect.value = params.urgency;
        }
    }
    
    if (params.ref || params.type) {
        const messageTextarea = document.getElementById('messaggio');
        if (messageTextarea && !messageTextarea.value) {
            let message = '';
            
            if (params.ref) {
                message += `Riferimento progetto: ${params.ref}\n\n`;
            }
            
            if (params.type === 'project_inquiry') {
                message += 'Sono interessato a un progetto simile a quello che ho visto nel vostro portfolio. ';
            }
            
            if (params.category) {
                message += `Categoria di interesse: ${params.category}\n\n`;
            }
            
            message += 'Vorrei ricevere maggiori informazioni e un preventivo personalizzato.';
            
            messageTextarea.value = message;
        }
    }
    
    console.log('📝 Form pre-compilato con parametri URL:', params);
}

// ==========================================================================
// CORREZIONI HTML DA APPLICARE
// ==========================================================================

/**
 * Lista completa delle correzioni HTML da applicare manualmente:
 */

const HTML_CORRECTIONS = {
    // index.html - Hero Section
    hero_cta_buttons: {
        wrong: `<a href="contact.html" class="cta-button cta-primary">`,
        correct: `<a href="contatti.html" class="cta-button cta-primary">`
    },
    
    hero_cta_secondary: {
        wrong: `<a href="projects.html" class="cta-button cta-secondary">`,
        correct: `<a href="progetti.html" class="cta-button cta-secondary">`
    },
    
    // index.html - CTA Final Section
    final_cta: {
        wrong: `<a href="contact.html" class="cta-button">`,
        correct: `<a href="contatti.html" class="cta-button">`
    },
    
    // servizi.html - Service Cards CTA
    service_cta: {
        wrong: `<a href="contact.html" class="cta-button">`,
        correct: `<a href="contatti.html" class="cta-button">`
    },
    
    service_cta_2: {
        wrong: `<a href="projects.html" class="cta-button cta-secondary">`,
        correct: `<a href="progetti.html" class="cta-button cta-secondary">`
    }
};

// ==========================================================================
// FUNZIONE DI VALIDAZIONE LINK
// ==========================================================================

/**
 * Valida tutti i link interni della pagina
 * Utile per debug e testing
 */
function validateInternalLinks() {
    const internalLinks = document.querySelectorAll('a[href^="#"], a[href$=".html"]');
    const validPages = ['index.html', 'servizi.html', 'chi-siamo.html', 'progetti.html', 'contatti.html'];
    const issues = [];
    
    internalLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip anchor links
        if (href.startsWith('#')) return;
        
        // Check if it's a valid internal page
        if (href.endsWith('.html') && !validPages.includes(href)) {
            issues.push({
                element: link,
                href: href,
                text: link.textContent.trim(),
                issue: 'Invalid page reference'
            });
        }
        
        // Check for old naming convention
        if (href === 'contact.html' || href === 'projects.html' || href === 'services.html') {
            issues.push({
                element: link,
                href: href,
                text: link.textContent.trim(),
                issue: 'Old naming convention detected'
            });
        }
    });
    
    if (issues.length > 0) {
        console.warn('🚨 Link validation issues found:');
        issues.forEach(issue => {
            console.warn(`- ${issue.issue}: "${issue.href}" in "${issue.text}"`);
        });
        return false;
    } else {
        console.log('✅ All internal links are valid');
        return true;
    }
}

// ==========================================================================
// MIGLIORAMENTI ANALYTICS
// ==========================================================================

/**
 * Sistema di tracking migliorato per i link interni
 */
function initializeEnhancedLinkTracking() {
    const trackableLinks = document.querySelectorAll('a[href$=".html"]');
    
    trackableLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const linkText = this.textContent.trim();
            const linkContext = this.closest('section')?.className || 'unknown';
            
            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'internal_link_click', {
                    event_category: 'navigation',
                    event_label: href,
                    link_text: linkText,
                    link_context: linkContext
                });
            }
            
            console.log('🔗 Internal link clicked:', {
                href: href,
                text: linkText,
                context: linkContext
            });
        });
    });
    
    console.log('📊 Enhanced link tracking initialized for', trackableLinks.length, 'links');
}

// ==========================================================================
// FUNZIONI DI INIZIALIZZAZIONE
// ==========================================================================

/**
 * Inizializza tutte le correzioni e miglioramenti
 * Da chiamare nel DOMContentLoaded di ogni pagina
 */
function initializeLinkCorrections() {
    console.log('🚀 Initializing link corrections...');
    
    // Applica correzioni automatiche
    fixInternalLinks();
    
    // Valida tutti i link
    validateInternalLinks();
    
    // Inizializza tracking migliorato
    initializeEnhancedLinkTracking();
    
    // Pre-compila form se siamo sulla pagina contatti
    if (window.location.pathname.includes('contatti.html')) {
        // Aspetta che il DOM sia completamente caricato
        setTimeout(prefillContactForm, 100);
    }
    
    console.log('✅ Link corrections initialized successfully');
}

// ==========================================================================
// ESPORTAZIONE PER USO MODULARE
// ==========================================================================

// Per uso nei singoli file JavaScript
window.DencaLinkUtils = {
    fixInternalLinks,
    validateInternalLinks,
    prefillContactForm,
    getUrlParameters,
    contactForProject,
    handleServiceQuoteRequest,
    initializeLinkCorrections
};

// ==========================================================================
// AUTO-INIZIALIZZAZIONE
// ==========================================================================

// Inizializza automaticamente quando il DOM è pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLinkCorrections);
} else {
    // DOM già caricato
    initializeLinkCorrections();
}

// ==========================================================================
// ISTRUZIONI PER L'IMPLEMENTAZIONE
// ==========================================================================

/*
📋 CHECKLIST IMPLEMENTAZIONE:

✅ 1. INCLUDERE QUESTO FILE
   - Aggiungere <script src="js/links-fix.js"></script> in tutte le pagine HTML
   - Includere PRIMA degli altri file JavaScript specifici

✅ 2. CORREZIONI MANUALI HTML
   Sostituire manualmente nei file HTML:
   
   index.html:
   - href="contact.html" → href="contatti.html" 
   - href="projects.html" → href="progetti.html"
   
   servizi.html:
   - href="contact.html" → href="contatti.html"
   - href="projects.html" → href="progetti.html"

✅ 3. AGGIORNARE CONTATTI.JS
   Aggiungere alla fine del file contatti.js:
   
   // Inizializza pre-compilazione form
   if (window.DencaLinkUtils) {
       window.DencaLinkUtils.prefillContactForm();
   }

✅ 4. TESTARE FUNZIONALITÀ
   - Aprire console browser
   - Verificare che non ci siano errori
   - Testare i link da servizi → contatti
   - Testare i link da progetti → contatti
   - Verificare pre-compilazione form

✅ 5. GOOGLE MAPS
   In contatti.html sostituire il placeholder con:
   
   <iframe 
       class="map-frame"
       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11547.123456789!2d12.123456!3d44.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sVia%20Roma%20123%2C%20Cesena!5e0!3m2!1sit!2sit!4v1234567890123!5m2!1sit!2sit"
       allowfullscreen="" 
       loading="lazy">
   </iframe>

🎯 RISULTATO ATTESO:
- Link interni funzionanti
- Form pre-compilato dai parametri URL  
- Analytics tracking migliorato
- Mappa Google Maps funzionante
- Validazione automatica link
*/