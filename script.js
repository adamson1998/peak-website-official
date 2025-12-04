// Hero Slider Logic
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

// Only initialize slider if slides exist
if (slides.length > 0) {
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        if (n >= slides.length) currentSlide = 0;
        if (n < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function changeSlide(n) {
        currentSlide = n;
        showSlide(currentSlide);
    }

    function nextSlide() {
        currentSlide++;
        showSlide(currentSlide);
    }

    // Initialize the first slide on page load
    showSlide(currentSlide);

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Make changeSlide globally accessible for onclick handlers
    window.changeSlide = changeSlide;
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Dot Spinner Transition for Navigation Links
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('#')) { // Only for page navigation, not anchors
            e.preventDefault();
            const overlay = document.querySelector('.transition-overlay');
            if (overlay) {
                overlay.classList.add('active');
            }
            setTimeout(() => {
                window.location.href = href;
            }, 800); // Match animation duration
        }
    });
});

// Reservation Form Handler
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        const formMessage = document.getElementById('formMessage');

        // Get form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            guests: document.getElementById('guests').value,
            checkIn: document.getElementById('checkIn').value,
            checkOut: document.getElementById('checkOut').value,
            suitePreference: document.getElementById('suitePreference').value,
            specialRequests: document.getElementById('specialRequests').value
        };

        // Validate dates
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
            showFormMessage('error', 'Check-in date cannot be in the past.');
            return;
        }

        if (checkOutDate <= checkInDate) {
            showFormMessage('error', 'Check-out date must be after check-in date.');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            // Success
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            showFormMessage('success', 'Thank you! Your reservation request has been received. We will contact you within 24 hours to confirm your booking.');
            reservationForm.reset();

            // Log form data (for development - remove in production)
            console.log('Reservation Data:', formData);

            // Here you would typically send the data to your backend
            // fetch('/api/reservations', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // }).then(response => response.json()).then(data => {
            //     // Handle response
            // });

        }, 1500);
    });
}

function showFormMessage(type, message) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.className = 'form-message ' + type;
        formMessage.textContent = message;
        formMessage.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Newsletter Form Handler
const newsletterForms = document.querySelectorAll('#newsletterForm');
newsletterForms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailInput = this.querySelector('input[type="email"]');
        const submitBtn = this.querySelector('button[type="submit"]');
        const email = emailInput.value;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNewsletterMessage(this, 'error', 'Please enter a valid email address.');
            return;
        }

        // Show loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual API endpoint)
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNewsletterMessage(this, 'success', 'Thank you for subscribing!');
            emailInput.value = '';

            // Log email (for development - remove in production)
            console.log('Newsletter Subscription:', email);

            // Here you would typically send the data to your backend
            // fetch('/api/newsletter', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

        }, 1000);
    });
});

function showNewsletterMessage(form, type, message) {
    let messageDiv = form.parentElement.querySelector('.newsletter-message');
    if (!messageDiv) {
        messageDiv = document.getElementById('newsletterMessage');
    }

    if (messageDiv) {
        messageDiv.className = 'newsletter-message ' + type;
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Set minimum date for check-in to today
const checkInInput = document.getElementById('checkIn');
if (checkInInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;

    // Update check-out minimum when check-in changes
    checkInInput.addEventListener('change', function() {
        const checkOutInput = document.getElementById('checkOut');
        if (checkOutInput) {
            const checkInDate = new Date(this.value);
            checkInDate.setDate(checkInDate.getDate() + 1);
            checkOutInput.min = checkInDate.toISOString().split('T')[0];
        }
        updatePricing();
    });
}

// Check-out date change listener
const checkOutInput = document.getElementById('checkOut');
if (checkOutInput) {
    checkOutInput.addEventListener('change', updatePricing);
}

// Suite selection change listener
const suiteSelect = document.getElementById('suitePreference');
if (suiteSelect) {
    suiteSelect.addEventListener('change', updatePricing);
}

// Pricing Calculation Function
function updatePricing() {
    const suiteSelect = document.getElementById('suitePreference');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const pricingSummary = document.getElementById('pricingSummary');

    if (!suiteSelect || !checkInInput || !checkOutInput || !pricingSummary) return;

    const selectedOption = suiteSelect.options[suiteSelect.selectedIndex];
    const pricePerNight = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    const suiteName = selectedOption.text.split(' - ')[0];
    const checkIn = checkInInput.value;
    const checkOut = checkOutInput.value;

    // Only show pricing if suite is selected and dates are valid
    if (pricePerNight > 0 && checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        if (numberOfNights > 0) {
            const subtotal = pricePerNight * numberOfNights;

            // Check if discount is available (from URL parameter)
            const urlParams = new URLSearchParams(window.location.search);
            const hasDiscount = urlParams.get('discount') === 'true';
            const discountPercent = 0.25; // 25% discount
            const discountAmount = hasDiscount ? subtotal * discountPercent : 0;
            const total = subtotal - discountAmount;

            // Update pricing display
            document.getElementById('selectedSuite').textContent = suiteName;
            document.getElementById('pricePerNight').textContent = `$${pricePerNight}`;
            document.getElementById('numberOfNights').textContent = numberOfNights;
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;

            // Show/hide discount row
            const discountRow = document.getElementById('discountRow');
            if (hasDiscount) {
                document.getElementById('discountAmount').textContent = `-$${discountAmount.toFixed(2)}`;
                discountRow.style.display = 'flex';
            } else {
                discountRow.style.display = 'none';
            }

            pricingSummary.style.display = 'block';
        } else {
            pricingSummary.style.display = 'none';
        }
    } else {
        pricingSummary.style.display = 'none';
    }
}

// Check for discount on page load
if (checkInInput || suiteSelect) {
    updatePricing();
}
