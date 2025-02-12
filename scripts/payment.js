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
            window.location.href = '/orders.html'; 
        }, 2000); // Simulate processing time (2 seconds)
    });
});

// Function to parse query parameters from the URL
document.addEventListener("DOMContentLoaded", function () {
    // Function to parse query parameters from the URL
    // Function to parse query parameters from the URL
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
  });