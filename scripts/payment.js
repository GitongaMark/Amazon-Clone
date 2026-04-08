document.addEventListener("DOMContentLoaded", function () {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const form = document.getElementById('payment-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    let selectedMethod = 'paypal'; // Default payment method

    // Function to parse query parameters from the URL
    function getQueryParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            order_id: params.get('order_id') || null,
            totalAfterTax: params.get('totalAfterTax') || null
        };
    }

    // Retrieve query parameters
    const { order_id, totalAfterTax } = getQueryParams();

    // Debugging: Log the retrieved parameters
    console.log("Order ID:", order_id);
    console.log("Total After Tax:", totalAfterTax);

    // Validate the query parameters
    if (!order_id || !totalAfterTax) {
        console.error("Order ID or Total After Tax is missing.");
        alert("An error occurred while retrieving payment details. Please try again.");
        window.location.href = "checkout.html"; // Redirect back to checkout
        return;
    }
        

    // Parse totalAfterTax as a number
    const parsedTotalAfterTax = parseFloat(totalAfterTax);
    if (isNaN(parsedTotalAfterTax) || parsedTotalAfterTax <= 0) {
        console.error("Total after tax is invalid.");
        alert("The total amount for payment is invalid. Please try again.");
        window.location.href = "checkout.html"; // Redirect back to checkout
        return;
    }

    // Populate hidden input fields in the payment form
    document.querySelector('input[name="order_id"]').value = order_id;
    document.querySelector('input[name="amount"]').value = parsedTotalAfterTax;

    // Display the total amount on the payment page
    document.querySelector('.payment-info p').textContent = `Amount to Pay: $${parsedTotalAfterTax}`;

    // Function to handle payment option selection
    function selectPaymentOption(method) {
        paymentOptions.forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        selectedMethod = method;

        // Show/hide additional fields based on the selected payment method
        showAdditionalFields(method);
    }

    // Add click event listeners to payment options
    paymentOptions.forEach(option => {
        option.addEventListener('click', function () {
            const method = this.getAttribute('data-method');
            selectPaymentOption(method);
        });
    });

    // Pre-select the first payment method
    selectPaymentOption('paypal');

    // Function to show/hide additional fields
    function showAdditionalFields(method) {
        const cardDetails = document.getElementById('card-details');
        const mpesaDetails = document.getElementById('mpesa-details');
        const emailField = document.getElementById('email-field');

        // Hide all additional fields by default
        cardDetails.style.display = 'none';
        mpesaDetails.style.display = 'none';
        emailField.style.display = 'block'; // Email field is always visible

        // Show relevant fields based on payment method
        if (method === 'visa_master') {
            cardDetails.style.display = 'block';
        } else if (['mpesa', 'airtel_money'].includes(method)) {
            mpesaDetails.style.display = 'block';
        }
    }

    // Form submission and redirection logic
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission temporarily

        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Validate email field
        const email = form.email.value.trim();
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Validate M-Pesa/Airtel Money fields if applicable
        if (['mpesa', 'airtel_money'].includes(selectedMethod)) {
            const phoneNumber = form.phone_number.value.trim();
            if (!validatePhoneNumber(phoneNumber)) {
                alert('Please enter a valid phone number.');
                return;
            }
        }

        // Validate card details if applicable
        if (selectedMethod === 'visa_master') {
            const cardNumber = form.card_number.value.trim();
            const expiryDate = form.card_expiry.value.trim();
            const cvv = form.card_cvv.value.trim();

            if (!validateCardNumber(cardNumber)) {
                alert('Please enter a valid card number.');
                return;
            }
            if (!validateExpiryDate(expiryDate)) {
                alert('Please enter a valid expiry date (MM/YY).');
                return;
            }
            if (!validateCvv(cvv)) {
                alert('Please enter a valid CVV.');
                return;
            }
        }

        // Simulate payment processing
        placeOrderBtn.disabled = true; // Disable the button to prevent multiple submissions
        placeOrderBtn.textContent = 'Processing...'; // Update button text

        setTimeout(() => {
            // Redirect to the orders page after successful payment
            window.location.href = '/orders.html'; // Make this configurable if needed
        }, 2000); // Simulate processing time (2 seconds)
    });

    // Simple email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Simple phone number validation function
    function validatePhoneNumber(phoneNumber) {
        const re = /^\+?\d{10,15}$/; // Allow international formats and lengths between 10-15 digits
        return re.test(phoneNumber);
    }

    // Card number validation function
    function validateCardNumber(cardNumber) {
        const re = /^\d{13,19}$/; // Allow card numbers between 13-19 digits
        return re.test(cardNumber);
    }

    // Expiry date validation function
    function validateExpiryDate(expiryDate) {
        const re = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY format
        return re.test(expiryDate);
    }

    // CVV validation function
    function validateCvv(cvv) {
        const re = /^\d{3,4}$/; // CVV is typically 3 or 4 digits
        return re.test(cvv);
    }
});