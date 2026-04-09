import { renderOrderSummary } from "./checkout/orderSummary.js";
import {
  renderPaymentSummary,
  calculatePaymentTotals,
} from "./checkout/paymentSummary.js";
import { loadProducts, getProductById } from "../data/products.js";
import { getCartItems, getTotalItemsInCart } from "../data/cart.js";
import { addOrder } from "../data/orders.js";
import { getDeliveryOption } from "../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

function updateCartCount() {
  const totalItems = getTotalItemsInCart();
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }
}

function generateOrderId() {
  return Math.random().toString(36).slice(2, 11);
}

function calculateDeliveryDate(deliveryDays) {
  return dayjs().add(deliveryDays, "days").format("YYYY-MM-DD");
}

function handlePlaceOrder() {
  const placeOrderButton = document.querySelector(".js-place-order");
  if (!placeOrderButton) {
    console.error("Place order button not found.");
    return;
  }

  placeOrderButton.addEventListener("click", () => {
    if (!confirm("Are you sure you want to proceed to pay?")) {
      return;
    }

    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      return;
    }

    const totals = calculatePaymentTotals();
    if (totals.totalCents <= 0) {
      alert("Your cart total is zero. Please add items before proceeding.");
      return;
    }

    const orderId = generateOrderId();
    const order = {
      id: orderId,
      cart: cartItems.map((item) => {
        const product = getProductById(item.productId);
        const deliveryOption = getDeliveryOption(item.deliveryOptionId);

        return {
          productId: item.productId,
          name: product?.name || "Unknown Product",
          image: product?.image || "default-image.jpg",
          quantity: item.quantity,
          deliveryDate: calculateDeliveryDate(deliveryOption?.deliveryDays || 0),
          priceCents: product?.priceCents || 0,
        };
      }),
      total: totals.totalCents,
      timestamp: new Date().toISOString(),
    };

    addOrder(order);

    const totalDollars = (totals.totalCents / 100).toFixed(2);
    const paymentUrl = `/payment?order_id=${encodeURIComponent(orderId)}&totalAfterTax=${encodeURIComponent(totalDollars)}`;
    window.location.href = paymentUrl;
  });
}

function loadPage() {
  try {
    loadProducts();

    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      window.location.href = "amazon.html";
      return;
    }

    renderOrderSummary();
    renderPaymentSummary();
    updateCartCount();
    handlePlaceOrder();
  } catch (error) {
    console.error("Unexpected error. Please try again later:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadPage);
