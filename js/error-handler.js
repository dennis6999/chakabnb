/**
 * ChakaBNB Error Handling System
 * Comprehensive error management with user-friendly messages and recovery options
 */

class ErrorHandler {
    constructor() {
        this.errorTypes = {
            NETWORK: 'network',
            VALIDATION: 'validation',
            AUTHENTICATION: 'authentication',
            AUTHORIZATION: 'authorization',
            NOT_FOUND: 'not_found',
            SERVER: 'server',
            CLIENT: 'client',
            UNKNOWN: 'unknown'
        };
        
        this.errorMessages = {
            [this.errorTypes.NETWORK]: {
                title: 'Connection Problem',
                message: 'Please check your internet connection and try again.',
                action: 'Retry'
            },
            [this.errorTypes.VALIDATION]: {
                title: 'Invalid Information',
                message: 'Please check your input and try again.',
                action: 'Fix'
            },
            [this.errorTypes.AUTHENTICATION]: {
                title: 'Login Required',
                message: 'Please sign in to continue.',
                action: 'Sign In'
            },
            [this.errorTypes.AUTHORIZATION]: {
                title: 'Access Denied',
                message: 'You don\'t have permission to perform this action.',
                action: 'Go Back'
            },
            [this.errorTypes.NOT_FOUND]: {
                title: 'Not Found',
                message: 'The requested resource could not be found.',
                action: 'Go Home'
            },
            [this.errorTypes.SERVER]: {
                title: 'Server Error',
                message: 'Something went wrong on our end. Please try again later.',
                action: 'Retry'
            },
            [this.errorTypes.CLIENT]: {
                title: 'Error',
                message: 'Something went wrong. Please try again.',
                action: 'Retry'
            },
            [this.errorTypes.UNKNOWN]: {
                title: 'Unexpected Error',
                message: 'An unexpected error occurred. Please try again.',
                action: 'Retry'
            }
        };
        
        this.init();
    }

    init() {
        // Global error handlers
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        
        // Network status monitoring
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        
        // Initialize error container
        this.createErrorContainer();
    }

    createErrorContainer() {
        if (document.getElementById('error-container')) return;
        
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2 max-w-sm';
        document.body.appendChild(container);
    }

    /**
     * Handle global JavaScript errors
     * @param {ErrorEvent} event - Error event
     */
    handleGlobalError(event) {
        console.error('Global error:', event.error);
        
        const error = {
            type: this.errorTypes.CLIENT,
            message: event.message || 'An unexpected error occurred',
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        };
        
        this.logError(error);
        this.showError(error);
    }

    /**
     * Handle unhandled promise rejections
     * @param {PromiseRejectionEvent} event - Promise rejection event
     */
    handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        const error = {
            type: this.errorTypes.CLIENT,
            message: event.reason?.message || 'A promise was rejected',
            stack: event.reason?.stack
        };
        
        this.logError(error);
        this.showError(error);
    }

    /**
     * Handle network online event
     */
    handleOnline() {
        this.showSuccess('Connection restored', 'You\'re back online!');
    }

    /**
     * Handle network offline event
     */
    handleOffline() {
        this.showError({
            type: this.errorTypes.NETWORK,
            message: 'You\'re currently offline. Some features may not work properly.'
        });
    }

    /**
     * Show error notification
     * @param {object} error - Error object
     * @param {function} onRetry - Optional retry callback
     */
    showError(error, onRetry = null) {
        const errorInfo = this.errorMessages[error.type] || this.errorMessages[this.errorTypes.UNKNOWN];
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-notification bg-red-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0';
        
        errorElement.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <i data-feather="alert-circle" class="h-5 w-5"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm">${errorInfo.title}</h4>
                    <p class="text-sm opacity-90 mt-1">${error.message || errorInfo.message}</p>
                    ${onRetry ? `
                        <div class="mt-3 flex space-x-2">
                            <button onclick="this.closest('.error-notification').remove()" 
                                    class="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs font-medium transition-colors">
                                Dismiss
                            </button>
                            <button onclick="window.errorHandler.retryAction(this)" 
                                    class="bg-white text-red-500 hover:bg-gray-100 px-3 py-1 rounded text-xs font-medium transition-colors">
                                ${errorInfo.action}
                            </button>
                        </div>
                    ` : `
                        <button onclick="this.closest('.error-notification').remove()" 
                                class="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs font-medium transition-colors">
                            Dismiss
                        </button>
                    `}
                </div>
                <button onclick="this.closest('.error-notification').remove()" 
                        class="flex-shrink-0 text-white hover:text-gray-200 transition-colors">
                    <i data-feather="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;
        
        // Store retry callback
        if (onRetry) {
            errorElement.dataset.retryCallback = 'true';
            window.currentRetryCallback = onRetry;
        }
        
        const container = document.getElementById('error-container');
        container.appendChild(errorElement);
        
        // Trigger animation
        setTimeout(() => {
            errorElement.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            this.removeError(errorElement);
        }, 8000);
        
        // Refresh feather icons
        feather.replace();
    }

    /**
     * Show success notification
     * @param {string} title - Success title
     * @param {string} message - Success message
     */
    showSuccess(title, message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-notification bg-green-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0';
        
        successElement.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <i data-feather="check-circle" class="h-5 w-5"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-sm">${title}</h4>
                    <p class="text-sm opacity-90 mt-1">${message}</p>
                </div>
                <button onclick="this.closest('.success-notification').remove()" 
                        class="flex-shrink-0 text-white hover:text-gray-200 transition-colors">
                    <i data-feather="x" class="h-4 w-4"></i>
                </button>
            </div>
        `;
        
        const container = document.getElementById('error-container');
        container.appendChild(successElement);
        
        // Trigger animation
        setTimeout(() => {
            successElement.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeError(successElement);
        }, 5000);
        
        // Refresh feather icons
        feather.replace();
    }

    /**
     * Show loading state
     * @param {string} message - Loading message
     * @returns {HTMLElement} - Loading element
     */
    showLoading(message = 'Loading...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'loading-notification bg-blue-500 text-white p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full opacity-0';
        
        loadingElement.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <div class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                </div>
                <div class="flex-1">
                    <p class="text-sm font-medium">${message}</p>
                </div>
            </div>
        `;
        
        const container = document.getElementById('error-container');
        container.appendChild(loadingElement);
        
        // Trigger animation
        setTimeout(() => {
            loadingElement.classList.remove('translate-x-full', 'opacity-0');
        }, 10);
        
        return loadingElement;
    }

    /**
     * Remove error notification
     * @param {HTMLElement} element - Error element to remove
     */
    removeError(element) {
        if (!element || !element.parentNode) return;
        
        element.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }

    /**
     * Retry action handler
     * @param {HTMLElement} button - Retry button
     */
    retryAction(button) {
        const notification = button.closest('.error-notification');
        if (window.currentRetryCallback) {
            window.currentRetryCallback();
            window.currentRetryCallback = null;
        }
        this.removeError(notification);
    }

    /**
     * Log error for debugging
     * @param {object} error - Error object
     */
    logError(error) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            type: error.type,
            message: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href,
            userId: localStorage.getItem('userEmail') || 'anonymous'
        };
        
        // Store in localStorage for debugging
        try {
            const logs = JSON.parse(localStorage.getItem('error_logs') || '[]');
            logs.push(errorLog);
            
            // Keep only last 50 errors
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('error_logs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to log error:', e);
        }
        
        // In production, this would send to error tracking service
        console.error('Error logged:', errorLog);
    }

    /**
     * Get error logs
     * @returns {Array} - Array of error logs
     */
    getErrorLogs() {
        try {
            return JSON.parse(localStorage.getItem('error_logs') || '[]');
        } catch (e) {
            return [];
        }
    }

    /**
     * Clear error logs
     */
    clearErrorLogs() {
        localStorage.removeItem('error_logs');
    }

    /**
     * Handle network errors
     * @param {Error} error - Network error
     * @param {function} retryCallback - Retry callback
     */
    handleNetworkError(error, retryCallback = null) {
        const networkError = {
            type: this.errorTypes.NETWORK,
            message: error.message || 'Network request failed'
        };
        
        this.logError(networkError);
        this.showError(networkError, retryCallback);
    }

    /**
     * Handle validation errors
     * @param {Array} errors - Array of validation errors
     */
    handleValidationErrors(errors) {
        errors.forEach(error => {
            const validationError = {
                type: this.errorTypes.VALIDATION,
                message: error.message || 'Validation failed'
            };
            
            this.logError(validationError);
            this.showError(validationError);
        });
    }

    /**
     * Handle authentication errors
     * @param {Error} error - Authentication error
     */
    handleAuthError(error) {
        const authError = {
            type: this.errorTypes.AUTHENTICATION,
            message: error.message || 'Authentication failed'
        };
        
        this.logError(authError);
        this.showError(authError, () => {
            window.location.href = 'login.html';
        });
    }
}

// Global error handler instance
window.errorHandler = new ErrorHandler();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
