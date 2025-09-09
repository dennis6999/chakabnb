/**
 * ChakaBNB Security Utilities
 * Comprehensive security functions for input validation, sanitization, and protection
 */

class SecurityManager {
    constructor() {
        this.xssPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
            /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
            /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
            /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi
        ];
        
        this.suspiciousPatterns = [
            /eval\s*\(/gi,
            /expression\s*\(/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /data:application\/javascript/gi
        ];
    }

    /**
     * Sanitize user input to prevent XSS attacks
     * @param {string} input - User input to sanitize
     * @param {boolean} allowHtml - Whether to allow safe HTML tags
     * @returns {string} - Sanitized input
     */
    sanitizeInput(input, allowHtml = false) {
        if (typeof input !== 'string') return '';
        
        // Remove null bytes and control characters
        let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        // Check for XSS patterns
        for (const pattern of this.xssPatterns) {
            if (pattern.test(sanitized)) {
                console.warn('XSS attempt detected and blocked:', sanitized);
                return '';
            }
        }
        
        // Check for suspicious patterns
        for (const pattern of this.suspiciousPatterns) {
            if (pattern.test(sanitized)) {
                console.warn('Suspicious pattern detected and blocked:', sanitized);
                return '';
            }
        }
        
        if (!allowHtml) {
            // Escape HTML entities
            sanitized = sanitized
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
        }
        
        return sanitized.trim();
    }

    /**
     * Validate email format with additional security checks
     * @param {string} email - Email to validate
     * @returns {object} - Validation result with isValid and message
     */
    validateEmail(email) {
        const sanitizedEmail = this.sanitizeInput(email);
        
        if (!sanitizedEmail) {
            return { isValid: false, message: 'Email is required' };
        }
        
        if (sanitizedEmail.length > 254) {
            return { isValid: false, message: 'Email is too long' };
        }
        
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        
        if (!emailRegex.test(sanitizedEmail)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        // Check for suspicious email patterns
        const suspiciousDomains = ['tempmail', '10minutemail', 'guerrillamail', 'mailinator'];
        const domain = sanitizedEmail.split('@')[1]?.toLowerCase();
        
        if (suspiciousDomains.some(suspicious => domain?.includes(suspicious))) {
            return { isValid: false, message: 'Please use a valid email address' };
        }
        
        return { isValid: true, message: 'Valid email' };
    }

    /**
     * Validate password strength with comprehensive checks
     * @param {string} password - Password to validate
     * @returns {object} - Validation result with strength, score, and requirements
     */
    validatePassword(password) {
        const sanitizedPassword = this.sanitizeInput(password);
        
        if (!sanitizedPassword) {
            return { 
                isValid: false, 
                strength: 'weak', 
                score: 0, 
                message: 'Password is required',
                requirements: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false
                }
            };
        }
        
        const requirements = {
            length: sanitizedPassword.length >= 8,
            uppercase: /[A-Z]/.test(sanitizedPassword),
            lowercase: /[a-z]/.test(sanitizedPassword),
            number: /\d/.test(sanitizedPassword),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(sanitizedPassword)
        };
        
        let score = 0;
        Object.values(requirements).forEach(met => met && score++);
        
        let strength = 'weak';
        let message = 'Password is too weak';
        
        if (score >= 5) {
            strength = 'strong';
            message = 'Strong password';
        } else if (score >= 3) {
            strength = 'medium';
            message = 'Medium strength password';
        }
        
        // Check for common weak passwords
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
        ];
        
        if (commonPasswords.includes(sanitizedPassword.toLowerCase())) {
            strength = 'weak';
            score = 0;
            message = 'This password is too common';
        }
        
        return {
            isValid: score >= 3,
            strength,
            score,
            message,
            requirements
        };
    }

    /**
     * Validate phone number (Kenyan format)
     * @param {string} phone - Phone number to validate
     * @returns {object} - Validation result
     */
    validatePhone(phone) {
        const sanitizedPhone = this.sanitizeInput(phone);
        
        if (!sanitizedPhone) {
            return { isValid: false, message: 'Phone number is required' };
        }
        
        // Remove all non-digit characters
        const digitsOnly = sanitizedPhone.replace(/\D/g, '');
        
        // Kenyan phone number patterns
        const patterns = [
            /^254[0-9]{9}$/, // 254XXXXXXXXX
            /^0[0-9]{9}$/,   // 0XXXXXXXXX
            /^\+254[0-9]{9}$/ // +254XXXXXXXXX
        ];
        
        const isValid = patterns.some(pattern => pattern.test(digitsOnly));
        
        if (!isValid) {
            return { 
                isValid: false, 
                message: 'Please enter a valid Kenyan phone number (e.g., 0712345678 or +254712345678)' 
            };
        }
        
        return { isValid: true, message: 'Valid phone number' };
    }

    /**
     * Validate name with security checks
     * @param {string} name - Name to validate
     * @returns {object} - Validation result
     */
    validateName(name) {
        const sanitizedName = this.sanitizeInput(name);
        
        if (!sanitizedName) {
            return { isValid: false, message: 'Name is required' };
        }
        
        if (sanitizedName.length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters' };
        }
        
        if (sanitizedName.length > 50) {
            return { isValid: false, message: 'Name is too long' };
        }
        
        // Allow letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        
        if (!nameRegex.test(sanitizedName)) {
            return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
        }
        
        return { isValid: true, message: 'Valid name' };
    }

    /**
     * Generate CSRF token
     * @returns {string} - CSRF token
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Validate CSRF token
     * @param {string} token - Token to validate
     * @param {string} storedToken - Stored token to compare against
     * @returns {boolean} - Whether token is valid
     */
    validateCSRFToken(token, storedToken) {
        if (!token || !storedToken) return false;
        return token === storedToken;
    }

    /**
     * Rate limiting check
     * @param {string} key - Rate limit key (e.g., user ID, IP)
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     * @returns {object} - Rate limit status
     */
    checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 15 minutes
        const now = Date.now();
        const rateLimitKey = `rate_limit_${key}`;
        
        try {
            const stored = localStorage.getItem(rateLimitKey);
            let attempts = stored ? JSON.parse(stored) : [];
            
            // Remove old attempts outside the time window
            attempts = attempts.filter(timestamp => now - timestamp < windowMs);
            
            if (attempts.length >= maxAttempts) {
                const oldestAttempt = Math.min(...attempts);
                const resetTime = oldestAttempt + windowMs;
                const timeLeft = Math.ceil((resetTime - now) / 1000 / 60); // minutes
                
                return {
                    allowed: false,
                    remaining: 0,
                    resetTime: resetTime,
                    message: `Too many attempts. Try again in ${timeLeft} minutes.`
                };
            }
            
            // Add current attempt
            attempts.push(now);
            localStorage.setItem(rateLimitKey, JSON.stringify(attempts));
            
            return {
                allowed: true,
                remaining: maxAttempts - attempts.length,
                resetTime: null,
                message: `${maxAttempts - attempts.length} attempts remaining`
            };
        } catch (error) {
            console.error('Rate limit check failed:', error);
            return { allowed: true, remaining: maxAttempts, resetTime: null, message: 'Rate limit check failed' };
        }
    }

    /**
     * Clear rate limit for a key
     * @param {string} key - Rate limit key to clear
     */
    clearRateLimit(key) {
        const rateLimitKey = `rate_limit_${key}`;
        localStorage.removeItem(rateLimitKey);
    }
}

// Global security manager instance
window.SecurityManager = new SecurityManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}
