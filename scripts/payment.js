document.addEventListener("DOMContentLoaded", () => {
  const paymentOptions = document.querySelectorAll(".payment-option");
  const form = document.getElementById("payment-form");
  const placeOrderBtn = document.getElementById("place-order-btn");
  const orderIdInput = form.querySelector('input[name="order_id"]');
  const amountInput = form.querySelector('input[name="amount"]');
  const paymentMethodInput = form.querySelector('input[name="payment_method"]');

  const cardDetails = document.getElementById("card-details");
  const mpesaDetails = document.getElementById("mpesa-details");
  const emailField = document.getElementById("email-field");

  const cardNumberInput = form.card_number;
  const expiryInput = form.card_expiry;
  const cvvInput = form.card_cvv;
  const phoneNumberInput = form.phone_number;

  let selectedMethod = "paypal";

  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      order_id: params.get("order_id"),
      totalAfterTax: params.get("totalAfterTax") || params.get("amount"),
    };
  }

  function setRequiredState() {
    const useCard = selectedMethod === "visa_master";
    const usePhone = selectedMethod === "mpesa" || selectedMethod === "airtel_money";

    [cardNumberInput, expiryInput, cvvInput].forEach((input) => {
      input.required = useCard;
      input.disabled = !useCard;
      if (!useCard) {
        input.value = "";
      }
    });

    phoneNumberInput.required = usePhone;
    phoneNumberInput.disabled = !usePhone;
    if (!usePhone) {
      phoneNumberInput.value = "";
    }
  }

  function showAdditionalFields(method) {
    cardDetails.style.display = "none";
    mpesaDetails.style.display = "none";
    emailField.style.display = "block";

    if (method === "visa_master") {
      cardDetails.style.display = "block";
    } else if (method === "mpesa" || method === "airtel_money") {
      mpesaDetails.style.display = "block";
    }

    setRequiredState();
  }

  function selectPaymentOption(method) {
    paymentOptions.forEach((option) => option.classList.remove("active"));
    const selectedOption = document.querySelector(`[data-method="${method}"]`);
    if (!selectedOption) {
      return;
    }

    selectedOption.classList.add("active");
    selectedMethod = method;
    paymentMethodInput.value = method;
    showAdditionalFields(method);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhoneNumber(phoneNumber) {
    const re = /^\+?\d{10,15}$/;
    return re.test(phoneNumber);
  }

  function validateCardNumber(cardNumber) {
    const re = /^\d{13,19}$/;
    return re.test(cardNumber);
  }

  function validateExpiryDate(expiryDate) {
    const re = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return re.test(expiryDate);
  }

  function validateCvv(cvv) {
    const re = /^\d{3,4}$/;
    return re.test(cvv);
  }

  const params = getQueryParams();
  const orderId = params.order_id || orderIdInput.value;
  const totalAfterTax = params.totalAfterTax || amountInput.value;
  const parsedTotalAfterTax = parseFloat(totalAfterTax);

  if (!orderId || isNaN(parsedTotalAfterTax) || parsedTotalAfterTax <= 0) {
    alert("An error occurred while retrieving payment details. Please try again.");
    window.location.href = "checkout.html";
    return;
  }

  orderIdInput.value = orderId;
  amountInput.value = parsedTotalAfterTax.toFixed(2);
  document.querySelector(".payment-info p").textContent = `Amount to Pay: $${parsedTotalAfterTax.toFixed(2)}`;

  paymentOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectPaymentOption(option.dataset.method);
    });
  });

  selectPaymentOption("paypal");

  form.addEventListener("submit", (event) => {
    const email = form.email.value.trim();
    if (!validateEmail(email)) {
      event.preventDefault();
      alert("Please enter a valid email address.");
      return;
    }

    if (selectedMethod === "mpesa" || selectedMethod === "airtel_money") {
      const phoneNumber = phoneNumberInput.value.trim();
      if (!validatePhoneNumber(phoneNumber)) {
        event.preventDefault();
        alert("Please enter a valid phone number.");
        return;
      }
    }

    if (selectedMethod === "visa_master") {
      if (!validateCardNumber(cardNumberInput.value.trim())) {
        event.preventDefault();
        alert("Please enter a valid card number.");
        return;
      }
      if (!validateExpiryDate(expiryInput.value.trim())) {
        event.preventDefault();
        alert("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (!validateCvv(cvvInput.value.trim())) {
        event.preventDefault();
        alert("Please enter a valid CVV.");
        return;
      }
    }

    paymentMethodInput.value = selectedMethod;
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Processing...";
  });
});
