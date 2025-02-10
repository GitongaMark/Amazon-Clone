document.addEventListener("DOMContentLoaded", function () {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const form = document.getElementById('payment-form');
    const placeOrderBtn = document.getElementById('place-order-btn');
    let selectedMethod = 'paypal'; // Default payment method

    // Function to handle payment option selection
    function selectPaymentOption(method) {
        paymentOptions.forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('active');
        selectedMethod = method;
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

    // Form submission and redirection logic
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission temporarily

        if (!selectedMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Simulate payment processing
        placeOrderBtn.disabled = true; // Disable the button to prevent multiple submissions
        placeOrderBtn.textContent = 'Processing...'; // Update button text
        setTimeout(() => {
            // Redirect to the orders page after successful payment
            window.location.href = '/orders'; // Replace with the actual URL of the orders page
        }, 2000); // Simulate processing time (2 seconds)
    });
});

// Function to parse query parameters from the URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        order_id: params.get('order_id'),
        totalAfterTax: params.get('totalAfterTax')
    };
}

// Retrieve query parameters
const { order_id, totalAfterTax } = getQueryParams();

// Populate hidden input fields in the payment form
document.querySelector('input[name="order_id"]').value = order_id || '';
document.querySelector('input[name="amount"]').value = totalAfterTax || '';

// Display the total amount on the payment page
document.querySelector('.payment-info p').textContent = `Amount to Pay: $${totalAfterTax || 'N/A'}`;