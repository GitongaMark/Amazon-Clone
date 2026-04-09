import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";

export function calculatePaymentTotals() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

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

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCents = totalBeforeTaxCents + taxCents;

  return {
    productPriceCents,
    shippingPriceCents,
    totalBeforeTaxCents,
    taxCents,
    totalCents,
  };
}

export function renderPaymentSummary() {
  const {
    productPriceCents,
    shippingPriceCents,
    totalBeforeTaxCents,
    taxCents,
    totalCents,
  } = calculatePaymentTotals();

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
    <button class="place-order-button button-primary js-place-order" type="button">
      Place your order
    </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
