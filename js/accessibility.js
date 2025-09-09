/**
 * ChakaBNB Accessibility Enhancement System
 * Comprehensive accessibility features for WCAG 2.1 AA compliance
 */

class AccessibilityManager {
    constructor() {
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.skipLinks = [];
        this.announcements = [];
        this.init();
    }

    init() {
        this.createSkipLinks();
        this.enhanceKeyboardNavigation();
        this.addAriaLabels();
        this.improveColorContrast();
        this.addFocusManagement();
        this.createAnnouncementRegion();
        this.enhanceFormAccessibility();
        this.addScreenReaderSupport();
        this.detectReducedMotion();
    }

    /**
     * Create skip links for keyboard navigation
     */
    createSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links sr-only focus-within:not-sr-only';
        skipLinksContainer.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#search" class="skip-link">Skip to search</a>
        `;
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
        
        // Add CSS for skip links
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 1000;
            }
            .skip-link {
                display: block;
                padding: 8px 16px;
                background: #003B95;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-bottom: 4px;
                transition: top 0.3s;
            }
            .skip-link:focus {
                top: 6px;
                outline: 2px solid #4CAF50;
                outline-offset: 2px;
            }
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            .sr-only.focus-within:not-sr-only {
                position: static;
                width: auto;
                height: auto;
                padding: inherit;
                margin: inherit;
                overflow: visible;
                clip: auto;
                white-space: normal;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enhance keyboard navigation
     */
    enhanceKeyboardNavigation() {
        // Add keyboard event listeners
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
        
        // Trap focus in modals
        this.setupFocusTrap();
        
        // Add visible focus indicators
        this.enhanceFocusIndicators();
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardNavigation(event) {
        // ESC key to close modals
        if (event.key === 'Escape') {
            this.closeModals();
        }
        
        // Tab navigation enhancement
        if (event.key === 'Tab') {
            this.handleTabNavigation(event);
        }
        
        // Enter/Space for custom elements
        if (event.key === 'Enter' || event.key === ' ') {
            this.handleActivation(event);
        }
    }

    /**
     * Handle tab navigation
     * @param {KeyboardEvent} event - Tab event
     */
    handleTabNavigation(event) {
        const focusableElements = document.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            // Shift + Tab (backward)
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab (forward)
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Handle element activation
     * @param {KeyboardEvent} event - Activation event
     */
    handleActivation(event) {
        const target = event.target;
        
        // Handle custom buttons
        if (target.getAttribute('role') === 'button' && !target.disabled) {
            event.preventDefault();
            target.click();
        }
        
        // Handle custom links
        if (target.getAttribute('role') === 'link') {
            event.preventDefault();
            const href = target.getAttribute('data-href') || target.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        }
    }

    /**
     * Setup focus trap for modals
     */
    setupFocusTrap() {
        const modals = document.querySelectorAll('[role="dialog"], .modal, #booking-modal, #gallery-modal');
        
        modals.forEach(modal => {
            modal.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    this.trapFocusInModal(event, modal);
                }
            });
        });
    }

    /**
     * Trap focus within modal
     * @param {KeyboardEvent} event - Tab event
     * @param {HTMLElement} modal - Modal element
     */
    trapFocusInModal(event, modal) {
        const focusableElements = modal.querySelectorAll(this.focusableElements);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (focusableElements.length === 0) return;
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Enhance focus indicators
     */
    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid #4CAF50 !important;
                outline-offset: 2px !important;
            }
            
            button:focus,
            input:focus,
            select:focus,
            textarea:focus,
            a:focus {
                box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.3) !important;
            }
            
            .focus-visible:focus {
                outline: 2px solid #4CAF50 !important;
                outline-offset: 2px !important;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                *:focus {
                    outline: 3px solid #000000 !important;
                    outline-offset: 3px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add ARIA labels to elements
     */
    addAriaLabels() {
        // Add ARIA labels to buttons without text
        const iconButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        iconButtons.forEach(button => {
            const icon = button.querySelector('[data-feather]');
            if (icon) {
                const iconName = icon.getAttribute('data-feather');
                const label = this.getIconLabel(iconName);
                button.setAttribute('aria-label', label);
            }
        });
        
        // Add ARIA labels to form inputs
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                if (!label.id) {
                    label.id = `label-${input.id}`;
                }
            }
        });
        
        // Add ARIA labels to navigation
        const navs = document.querySelectorAll('nav:not([aria-label])');
        navs.forEach(nav => {
            nav.setAttribute('aria-label', 'Main navigation');
        });
        
        // Add ARIA labels to search forms
        const searchForms = document.querySelectorAll('form[role="search"]:not([aria-label])');
        searchForms.forEach(form => {
            form.setAttribute('aria-label', 'Search properties');
        });
    }

    /**
     * Get accessible label for icon
     * @param {string} iconName - Feather icon name
     * @returns {string} - Accessible label
     */
    getIconLabel(iconName) {
        const iconLabels = {
            'menu': 'Open menu',
            'x': 'Close',
            'search': 'Search',
            'filter': 'Filter',
            'heart': 'Add to favorites',
            'star': 'Rating',
            'map-pin': 'Location',
            'calendar': 'Date',
            'users': 'Guests',
            'dollar-sign': 'Price',
            'wifi': 'WiFi available',
            'car': 'Parking available',
            'coffee': 'Breakfast included',
            'shield': 'Security',
            'camera': 'View photos',
            'phone': 'Call',
            'mail': 'Email',
            'lock': 'Password',
            'eye': 'Show password',
            'eye-off': 'Hide password',
            'check': 'Selected',
            'plus': 'Add',
            'minus': 'Remove',
            'chevron-left': 'Previous',
            'chevron-right': 'Next',
            'chevron-up': 'Expand',
            'chevron-down': 'Collapse',
            'external-link': 'Open in new tab',
            'download': 'Download',
            'upload': 'Upload',
            'edit': 'Edit',
            'trash': 'Delete',
            'save': 'Save',
            'refresh': 'Refresh',
            'alert-circle': 'Error',
            'check-circle': 'Success',
            'info': 'Information',
            'help-circle': 'Help'
        };
        
        return iconLabels[iconName] || iconName;
    }

    /**
     * Improve color contrast
     */
    improveColorContrast() {
        const style = document.createElement('style');
        style.textContent = `
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .text-gray-600 {
                    color: #000000 !important;
                }
                .text-gray-500 {
                    color: #000000 !important;
                }
                .bg-gray-100 {
                    background-color: #ffffff !important;
                    border: 1px solid #000000 !important;
                }
                .border-gray-300 {
                    border-color: #000000 !important;
                }
            }
            
            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .bg-white {
                    background-color: #1a1a1a !important;
                    color: #ffffff !important;
                }
                .text-gray-900 {
                    color: #ffffff !important;
                }
                .text-gray-600 {
                    color: #cccccc !important;
                }
                .border-gray-300 {
                    border-color: #444444 !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Add focus management
     */
    addFocusManagement() {
        // Store last focused element
        let lastFocusedElement = null;
        
        // Track focus changes
        document.addEventListener('focusin', (event) => {
            lastFocusedElement = event.target;
        });
        
        // Restore focus when modal closes
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal-close') || 
                event.target.closest('.modal-close')) {
                setTimeout(() => {
                    if (lastFocusedElement && lastFocusedElement.focus) {
                        lastFocusedElement.focus();
                    }
                }, 100);
            }
        });
    }

    /**
     * Create announcement region for screen readers
     */
    createAnnouncementRegion() {
        const announcementRegion = document.createElement('div');
        announcementRegion.id = 'announcement-region';
        announcementRegion.setAttribute('aria-live', 'polite');
        announcementRegion.setAttribute('aria-atomic', 'true');
        announcementRegion.className = 'sr-only';
        document.body.appendChild(announcementRegion);
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     * @param {string} priority - Priority level (polite or assertive)
     */
    announce(message, priority = 'polite') {
        const announcementRegion = document.getElementById('announcement-region');
        if (announcementRegion) {
            announcementRegion.setAttribute('aria-live', priority);
            announcementRegion.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                announcementRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Enhance form accessibility
     */
    enhanceFormAccessibility() {
        // Add error announcements
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('invalid', (event) => {
                const field = event.target;
                const errorMessage = field.validationMessage;
                this.announce(`Error: ${errorMessage}`, 'assertive');
            });
        });
        
        // Add success announcements
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    this.announce('Form submitted successfully', 'polite');
                }, 1000);
            });
        });
    }

    /**
     * Add screen reader support
     */
    addScreenReaderSupport() {
        // Add screen reader only text for context
        this.addScreenReaderText();
        
        // Enhance table accessibility
        this.enhanceTableAccessibility();
        
        // Add loading announcements
        this.addLoadingAnnouncements();
    }

    /**
     * Add screen reader only text
     */
    addScreenReaderText() {
        // Add context for property cards
        const propertyCards = document.querySelectorAll('.property-card');
        propertyCards.forEach((card, index) => {
            const title = card.querySelector('h3, .property-title');
            if (title && !card.querySelector('.sr-only')) {
                const srText = document.createElement('span');
                srText.className = 'sr-only';
                srText.textContent = `Property ${index + 1}: ${title.textContent}`;
                card.insertBefore(srText, card.firstChild);
            }
        });
    }

    /**
     * Enhance table accessibility
     */
    enhanceTableAccessibility() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (!table.getAttribute('role')) {
                table.setAttribute('role', 'table');
            }
            
            const headers = table.querySelectorAll('th');
            headers.forEach(header => {
                if (!header.getAttribute('scope')) {
                    header.setAttribute('scope', 'col');
                }
            });
        });
    }

    /**
     * Add loading announcements
     */
    addLoadingAnnouncements() {
        // Monitor loading states
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;
                    if (element.classList.contains('loading')) {
                        this.announce('Loading content, please wait', 'polite');
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            attributes: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }

    /**
     * Detect reduced motion preference
     */
    detectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Close all open modals
     */
    closeModals() {
        const modals = document.querySelectorAll('[role="dialog"], .modal, #booking-modal, #gallery-modal');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                const closeButton = modal.querySelector('.modal-close, [aria-label*="close"], [aria-label*="Close"]');
                if (closeButton) {
                    closeButton.click();
                }
            }
        });
    }

    /**
     * Make element focusable
     * @param {HTMLElement} element - Element to make focusable
     * @param {number} tabIndex - Tab index (default: 0)
     */
    makeFocusable(element, tabIndex = 0) {
        element.setAttribute('tabindex', tabIndex);
        element.setAttribute('role', 'button');
    }

    /**
     * Remove focus from element
     * @param {HTMLElement} element - Element to remove focus from
     */
    removeFocus(element) {
        element.setAttribute('tabindex', '-1');
    }
}

// Global accessibility manager instance
window.accessibilityManager = new AccessibilityManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AccessibilityManager;
}
