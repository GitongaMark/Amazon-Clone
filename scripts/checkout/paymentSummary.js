import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let total = 0;
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  // Calculate the total price for products and shipping
  cart.forEach((cartItem) => {
    const matchingProduct = getProduct(cartItem.productId);
    if (matchingProduct) {
      productPriceCents += matchingProduct.priceCents * cartItem.quantity;
    }

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (deliveryOption) {
      shippingPriceCents += deliveryOption.priceCents;
    }
  });

  // Calculate totals including tax
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1); // 10% tax
  const totalCents = totalBeforeTaxCents + taxCents;

  // Generate the payment summary HTML
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div>Items:</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
    </div>
    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  // Insert the payment summary into the DOM
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // Add an event listener to the "Place your order" button
  document.querySelector('.js-place-order').addEventListener('click', () => {
    try {
      // Simulate adding the order to the local storage or orders.js
      const order = {
        cart: cart,
        total: totalCents,
        timestamp: new Date().toISOString(),
      };
      addOrder(order);

      // Redirect to the orders page after placing the order
      window.location.href = 'orders.html';
    } catch (error) {
      console.error('Unexpected error. Try again later:', error);
    }
  });
}